// Main entry point for vanilla-js-helpers
export { grid } from './script/grid.js';
export { stats } from './script/stats.js';

// For convenience, also export as default object
export default {
  grid: () => import('./script/grid.js').then(m => m.grid),
  stats: () => import('./script/stats.js').then(m => m.stats)
};
