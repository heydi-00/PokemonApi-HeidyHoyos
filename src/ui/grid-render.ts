import type { PokemonBasic, PokemonMapped } from '../interfaces/pokemon-types';
import { getDiscoveredIds }            from '../services/pokemon-service';
import {
  renderDiscoveredCard,
  renderUndiscoveredCard,
  replaceCard,
} from './card-render';

// ─── Agrega una lista de básicos al grid ─────────────────────────
export const appendPokemonList = (
  grid:       HTMLElement,
  items:      PokemonBasic[],
  discovered: Set<number>,
  cachedFull: Map<number, PokemonMapped>,
  onUndiscoveredClick: (id: number, name: string) => void,
  onDiscoveredClick:   (id: number)               => void
): void => {
  items.forEach(basic => {
    let card: HTMLElement;

    if (discovered.has(basic.id) && cachedFull.has(basic.id)) {
      card = renderDiscoveredCard(
        cachedFull.get(basic.id)!,
        onDiscoveredClick
      );
    } else {
      card = renderUndiscoveredCard(basic, onUndiscoveredClick);
    }

    grid.appendChild(card);
  });
};

// ─── Actualiza una card a "descubierta" ──────────────────────────
export const upgradeCard = (
  grid:    HTMLElement,
  pokemon: PokemonMapped,
  onDiscoveredClick: (id: number) => void
): void => {
  const newCard = renderDiscoveredCard(pokemon, onDiscoveredClick);
  replaceCard(grid, newCard, pokemon.id);
};

// ─── Muestra u oculta el loader ──────────────────────────────────
export const setLoaderVisible = (
  loader: HTMLElement,
  grid:   HTMLElement,
  show:   boolean
): void => {
  loader.style.display = show ? 'flex' : 'none';
  grid.style.display   = show ? 'none' : 'grid';
};

// ─── Muestra u oculta el botón "cargar más" ──────────────────────
export const setLoadMoreVisible = (
  wrap:    HTMLElement,
  visible: boolean
): void => {
  wrap.style.display = visible ? 'flex' : 'none';
};

// ─── Actualiza el contador de descubiertos ───────────────────────
export const updateDiscoveredCounter = (el: HTMLElement): void => {
  el.textContent = String(getDiscoveredIds().size);
};
