// Kis Supabase-kliens a webes nézethez (külső könyvtár nélkül, a böngésző
// fetch-ével). A belépési token csak a memóriában van: a fül bezárásakor vagy
// újratöltéskor elvész (Tamás döntése, 2026-10-07).

import { SUPABASE_KEY, SUPABASE_URL } from './config.js';

export class ApiError extends Error {
  constructor(code, message) {
    super(message ?? code);
    this.code = code;
  }
}

const NAME = /^(\d{4})(\d{2})(\d{2})-(\d{2})(\d{2})(\d{2})\.gbk$/;

/// A mentésfájl nevéből a feltöltés ideje (UTC), pl. „20261005-180200.gbk”.
export function backupTime(name) {
  const m = NAME.exec(name);
  return m ? new Date(Date.UTC(+m[1], m[2] - 1, +m[3], +m[4], +m[5], +m[6])) : null;
}

export class Api {
  #token = null;
  #refreshToken = null;
  userId = null;

  #headers(json = true) {
    const h = { apikey: SUPABASE_KEY };
    if (this.#token) h.Authorization = `Bearer ${this.#token}`;
    if (json) h['Content-Type'] = 'application/json';
    return h;
  }

  async #fetch(path, init = {}, retry = true) {
    let res;
    try {
      res = await fetch(SUPABASE_URL + path, init);
    } catch {
      throw new ApiError('network');
    }
    // A belépés egy óra után lejár: egyszer megújítjuk, és újra próbáljuk.
    if (res.status === 401 && retry && this.#refreshToken && (await this.#refresh())) {
      return this.#fetch(
        path,
        { ...init, headers: { ...init.headers, Authorization: `Bearer ${this.#token}` } },
        false,
      );
    }
    if (!res.ok) {
      let body = {};
      try {
        body = await res.json();
      } catch {
        // Nem JSON a válasz.
      }
      throw new ApiError(body.error_code ?? body.code ?? `http_${res.status}`, body.msg ?? body.message);
    }
    return res;
  }

  /// Belépés a jelszóból levezetett belépési kulccsal (a valódi jelszó
  /// nem megy el).
  async signIn(email, authPassword) {
    const res = await this.#fetch('/auth/v1/token?grant_type=password', {
      method: 'POST',
      headers: this.#headers(),
      body: JSON.stringify({ email, password: authPassword }),
    });
    const j = await res.json();
    this.#token = j.access_token;
    this.#refreshToken = j.refresh_token;
    this.userId = j.user.id;
  }

  async #refresh() {
    try {
      const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
        method: 'POST',
        headers: { apikey: SUPABASE_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: this.#refreshToken }),
      });
      if (!res.ok) return false;
      const j = await res.json();
      this.#token = j.access_token;
      this.#refreshToken = j.refresh_token;
      return true;
    } catch {
      return false;
    }
  }

  /// A saját profil: név és a titkosított kulcscsomag.
  async profile() {
    const res = await this.#fetch(
      `/rest/v1/profiles?select=username,display_name,key_bundle&user_id=eq.${this.userId}`,
      { headers: this.#headers(false) },
    );
    const rows = await res.json();
    if (!rows.length) throw new ApiError('no_profile');
    return rows[0];
  }

  /// A szerveren lévő mentések, legújabb elöl.
  async backups() {
    const res = await this.#fetch('/storage/v1/object/list/backups', {
      method: 'POST',
      headers: this.#headers(),
      body: JSON.stringify({
        prefix: this.userId,
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'desc' },
      }),
    });
    const files = await res.json();
    return files
      .map((f) => ({ name: f.name, at: backupTime(f.name) }))
      .filter((f) => f.at)
      .sort((a, b) => b.at - a.at);
  }

  async download(name) {
    const res = await this.#fetch(
      `/storage/v1/object/authenticated/backups/${this.userId}/${encodeURIComponent(name)}`,
      { headers: this.#headers(false) },
    );
    return new Uint8Array(await res.arrayBuffer());
  }

  /// A barátok heti számai és érmei (élőben a szerverről).
  async friends() {
    const res = await this.#fetch('/rest/v1/rpc/friends_overview', {
      method: 'POST',
      headers: this.#headers(),
      body: '{}',
    });
    return res.json();
  }

  async signOut() {
    if (this.#token) {
      try {
        await fetch(`${SUPABASE_URL}/auth/v1/logout`, { method: 'POST', headers: this.#headers() });
      } catch {
        // Hálózat nélkül is kilépünk (a token úgyis elvész).
      }
    }
    this.#token = null;
    this.#refreshToken = null;
    this.userId = null;
  }
}
