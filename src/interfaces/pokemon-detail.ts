export interface PokemonDetailResponse {
  id:      number;
  name:    string;
  height:  number;
  weight:  number;
  types:   PokemonTypeSlot[];
  stats:   PokemonStatSlot[];
  sprites: PokemonSprites;
}

export interface PokemonTypeSlot {
  slot: number;
  type: {
    name: string;
    url:  string;
  };
}

export interface PokemonStatSlot {
  base_stat: number;
  effort:    number;
  stat: {
    name: string;
    url:  string;
  };
}

export interface PokemonSprites {
  front_default: string | null;
  other: {
    'official-artwork': {
      front_default: string | null;
    };
  };
}
