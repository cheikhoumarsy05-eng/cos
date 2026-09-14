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
import * as migration_20260912_152608_projet_planches from './20260912_152608_projet_planches';
import * as migration_20260912_160025_articles from './20260912_160025_articles';
import * as migration_20260914_025140_freelance_missions_points_cles from './20260914_025140_freelance_missions_points_cles';
import * as migration_20260914_032513_competences_accroche from './20260914_032513_competences_accroche';
import * as migration_20260914_125406_formulaire_contact_et_blog from './20260914_125406_formulaire_contact_et_blog';
import * as migration_20260914_143140_contact_accroche_facultative from './20260914_143140_contact_accroche_facultative';
import * as migration_20260914_165043_note_pied_de_page_facultative from './20260914_165043_note_pied_de_page_facultative';

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
    name: '20260912_085057_localisation_fr_en',
  },
  {
    up: migration_20260912_152608_projet_planches.up,
    down: migration_20260912_152608_projet_planches.down,
    name: '20260912_152608_projet_planches',
  },
  {
    up: migration_20260912_160025_articles.up,
    down: migration_20260912_160025_articles.down,
    name: '20260912_160025_articles',
  },
  {
    up: migration_20260914_025140_freelance_missions_points_cles.up,
    down: migration_20260914_025140_freelance_missions_points_cles.down,
    name: '20260914_025140_freelance_missions_points_cles',
  },
  {
    up: migration_20260914_032513_competences_accroche.up,
    down: migration_20260914_032513_competences_accroche.down,
    name: '20260914_032513_competences_accroche',
  },
  {
    up: migration_20260914_125406_formulaire_contact_et_blog.up,
    down: migration_20260914_125406_formulaire_contact_et_blog.down,
    name: '20260914_125406_formulaire_contact_et_blog',
  },
  {
    up: migration_20260914_143140_contact_accroche_facultative.up,
    down: migration_20260914_143140_contact_accroche_facultative.down,
    name: '20260914_143140_contact_accroche_facultative',
  },
  {
    up: migration_20260914_165043_note_pied_de_page_facultative.up,
    down: migration_20260914_165043_note_pied_de_page_facultative.down,
    name: '20260914_165043_note_pied_de_page_facultative'
  },
];
