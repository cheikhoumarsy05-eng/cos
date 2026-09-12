import * as migration_20260910_092223_initial from './20260910_092223_initial';
import * as migration_20260911_202253_stats_and_publications from './20260911_202253_stats_and_publications';
import * as migration_20260912_020433_relax_image_text_fields from './20260912_020433_relax_image_text_fields';

export const migrations = [
  {
    up: migration_20260910_092223_initial.up,
    down: migration_20260910_092223_initial.down,
    name: '20260910_092223_initial',
  },
  {
    up: migration_20260911_202253_stats_and_publications.up,
    down: migration_20260911_202253_stats_and_publications.down,
    name: '20260911_202253_stats_and_publications',
  },
  {
    up: migration_20260912_020433_relax_image_text_fields.up,
    down: migration_20260912_020433_relax_image_text_fields.down,
    name: '20260912_020433_relax_image_text_fields'
  },
];
