import * as migration_20260910_092223_initial from './20260910_092223_initial';
import * as migration_20260911_202253_stats_and_publications from './20260911_202253_stats_and_publications';

export const migrations = [
  {
    up: migration_20260910_092223_initial.up,
    down: migration_20260910_092223_initial.down,
    name: '20260910_092223_initial',
  },
  {
    up: migration_20260911_202253_stats_and_publications.up,
    down: migration_20260911_202253_stats_and_publications.down,
    name: '20260911_202253_stats_and_publications'
  },
];
