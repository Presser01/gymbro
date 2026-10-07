// A titkosított mentés kibontása a böngészőben, bitre ugyanúgy, mint az app
// (lib/services/account_crypto.dart, lib/data/backup/cloud_backup.dart):
//
// - só: SHA-256("gymbro-v1:" + kisbetűs e-mail);
// - Argon2id (32 MiB, 2 kör, 1 szál) → mesterkulcs;
// - HKDF-SHA256 → belépési kulcs (a szerver ezt kapja jelszó helyett) és
//   csomagoló kulcs (a szerver soha nem látja);
// - a csomagoló kulccsal nyílik a mentés adatkulcsa (XChaCha20-Poly1305);
// - a mentés: „GBK1” + nonce (24 bájt) + titkosított adat + MAC (16 bájt),
//   a fiókhoz kötve (AAD), benne gzip-pelt JSON.
//
// A kulcsok csak a memóriában élnek; semmi nem kerül a böngésző tárolójába.

import { argon2idAsync } from '../vendor/noble-hashes/argon2.js';
import { hkdf } from '../vendor/noble-hashes/hkdf.js';
import { sha256 } from '../vendor/noble-hashes/sha2.js';
import { xchacha20poly1305 } from '../vendor/noble-ciphers/chacha.js';

const enc = new TextEncoder();
const MAGIC = [0x47, 0x42, 0x4b, 0x31]; // „GBK1”
const NONCE = 24;
const MAC = 16;

export const KDF_V1 = { v: 1, m: 32768, t: 2, p: 1 };

export const normalizeEmail = (email) => email.trim().toLowerCase();

function base64Url(bytes) {
  let s = '';
  for (const b of bytes) s += String.fromCharCode(b);
  // A Dart base64UrlEncode a kiegészítő „=” jeleket is megtartja.
  return btoa(s).replaceAll('+', '-').replaceAll('/', '_');
}

export function base64Decode(text) {
  const s = atob(text);
  const out = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i);
  return out;
}

/// A jelszóból a belépési jelszó és a csomagoló kulcs.
export async function deriveAccountKeys(email, password, kdf = KDF_V1) {
  const salt = sha256(enc.encode(`gymbro-v1:${normalizeEmail(email)}`));
  const master = await argon2idAsync(enc.encode(password), salt, {
    t: kdf.t,
    m: kdf.m,
    p: kdf.p ?? 1,
    dkLen: 32,
  });
  const auth = hkdf(sha256, master, salt, enc.encode('gymbro auth'), 32);
  const encKey = hkdf(sha256, master, salt, enc.encode('gymbro enc'), 32);
  master.fill(0);
  return { authPassword: base64Url(auth), encKey };
}

/// A profil kulcscsomagjából az adatkulcs (hibás jelszónál kivétel).
export function unwrapDataKey(bundle, encKey) {
  const box = bundle.pw;
  const nonce = base64Decode(box.n);
  const sealed = concat(base64Decode(box.c), base64Decode(box.m));
  return xchacha20poly1305(encKey, nonce).decrypt(sealed);
}

// ------------------------------------------------- helyreállító kód

const ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'; // Crockford-base32
const RECOVERY_BYTES = 20;

/// A beírt helyreállító kódból a bájtok (kötőjel, szóköz, kisbetű nem
/// számít; O → 0, I és L → 1), mint az appban. null, ha hibás.
export function parseRecoveryCode(input) {
  const s = input
    .toUpperCase()
    .replace(/[\s-]/g, '')
    .replaceAll('O', '0')
    .replace(/[IL]/g, '1');
  if (s.length !== Math.ceil((RECOVERY_BYTES * 8) / 5)) return null;
  const out = [];
  let acc = 0;
  let bits = 0;
  for (const ch of s) {
    const v = ALPHABET.indexOf(ch);
    if (v < 0) return null;
    acc = (acc << 5) | v;
    bits += 5;
    if (bits >= 8) {
      bits -= 8;
      out.push((acc >> bits) & 255);
      acc &= (1 << bits) - 1;
    }
  }
  return out.length === RECOVERY_BYTES ? Uint8Array.from(out) : null;
}

/// Az adatkulcs a helyreállító kóddal (hibás kódnál kivétel).
export function unwrapWithRecovery(bundle, codeBytes) {
  const key = hkdf(sha256, codeBytes, enc.encode('gymbro-recovery'), enc.encode('gymbro wrap'), 32);
  const box = bundle.rc;
  return xchacha20poly1305(key, base64Decode(box.n)).decrypt(
    concat(base64Decode(box.c), base64Decode(box.m)),
  );
}

/// Új jelszónál: ugyanaz az adatkulcs az új csomagoló kulccsal; a
/// helyreállító kódos rész változatlan (mint az app rewrapForPassword-je).
export function rewrapForPassword(bundle, dataKey, encKey) {
  const nonce = crypto.getRandomValues(new Uint8Array(NONCE));
  const sealed = xchacha20poly1305(encKey, nonce).encrypt(dataKey);
  return {
    kdf: bundle.kdf,
    pw: {
      n: base64(nonce),
      c: base64(sealed.subarray(0, sealed.length - MAC)),
      m: base64(sealed.subarray(sealed.length - MAC)),
    },
    rc: bundle.rc,
  };
}

function base64(bytes) {
  let s = '';
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s);
}

/// A szerverről letöltött mentés (.gbk) → a mentés JSON-ja.
export async function openBackup(bytes, dataKey, userId) {
  if (bytes.length < MAGIC.length + NONCE + MAC || MAGIC.some((b, i) => bytes[i] !== b)) {
    throw new Error('invalid backup');
  }
  const nonce = bytes.subarray(MAGIC.length, MAGIC.length + NONCE);
  const sealed = bytes.subarray(MAGIC.length + NONCE);
  const aad = enc.encode(`gymbro-backup-v1:${userId}`);
  const plain = xchacha20poly1305(dataKey, nonce, aad).decrypt(sealed);
  const text = await gunzipText(plain);
  return JSON.parse(text);
}

async function gunzipText(bytes) {
  const isGzip = bytes.length > 2 && bytes[0] === 0x1f && bytes[1] === 0x8b;
  if (!isGzip) return new TextDecoder().decode(bytes);
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
  return new Response(stream).text();
}

function concat(a, b) {
  const out = new Uint8Array(a.length + b.length);
  out.set(a, 0);
  out.set(b, a.length);
  return out;
}
