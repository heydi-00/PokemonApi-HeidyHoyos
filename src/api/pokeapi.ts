import type { PokemonDetailResponse }  from '../interfaces/pokemon-detail';
import type { PokemonListResponse }    from '../interfaces/pokemon-list';
import type { PokemonSpeciesResponse } from '../interfaces/pokemon-species';

const BASE_URL  = 'https://pokeapi.co/api/v2';
const SPRITE_URL = (id: number): string =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

const fetchJSON = async <T>(url: string): Promise<T> => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
  return response.json() as Promise<T>;
};

export class PokeApiAdapter {

  // Lista paginada de pokémon
  async getList(limit: number = 40, offset: number = 0): Promise<PokemonListResponse> {
    return fetchJSON<PokemonListResponse>(
      `${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`
    );
  }

  // Detalle completo de un pokémon (por nombre o id)
  async getDetail(nameOrId: string | number): Promise<PokemonDetailResponse> {
    return fetchJSON<PokemonDetailResponse>(
      `${BASE_URL}/pokemon/${String(nameOrId).toLowerCase()}`
    );
  }

  // Especie → para obtener descripción en español
  async getSpecies(nameOrId: string | number): Promise<PokemonSpeciesResponse> {
    return fetchJSON<PokemonSpeciesResponse>(
      `${BASE_URL}/pokemon-species/${String(nameOrId).toLowerCase()}`
    );
  }

  // URL del sprite oficial
  getSpriteUrl(id: number): string {
    return SPRITE_URL(id);
  }
}
