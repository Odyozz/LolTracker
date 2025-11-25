import { api } from './client';

export interface ChampionStatic {
  id: string;
  key: number;
  name: string;
  title: string;
  tags: string[];
  icon: string;
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

export async function fetchChampions() {
  const res = await api.get<ChampionStatic[]>('/champions');
  return res.data;
}

export async function fetchItems() {
  const res = await api.get<ItemStatic[]>('/items');
  return res.data;
}

export async function fetchRunes() {
  const res = await api.get<RuneStatic[]>('/runes');
  return res.data;
}
