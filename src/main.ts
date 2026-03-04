import './style.css';

import type { PokemonBasic } from './interfaces/pokemon-types';
import type { PokemonMapped } from './interfaces/pokemon-types';
import {
  discoverPokemon,
  fetchPokemonList,
  getDiscoveredIds,
} from './services/pokemon-service';
import {
  animateStatBars,
  closeModal,
  openModal,
  renderModal,
} from './ui/modal-render';
import {
  appendPokemonList,
  setLoaderVisible,
  setLoadMoreVisible,
  updateDiscoveredCounter,
  upgradeCard,
} from './ui/grid-render';


const state = {
  offset:     0,
  limit:      40,
  total:      0,
  loading:    false,
  basicList:  [] as PokemonBasic[],
  discovered: getDiscoveredIds(),               // Set<number>
  cache:      new Map<number, PokemonMapped>(),  // id → datos completos
};


const $grid        = document.getElementById('grid')!              as HTMLElement;
const $loader      = document.getElementById('loader')!            as HTMLElement;
const $loadMoreBtn = document.getElementById('loadMoreBtn')!       as HTMLButtonElement;
const $loadMoreWrap= document.getElementById('loadMoreWrap')!      as HTMLElement;
const $searchInput = document.getElementById('searchInput')!       as HTMLInputElement;
const $searchBtn   = document.getElementById('searchBtn')!         as HTMLButtonElement;
const $totalCount  = document.getElementById('totalCount')!        as HTMLElement;
const $discovered  = document.getElementById('discoveredCount')!   as HTMLElement;
const $toast       = document.getElementById('toast')!             as HTMLElement;

// Modal
const $overlay     = document.getElementById('modal-overlay')!     as HTMLElement;
const $modalImg    = document.getElementById('modalImg')!          as HTMLImageElement;
const $modalId     = document.getElementById('modalId')!           as HTMLElement;
const $modalName   = document.getElementById('modalName')!         as HTMLElement;
const $modalTypes  = document.getElementById('modalTypes')!        as HTMLElement;
const $modalDesc   = document.getElementById('modalDesc')!         as HTMLElement;
const $modalStats  = document.getElementById('modalStats')!        as HTMLElement;
const $modalHeight = document.getElementById('modalHeight')!       as HTMLElement;
const $modalWeight = document.getElementById('modalWeight')!       as HTMLElement;


let toastTimer: ReturnType<typeof setTimeout>;

const showToast = (msg: string, type: 'success' | 'error' | '' = ''): void => {
  $toast.textContent = msg;
  $toast.className   = `show ${type}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { $toast.className = ''; }, 3000);
};


const loadList = async (): Promise<void> => {
  if (state.loading) return;
  state.loading        = true;
  $loadMoreBtn.disabled= true;

  try {
    const { items, total } = await fetchPokemonList(state.limit, state.offset);

    state.total   = total;
    state.offset += state.limit;
    state.basicList.push(...items);

    setLoaderVisible($loader, $grid, false);

    appendPokemonList(
      $grid,
      items,
      state.discovered,
      state.cache,
      onUndiscoveredClick,
      onDiscoveredClick,
    );

    $totalCount.textContent = String(total);
    updateDiscoveredCounter($discovered);
    setLoadMoreVisible($loadMoreWrap, state.offset < total);

  } catch {
    showToast('Error cargando la lista', 'error');
  } finally {
    state.loading        = false;
    $loadMoreBtn.disabled= false;
  }
};


const handleDiscover = async (): Promise<void> => {
  const query = $searchInput.value.trim();
  if (!query) return;

  $searchBtn.textContent = '…';
  $searchBtn.disabled    = true;

  try {
    const pokemon = await discoverPokemon(query);

    // Actualiza estado
    state.discovered.add(pokemon.id);
    state.cache.set(pokemon.id, pokemon);

    // Actualiza la card en el grid
    upgradeCard($grid, pokemon, onDiscoveredClick);
    updateDiscoveredCounter($discovered);

    showToast(`¡${pokemon.name} descubierto!`, 'success');
    $searchInput.value = '';

    // Abre el modal automáticamente
    showPokemonModal(pokemon.id);

  } catch {
    showToast('Pokémon no encontrado', 'error');
  } finally {
    $searchBtn.textContent = 'Descubrir';
    $searchBtn.disabled    = false;
  }
};


const showPokemonModal = async (id: number): Promise<void> => {
  // Si no está en caché, lo carga
  if (!state.cache.has(id)) {
    try {
      const pokemon = await discoverPokemon(id);
      state.cache.set(id, pokemon);
      state.discovered.add(id);
    } catch {
      showToast('Error cargando detalle', 'error');
      return;
    }
  }

  const pokemon = state.cache.get(id)!;

  renderModal(pokemon, {
    img:    $modalImg,
    id:     $modalId,
    name:   $modalName,
    types:  $modalTypes,
    desc:   $modalDesc,
    stats:  $modalStats,
    height: $modalHeight,
    weight: $modalWeight,
  });

  openModal($overlay);
  animateStatBars($modalStats);
};


const onUndiscoveredClick = (id: number, name: string): void => {
  showToast('¡Búscalo para descubrirlo!', '');
  $searchInput.value = name;
  $searchInput.focus();
};

const onDiscoveredClick = (id: number): void => {
  showPokemonModal(id);
};


const bindEvents = (): void => {
  $searchBtn.addEventListener('click', handleDiscover);

  $searchInput.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Enter') handleDiscover();
  });

  $loadMoreBtn.addEventListener('click', loadList);

  document.getElementById('modalClose')!
    .addEventListener('click', () => closeModal($overlay));

  $overlay.addEventListener('click', (e: MouseEvent) => {
    if (e.target === $overlay) closeModal($overlay);
  });
};


const init = (): void => {
  bindEvents();
  loadList();
};

document.addEventListener('DOMContentLoaded', init);
