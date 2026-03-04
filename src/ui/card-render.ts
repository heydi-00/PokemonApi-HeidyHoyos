import type { PokemonBasic, PokemonMapped } from '../interfaces/pokemon-types';
import { getSpriteUrl } from '../services/pokemon-service';

// ─── Colores por tipo ────────────────────────────────────────────
const TYPE_COLORS: Record<string, string> = {
  fire:     '#f08030', water:    '#6890f0', grass:  '#78c850',
  electric: '#f8d030', ice:      '#98d8d8', fighting:'#c03028',
  poison:   '#a040a0', ground:   '#e0c068', flying: '#a890f0',
  psychic:  '#f85888', bug:      '#a8b820', rock:   '#b8a038',
  ghost:    '#705898', dragon:   '#7038f8', dark:   '#705848',
  steel:    '#b8b8d0', fairy:    '#ee99ac', normal: '#a8a878',
};

// ─── Badge de tipo ───────────────────────────────────────────────
const createTypeBadge = (type: string): string => {
  const color = TYPE_COLORS[type] ?? '#888';
  return `<span class="type-badge" style="background:${color}">${type}</span>`;
};

// ─── Card NO descubierta ─────────────────────────────────────────
export const renderUndiscoveredCard = (
  { id, name }: PokemonBasic,
  onClick: (id: number, name: string) => void
): HTMLElement => {
  const card = document.createElement('div');
  card.className  = 'poke-card undiscovered';
  card.dataset.id = String(id);

  card.innerHTML = `
    <span class="poke-id">#${String(id).padStart(4, '0')}</span>
    <img
      class="poke-img undiscovered-img"
      src="${getSpriteUrl(id)}"
      alt="pokemon desconocido"
      loading="lazy"
    />
    <span class="poke-name">???</span>
    <span class="poke-desc redacted">Aún no descubierto</span>
    <div class="types"></div>
  `;

  card.addEventListener('click', () => onClick(id, name));
  return card;
};

// ─── Card DESCUBIERTA ────────────────────────────────────────────
export const renderDiscoveredCard = (
  pokemon: PokemonMapped,
  onClick: (id: number) => void
): HTMLElement => {
  const { id, name, image, types, description } = pokemon;

  const shortDesc =
    description.length > 65
      ? description.slice(0, 62) + '…'
      : description;

  const card = document.createElement('div');
  card.className  = 'poke-card discovered';
  card.dataset.id = String(id);

  card.innerHTML = `
    <span class="poke-id">#${String(id).padStart(4, '0')}</span>
    <img
      class="poke-img"
      src="${image}"
      alt="${name}"
      loading="lazy"
      onerror="this.src='${getSpriteUrl(id)}'"
    />
    <span class="poke-name">${name}</span>
    <span class="poke-desc">${shortDesc}</span>
    <div class="types">
      ${types.map(createTypeBadge).join('')}
    </div>
  `;

  card.addEventListener('click', () => onClick(id));
  return card;
};

// ─── Reemplaza una card existente en el grid ─────────────────────
export const replaceCard = (
  grid: HTMLElement,
  newCard: HTMLElement,
  id: number
): void => {
  const existing = grid.querySelector<HTMLElement>(`[data-id="${id}"]`);
  if (existing) {
    grid.replaceChild(newCard, existing);
    newCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } else {
    grid.appendChild(newCard);
  }
};
