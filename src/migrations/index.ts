import * as migration_20260910_092223_initial from './20260910_092223_initial';
import * as migration_20260911_202253_stats_and_publications from './20260911_202253_stats_and_publications';
import * as migration_20260912_020433_relax_image_text_fields from './20260912_020433_relax_image_text_fields';
import * as migration_20260912_035121_expertise_hero_publication_metrics from './20260912_035121_expertise_hero_publication_metrics';
import * as migration_20260912_040009_stat_years_default from './20260912_040009_stat_years_default';
import * as migration_20260912_043752_experience_key_points from './20260912_043752_experience_key_points';
import * as migration_20260912_050519_skills_domains from './20260912_050519_skills_domains';
import * as migration_20260912_052544_nav_short_labels from './20260912_052544_nav_short_labels';
import * as migration_20260912_062529_nav_home_label from './20260912_062529_nav_home_label';
import * as migration_20260912_062648_nav_about_label from './20260912_062648_nav_about_label';
import * as migration_20260912_085057_localisation_fr_en from './20260912_085057_localisation_fr_en';

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
    name: '20260912_020433_relax_image_text_fields',
  },
  {
    up: migration_20260912_035121_expertise_hero_publication_metrics.up,
    down: migration_20260912_035121_expertise_hero_publication_metrics.down,
    name: '20260912_035121_expertise_hero_publication_metrics',
  },
  {
    up: migration_20260912_040009_stat_years_default.up,
    down: migration_20260912_040009_stat_years_default.down,
    name: '20260912_040009_stat_years_default',
  },
  {
    up: migration_20260912_043752_experience_key_points.up,
    down: migration_20260912_043752_experience_key_points.down,
    name: '20260912_043752_experience_key_points',
  },
  {
    up: migration_20260912_050519_skills_domains.up,
    down: migration_20260912_050519_skills_domains.down,
    name: '20260912_050519_skills_domains',
  },
  {
    up: migration_20260912_052544_nav_short_labels.up,
    down: migration_20260912_052544_nav_short_labels.down,
    name: '20260912_052544_nav_short_labels',
  },
  {
    up: migration_20260912_062529_nav_home_label.up,
    down: migration_20260912_062529_nav_home_label.down,
    name: '20260912_062529_nav_home_label',
  },
  {
    up: migration_20260912_062648_nav_about_label.up,
    down: migration_20260912_062648_nav_about_label.down,
    name: '20260912_062648_nav_about_label',
  },
  {
    up: migration_20260912_085057_localisation_fr_en.up,
    down: migration_20260912_085057_localisation_fr_en.down,
    name: '20260912_085057_localisation_fr_en'
  },
];
