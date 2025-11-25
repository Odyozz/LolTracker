import axios from 'axios';
import { config } from '../../config/env';

const DDRAGON_BASE = 'https://ddragon.leagueoflegends.com';

interface ChampionDTO {
  id: string;
  key: string;
  name: string;
  title: string;
  tags: string[];
  image: { full: string };
}

interface ItemDTO {
  name: string;
  description: string;
  plaintext: string;
  gold: { total: number; base: number; sell: number };
  tags?: string[];
  image: { full: string };
}

export interface ChampionStatic {
  id: string; // "Aatrox"
  key: number; // 266
  name: string;
  title: string;
  tags: string[];
  icon: string; // URL directe img
}

export interface ItemStatic {
  id: number;
  name: string;
  description: string;
  plaintext: string;
  totalGold: number;
  baseGold: number;
  sellGold: number;
  tags: string[];
  icon: string;
}

export interface RuneStatic {
  id: number;
  key: string;
  name: string;
  icon: string;
  slots: any[];
}

type Cache<T> = {
  version: string | null;
  data: T | null;
  lastFetch: number | null;
};

const championsCache: Cache<ChampionStatic[]> = {
  version: null,
  data: null,
  lastFetch: null,
};

const itemsCache: Cache<ItemStatic[]> = {
  version: null,
  data: null,
  lastFetch: null,
};

const runesCache: Cache<RuneStatic[]> = {
  version: null,
  data: null,
  lastFetch: null,
};

const CACHE_TTL_MS = 1000 * 60 * 60; // 1h

async function getLatestVersion(): Promise<string> {
  const res = await axios.get<string[]>(`${DDRAGON_BASE}/api/versions.json`);
  // Version la plus récente en premier
  return res.data[0];
}

function isCacheValid(cache: Cache<any>): boolean {
  if (!cache.lastFetch) return false;
  return Date.now() - cache.lastFetch < CACHE_TTL_MS;
}

export class StaticService {
  static async getChampions(): Promise<ChampionStatic[]> {
    if (championsCache.data && isCacheValid(championsCache)) {
      return championsCache.data;
    }

    const version = await getLatestVersion();

    const res = await axios.get(
      `${DDRAGON_BASE}/cdn/${version}/data/${config.dataDragonLang}/champion.json`
    );

    const raw = res.data.data as Record<string, ChampionDTO>;

    const champions: ChampionStatic[] = Object.values(raw).map((c) => ({
      id: c.id,
      key: Number(c.key),
      name: c.name,
      title: c.title,
      tags: c.tags,
      icon: `${DDRAGON_BASE}/cdn/${version}/img/champion/${c.image.full}`,
    }));

    championsCache.version = version;
    championsCache.data = champions;
    championsCache.lastFetch = Date.now();

    return champions;
  }

  static async getItems(): Promise<ItemStatic[]> {
    if (itemsCache.data && isCacheValid(itemsCache)) {
      return itemsCache.data;
    }

    const version = await getLatestVersion();

    const res = await axios.get(
      `${DDRAGON_BASE}/cdn/${version}/data/${config.dataDragonLang}/item.json`
    );

    const raw = res.data.data as Record<string, ItemDTO>;

    const items: ItemStatic[] = Object.entries(raw).map(([id, item]) => ({
      id: Number(id),
      name: item.name,
      description: item.description,
      plaintext: item.plaintext,
      totalGold: item.gold.total,
      baseGold: item.gold.base,
      sellGold: item.gold.sell,
      tags: item.tags || [],
      icon: `${DDRAGON_BASE}/cdn/${version}/img/item/${item.image.full}`,
    }));

    itemsCache.version = version;
    itemsCache.data = items;
    itemsCache.lastFetch = Date.now();

    return items;
  }

  static async getRunes(): Promise<RuneStatic[]> {
    if (runesCache.data && isCacheValid(runesCache)) {
      return runesCache.data;
    }

    const version = await getLatestVersion(); // pas nécessaire pour l’URL, mais pratique si tu veux l’exposer

    const res = await axios.get(
      `${DDRAGON_BASE}/cdn/${version}/data/${config.dataDragonLang}/runesReforged.json`
    );

    const runes: RuneStatic[] = (res.data as any[]).map((tree) => ({
      id: tree.id,
      key: tree.key,
      name: tree.name,
      icon: `${DDRAGON_BASE}/cdn/img/${tree.icon}`,
      slots: tree.slots,
    }));

    runesCache.version = version;
    runesCache.data = runes;
    runesCache.lastFetch = Date.now();

    return runes;
  }
}
