import type { PokemonMapped } from '../interfaces/pokemon-types';

// ─── Color según valor de estadística ───────────────────────────
const statColor = (value: number): string => {
  if (value >= 100) return '#3bd97e';
  if (value >= 60)  return '#f5a623';
  return '#e8304a';
};

// ─── Renderiza una fila de estadística ──────────────────────────
const renderStatRow = (name: string, value: number): string => `
  <div class="stat-row">
    <span class="stat-label">${name.replace('-', ' ')}</span>
    <div class="stat-bar">
      <div
        class="stat-fill"
        style="width: 0%; background: ${statColor(value)}"
        data-target="${Math.min(value, 200) / 2}%"
      ></div>
    </div>
    <span class="stat-value">${value}</span>
  </div>
`;

// ─── Llena el modal con los datos del pokémon ────────────────────
export const renderModal = (
  pokemon: PokemonMapped,
  elements: {
    img:    HTMLImageElement;
    id:     HTMLElement;
    name:   HTMLElement;
    types:  HTMLElement;
    desc:   HTMLElement;
    stats:  HTMLElement;
    height: HTMLElement;
    weight: HTMLElement;
  }
): void => {
  const { id, name, image, types, description, stats, height, weight } = pokemon;

  elements.img.src           = image;
  elements.img.alt           = name;
  elements.id.textContent    = `#${String(id).padStart(4, '0')}`;
  elements.name.textContent  = name;
  elements.height.textContent= height;
  elements.weight.textContent= weight;
  elements.desc.textContent  = description;

  elements.types.innerHTML = types
    .map(t => `<span class="type-badge-modal">${t}</span>`)
    .join('');

  elements.stats.innerHTML = stats
    .map(({ name: sName, value }) => renderStatRow(sName, value))
    .join('');
};

// ─── Anima las barras de estadísticas (después de abrir el modal) ─
export const animateStatBars = (container: HTMLElement): void => {
  requestAnimationFrame(() => {
    container.querySelectorAll<HTMLElement>('.stat-fill').forEach(el => {
      const target = el.dataset.target ?? '0%';
      el.style.width = target;
    });
  });
};

// ─── Abre / cierra el overlay ────────────────────────────────────
export const openModal  = (overlay: HTMLElement): void => overlay.classList.add('open');
export const closeModal = (overlay: HTMLElement): void => overlay.classList.remove('open');
