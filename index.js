// Main entry point for vanilla-js-helpers
export { router } from './script/routing/router.js';
export { grid } from './script/grid.js';
export { stats } from './script/stats.js';

// For convenience, also export as default object
export default {
  router: () => import('./script/routing/router.js').then(m => m.router),
  grid: () => import('./script/grid.js').then(m => m.grid),
  stats: () => import('./script/stats.js').then(m => m.stats)
};