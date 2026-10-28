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
