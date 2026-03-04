import { PokeApiAdapter }          from '../api/pokeapi';
import type { PokemonDetailResponse }  from '../interfaces/pokemon-detail';
import type { PokemonListResponse }    from '../interfaces/pokemon-list';
import type { PokemonSpeciesResponse } from '../interfaces/pokemon-species';
import type { PokemonBasic, PokemonMapped } from '../interfaces/pokemon-types';

// ─── Instancia del adaptador ────────────────────────────────────
const api = new PokeApiAdapter();

// ─── Clave para localStorage ────────────────────────────────────
const STORAGE_KEY = 'poke_discovered';

// ════════════════════════════════════════════════════════════════
//  TRANSFORMACIONES (mapeos)
// ════════════════════════════════════════════════════════════════

// Extrae la descripción en español de la respuesta de species
const extractDescription = ({ flavor_text_entries }: PokemonSpeciesResponse): string => {
  const entry =
    flavor_text_entries.find(e => e.language.name === 'es') ??
    flavor_text_entries[0];

  return entry
    ? entry.flavor_text.replace(/\f|\n/g, ' ').trim()
    : 'Sin descripción disponible.';
};

// Mapea la respuesta cruda del API a nuestro objeto limpio PokemonMapped
const mapPokemonDetail = (
  { id, name, types, sprites, stats, height, weight }: PokemonDetailResponse,
  description: string
): PokemonMapped => ({
  id,
  name,
  description,
  image:
    sprites.other['official-artwork'].front_default ??
    api.getSpriteUrl(id),
  types:  types.map(({ type }) => type.name),
  stats:  stats.map(({ base_stat, stat }) => ({ name: stat.name, value: base_stat })),
  height: `${(height / 10).toFixed(1)} m`,
  weight: `${(weight / 10).toFixed(1)} kg`,
});

// Mapea la lista básica → extrae el id desde la url
const mapPokemonList = ({ results }: PokemonListResponse): PokemonBasic[] =>
  results.map(({ name, url }) => {
    const id = parseInt(url.split('/').filter(Boolean).pop() ?? '0', 10);
    return { id, name };
  });

// ════════════════════════════════════════════════════════════════
//  LÓGICA DE DESCUBRIMIENTO (localStorage)
// ════════════════════════════════════════════════════════════════

export const getDiscoveredIds = (): Set<number> => {
  const raw = localStorage.getItem(STORAGE_KEY);
  return new Set<number>(raw ? JSON.parse(raw) : []);
};

export const saveDiscoveredId = (id: number): void => {
  const current = getDiscoveredIds();
  current.add(id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...current]));
};

// ════════════════════════════════════════════════════════════════
//  SERVICIOS PÚBLICOS (los usa main.ts)
// ════════════════════════════════════════════════════════════════

// Carga la lista paginada y devuelve { items, total }
export const fetchPokemonList = async (
  limit: number,
  offset: number
): Promise<{ items: PokemonBasic[]; total: number }> => {
  const response = await api.getList(limit, offset);
  return {
    items: mapPokemonList(response),
    total: response.count,
  };
};

// Busca, mapea y guarda un pokémon como descubierto
export const discoverPokemon = async (
  nameOrId: string | number
): Promise<PokemonMapped> => {
  const [detail, species] = await Promise.all([
    api.getDetail(nameOrId),
    api.getSpecies(nameOrId),
  ]);

  const description = extractDescription(species);
  const mapped      = mapPokemonDetail(detail, description);

  saveDiscoveredId(mapped.id);
  return mapped;
};

// Obtiene el sprite url para una card no descubierta
export const getSpriteUrl = (id: number): string => api.getSpriteUrl(id);
