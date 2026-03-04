// Objeto limpio que usa la app internamente
// (resultado de mapear la respuesta cruda del API)

export type PokemonMapped = {
  id:          number;
  name:        string;
  image:       string;
  types:       string[];
  description: string;
  height:      string;
  weight:      string;
  stats:       PokemonStat[];
};

export type PokemonStat = {
  name:  string;
  value: number;
};

// Objeto básico que usamos en el listado general
export type PokemonBasic = {
  id:   number;
  name: string;
};
