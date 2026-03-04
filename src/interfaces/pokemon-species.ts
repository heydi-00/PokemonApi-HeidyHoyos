// Respuesta de GET /pokemon-species/:id

export interface PokemonSpeciesResponse {
  id:                   number;
  name:                 string;
  flavor_text_entries:  FlavorTextEntry[];
  genera:               Genus[];
}

export interface FlavorTextEntry {
  flavor_text: string;
  language: {
    name: string;
    url:  string;
  };
  version: {
    name: string;
    url:  string;
  };
}

export interface Genus {
  genus: string;
  language: {
    name: string;
    url:  string;
  };
}
