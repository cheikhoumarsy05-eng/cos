--
-- PostgreSQL database dump
--

\restrict 991cTqpGnPuqf3c827kJPE2wFWUFVxo40XB3SVq2Vkv4fCL8mNExh5pcVw3aVvb

-- Dumped from database version 18.6
-- Dumped by pg_dump version 18.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: media; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.media (id, alt, updated_at, created_at, url, thumbnail_u_r_l, filename, mime_type, filesize, width, height, focal_x, focal_y, sizes_thumb_url, sizes_thumb_width, sizes_thumb_height, sizes_thumb_mime_type, sizes_thumb_filesize, sizes_thumb_filename, sizes_wide_url, sizes_wide_width, sizes_wide_height, sizes_wide_mime_type, sizes_wide_filesize, sizes_wide_filename) FROM stdin;
\.


--
-- Data for Name: about; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.about (id, lead, stat_years, stat_projects, stat_publication, stat_note, portrait_id, portrait_src, portrait_fallback, portrait_alt, updated_at, created_at) FROM stdin;
1	Concevoir et vérifier des structures, du calcul au plan d'exécution.	3+ ans	5 projets	1 publication	Zenodo, 2026	\N	/img/portrait.webp	/img/portrait.jpg	Cheikh Oumar Sy, ingénieur en génie civil	2026-09-10 22:03:41.316+00	2026-09-10 22:03:41.316+00
\.


--
-- Data for Name: about_body; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.about_body (_order, _parent_id, id, value) FROM stdin;
1	1	6aa3293d7ece93257e580539	Ingénieur de conception en génie civil orienté structures, je travaille le dimensionnement en béton armé et charpente métallique selon les Eurocodes et le BAEL, la vérification de conformité en bureau de contrôle technique, et la dynamique des structures. Je développe aussi mes propres outils de calcul sous Python pour automatiser l'analyse et le dimensionnement.
2	1	6aa3293d7ece93257e58053a	Polyvalent entre le bureau d'études et le terrain, j'ai suivi des chantiers de gros œuvre et de plomberie et mené une publication scientifique sur l'analyse dynamique des ponts ferroviaires à grande vitesse.
\.


--
-- Data for Name: about_facts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.about_facts (_order, _parent_id, id, k, v) FROM stdin;
1	1	6aa3293d7ece93257e58053b	Langues	Français · Anglais technique · Wolof
2	1	6aa3293d7ece93257e58053c	Permis	Permis B
3	1	6aa3293d7ece93257e58053d	Outils clés	RSA · CYPECAD · Revit · Python
\.


--
-- Data for Name: contact; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.contact (id, title, lead, email, phone, phone_href, linkedin, github, location, updated_at, created_at) FROM stdin;
1	Disponible pour un stage de 4 à 6 mois.	Calcul des structures, bureau de contrôle technique ou recherche appliquée — parlons de la mission qui vous attend. Réponse rapide, du bureau d'études au terrain.	cheikhoumarsy05@gmail.com	+221 76 630 10 88	+221766301088	https://www.linkedin.com/in/cheikh-oumar-sy-29912b23b	https://github.com/cheikhoumarsy05-eng	Dakar — Sénégal	2026-09-10 22:03:41.333+00	2026-09-10 22:03:41.333+00
\.


--
-- Data for Name: education; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.education (id, "order", "when", title, org, updated_at, created_at) FROM stdin;
1	0	2023 — 2026	Ingénieur de Conception en Génie Civil (DIC3)	IPSL — Saint-Louis, Sénégal	2026-09-10 22:03:41.308+00	2026-09-10 22:03:41.308+00
2	1	2021 — 2023	Diplôme Supérieur de Technologie	ESP — Dakar, Sénégal	2026-09-10 22:03:41.308+00	2026-09-10 22:03:41.308+00
3	2	2021	Baccalauréat Scientifique S1	Lycée Maba Diakhou BA	2026-09-10 22:03:41.308+00	2026-09-10 22:03:41.308+00
\.


--
-- Data for Name: experience; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.experience (id, "order", "when", role, org, updated_at, created_at) FROM stdin;
1	0	Juin–Août 2026 · Août–Oct 2025	Stagiaire Ingénieur — Bureau de Contrôle Technique	SEATEC Sénégal	2026-09-10 22:03:41.301+00	2026-09-10 22:03:41.301+00
2	1	Août–Sept 2024	Stagiaire Conducteur de Travaux — Plomberie	SENTRA BTP SA	2026-09-10 22:03:41.301+00	2026-09-10 22:03:41.301+00
3	2	Juin–Juil 2023	Stagiaire Conducteur de Travaux	SENTRA BTP SA	2026-09-10 22:03:41.301+00	2026-09-10 22:03:41.301+00
\.


--
-- Data for Name: experience_points; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.experience_points (_order, _parent_id, id, value) FROM stdin;
1	1	6aa3293d7ece93257e580532	Vérification des plans de coffrage et de ferraillage selon le BAEL.
1	3	6aa3293d7ece93257e580537	Fondations d'un immeuble R+7 avec sous-sol.
1	2	6aa3293d7ece93257e580535	Suivi des travaux de plomberie sur un programme de 222 villas.
2	1	6aa3293d7ece93257e580533	Vérification des notes de calcul sous Robot Structural Analysis (RSA).
2	3	6aa3293d7ece93257e580538	Coordination des équipes sur site.
3	1	6aa3293d7ece93257e580534	Contrôle qualité sur chantier et rédaction de rapports techniques.
2	2	6aa3293d7ece93257e580536	Supervision du gros œuvre d'une villa R+3.
\.


--
-- Data for Name: freelance; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.freelance (id, "order", "when", title, body, updated_at, created_at) FROM stdin;
1	0	2026 — en cours	Concepteur freelance — Béton armé	Production de plans d'exécution, vérification de conformité et rédaction de rapports techniques pour des projets en béton armé.	2026-09-10 22:03:41.305+00	2026-09-10 22:03:41.304+00
2	1	2026 — en cours	Formateur en logiciels de calcul de structures	Formation en ligne à la prise en main des logiciels, à la modélisation et l'analyse de bâtiments en béton armé, au dimensionnement et à la production de plans d'exécution.	2026-09-10 22:03:41.305+00	2026-09-10 22:03:41.305+00
\.


--
-- Data for Name: hero; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.hero (id, folio_label, name_line1, name_line2, name_accent, sub, image_id, image_src, image_fallback, image_alt, image_caption, image_year, availability, location, domain, updated_at, created_at) FROM stdin;
1	Portfolio · Ingénieur Structures	Cheikh	Oumar	Sy	Ingénieur en génie civil — structures. Du calcul au plan d'exécution : béton armé, charpente métallique, dynamique.	\N	/projects/nafi-1.webp	/projects/nafi-1.jpg	Maison Nafi Diom — villa R+2, façade principale au crépuscule	Maison Nafi Diom · R+2 · Archicad & Lumion	2024	Disponible — stage 4 à 6 mois	Dakar, Sénégal	Béton armé · Charpente métallique · Dynamique	2026-09-10 22:03:41.312+00	2026-09-10 22:03:41.312+00
\.


--
-- Data for Name: payload_kv; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payload_kv (id, key, data) FROM stdin;
\.


--
-- Data for Name: payload_locked_documents; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payload_locked_documents (id, global_slug, updated_at, created_at) FROM stdin;
\.


--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.projects (id, index, "order", type, title, field_label, "desc", updated_at, created_at) FROM stdin;
1	01	0	Conception & modélisation 3D · R+2	Maison Nafi Diom	Rendu · façade principale	Villa individuelle R+2 à double volume : conception des façades, des volumes et de l'organisation des niveaux, jusqu'au dossier de permis de construire.	2026-09-10 22:03:41.289+00	2026-09-10 22:03:41.289+00
2	02	1	Étude structurelle complète · R+2	Projet DEMS · R+2 Guédiawaye	Rendu · perspective rue	Projet de fin de formation : maison R+2 à Guédiawaye conduite de la conception 3D au dimensionnement complet — descente de charges, coffrages, ferraillage des poutres et longrines.	2026-09-10 22:03:41.29+00	2026-09-10 22:03:41.29+00
3	03	2	Modélisation & calcul structure	Villa Bamar Mounass	Coupe · fondation ferraillée	Modélisation structurelle complète sous Robot : descente de charges des poteaux, plans de coffrage des fondations et ferraillage des poteaux et semelles.	2026-09-10 22:03:41.29+00	2026-09-10 22:03:41.29+00
4	04	3	Conception & modélisation 3D	4 Studios — Babacar Diouf	Plan · niveau courant	Immeuble de quatre studios : organisation des plans du rez-de-chaussée à la terrasse et modélisation des volumes.	2026-09-10 22:03:41.29+00	2026-09-10 22:03:41.29+00
5	05	4	Conception & modélisation 3D	Maison Baay Mass	Élévation · façade	Maison individuelle : conception des niveaux et modélisation, du rez-de-chaussée à la terrasse.	2026-09-10 22:03:41.291+00	2026-09-10 22:03:41.291+00
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, name, updated_at, created_at, email, reset_password_token, reset_password_expiration, salt, hash, login_attempts, lock_until) FROM stdin;
1	Cheikh Oumar Sy	2026-09-10 22:20:03.701+00	2026-09-10 22:03:41.276+00	cheikhoumarsy05@gmail.com	\N	\N	d9c9eb2da264b440041ad4fefa3ad9f671061a669ea8b9f11e1dbcb0c414003f	803791723e8b71d4553cf073d7fb10b0b0cf7a59c6e197ad275195b8df4af262dfe22b4198597a1870eba06a14fb0c111cc9f8057732b136f8132fe20c782aa7d09bdc9106c065dc143d2d1e3d93354e87ff89c4442b61576b490a9fc983dcb29b00044fdf61e9f94f3ab3be450e5313aba7577eaeae073492701cd969f4fd52c048494d676c29835d92e513f67f7067ccf9f6936cd9f0e2bd2345664c77b506f6926c9f7aef52d54de5ea15711024cef885fbf0d09379d904db527184e2e01e878e0d051659064f0da5bbce85d433ca876f9103762208bd92cfa467301b192fa6219db9733426a9d4b8da9571c588d4cabd64b9dc63d7404185d08750fa98db76824aac0b7c630eb8d416d2bf87d01c2a18007e76cdab771df6778352811060803b12bbbf43beb48f7b60dd7007888239bfa2f84ec834741b2177c8c22e5a87c690810a6394fe795f50c32ec8cf7a2b3c9c9eb9fe243eb74fde9be2f3f56d8e0f68d94ba22da644c3b90cecfc02b445ae63ab54323f7bf425c89b3e3c56708071e95f540dd90aa9595a98341a8120399bf4bc146bc8161255f8ca1bff19d7947ff44e35bc107b45effece7bda3f871b86f72c9057141a3c0c852975214bd0de6fcfdfe109b257c338c1257dadc39c39abd230a80374a3549782d7080fdfb545f3fa1448ec57662093a1462e879787efbf817d416a867d60bbda0172a8405126	0	\N
\.


--
-- Data for Name: payload_locked_documents_rels; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payload_locked_documents_rels (id, "order", parent_id, path, projects_id, experience_id, freelance_id, education_id, media_id, users_id) FROM stdin;
\.


--
-- Data for Name: payload_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payload_migrations (id, name, batch, updated_at, created_at) FROM stdin;
1	20260910_092223_initial	1	2026-09-10 18:13:40.756+00	2026-09-10 18:13:40.751+00
2	dev	-1	2026-09-10 22:05:29.724+00	2026-09-10 18:14:39.168+00
\.


--
-- Data for Name: payload_preferences; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payload_preferences (id, key, value, updated_at, created_at) FROM stdin;
\.


--
-- Data for Name: payload_preferences_rels; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payload_preferences_rels (id, "order", parent_id, path, users_id) FROM stdin;
\.


--
-- Data for Name: projects_images; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.projects_images (_order, _parent_id, id, upload_id, src, fallback, alt) FROM stdin;
1	1	6aa3293d7ece93257e580508	\N	/projects/nafi-1.webp	/projects/nafi-1.jpg	Maison Nafi Diom — façade principale au crépuscule, double volume R+2 avec toiture-terrasse végétalisée
1	2	6aa3293d7ece93257e580517	\N	/projects/dems-1.webp	\N	Projet DEMS — perspective de rue au crépuscule, R+2 avec grande verrière cintrée
2	1	6aa3293d7ece93257e580509	\N	/projects/nafi-2.webp	\N	Maison Nafi Diom — vue de la façade, éclairage d'ambiance et garde-corps vitrés
3	1	6aa3293d7ece93257e58050a	\N	/projects/nafi-3.webp	\N	Maison Nafi Diom — perspective des balcons et brise-soleil
2	2	6aa3293d7ece93257e580518	\N	/projects/dems-2.webp	\N	Projet DEMS — façade éclairée, balcons filants
4	1	6aa3293d7ece93257e58050b	\N	/projects/nafi-4.webp	\N	Maison Nafi Diom — détail d'entrée et clôture paysagée
3	2	6aa3293d7ece93257e580519	\N	/projects/dems-3.webp	\N	Projet DEMS — détail de la verrière cintrée et de l'entrée
5	1	6aa3293d7ece93257e58050c	\N	/projects/nafi-5.webp	\N	Maison Nafi Diom — vue rapprochée des menuiseries et de la végétation
6	1	6aa3293d7ece93257e58050d	\N	/projects/nafi-6.webp	\N	Maison Nafi Diom — volume latéral et traitement de la terrasse
4	2	6aa3293d7ece93257e58051a	\N	/projects/dems-4.webp	\N	Projet DEMS — vue latérale du bâtiment
7	1	6aa3293d7ece93257e58050e	\N	/projects/nafi-7.webp	\N	Maison Nafi Diom — perspective d'angle du bâtiment
5	2	6aa3293d7ece93257e58051b	\N	/projects/dems-5.webp	\N	Projet DEMS — perspective des niveaux et garde-corps
6	2	6aa3293d7ece93257e58051c	\N	/projects/dems-6.webp	\N	Projet DEMS — traitement de la clôture et paysagement
7	2	6aa3293d7ece93257e58051d	\N	/projects/dems-7.webp	\N	Projet DEMS — vue d'ensemble en soirée
8	2	6aa3293d7ece93257e58051e	\N	/projects/dems-8.webp	\N	Projet DEMS — perspective d'angle
\.


--
-- Data for Name: projects_specs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.projects_specs (_order, _parent_id, id, k, v) FROM stdin;
1	2	6aa3293d7ece93257e58050f	Rôle	Conception & calcul structure
1	4	6aa3293d7ece93257e580526	Rôle	Conception & modélisation
1	1	6aa3293d7ece93257e580501	Rôle	Conception & modélisation
1	5	6aa3293d7ece93257e58052c	Rôle	Conception & modélisation
2	2	6aa3293d7ece93257e580510	Outils	Archicad · RSA · CBS · DDC
2	5	6aa3293d7ece93257e58052d	Logiciel	Archicad
3	5	6aa3293d7ece93257e58052e	Livrables	Plans RDC, étage, terrasse
3	2	6aa3293d7ece93257e580511	Livrables	Coffrages, ferraillages, rendus
2	4	6aa3293d7ece93257e580527	Logiciel	Archicad
3	4	6aa3293d7ece93257e580528	Livrables	Plans RDC, étage, terrasse
2	1	6aa3293d7ece93257e580502	Logiciel	Archicad & Lumion
3	1	6aa3293d7ece93257e580503	Livrables	Plans, façades, coupes, permis
1	3	6aa3293d7ece93257e58051f	Rôle	Modélisation structure & ferraillage
2	3	6aa3293d7ece93257e580520	Outils	Robot (RSA) · Revit
3	3	6aa3293d7ece93257e580521	Livrables	Modèle 3D, plans de coffrage & ferraillage
\.


--
-- Data for Name: projects_tags; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.projects_tags (_order, _parent_id, id, value) FROM stdin;
1	1	6aa3293d7ece93257e580504	Modélisation 3D
1	2	6aa3293d7ece93257e580512	Béton armé
1	5	6aa3293d7ece93257e58052f	Modélisation 3D
1	4	6aa3293d7ece93257e580529	Modélisation 3D
2	1	6aa3293d7ece93257e580505	Conception bâtiment
2	2	6aa3293d7ece93257e580513	Descente de charges
3	1	6aa3293d7ece93257e580506	Façades
3	2	6aa3293d7ece93257e580514	Ferraillage
2	5	6aa3293d7ece93257e580530	Conception bâtiment
2	4	6aa3293d7ece93257e58052a	Logements
4	1	6aa3293d7ece93257e580507	Permis de construire
3	5	6aa3293d7ece93257e580531	Plans
3	4	6aa3293d7ece93257e58052b	Plans
1	3	6aa3293d7ece93257e580522	Modélisation structure
4	2	6aa3293d7ece93257e580515	Plans d'exécution
5	2	6aa3293d7ece93257e580516	RSA
2	3	6aa3293d7ece93257e580523	Robot Structural Analysis
3	3	6aa3293d7ece93257e580524	Fondations
4	3	6aa3293d7ece93257e580525	Ferraillage
\.


--
-- Data for Name: publication; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.publication (id, title, sub, doi, doi_url, updated_at, created_at) FROM stdin;
1	Analyse dynamique d'un pont ferroviaire à grande vitesse	Vitesses critiques et vérification selon EN 1991-2 — Zenodo, 2026.	10.5281/zenodo.20069677	https://doi.org/10.5281/zenodo.20069677	2026-09-10 22:03:41.321+00	2026-09-10 22:03:41.321+00
\.


--
-- Data for Name: publication_points; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.publication_points (_order, _parent_id, id, value) FROM stdin;
1	1	6aa3293d7ece93257e58053e	Analyse dynamique sous convois HSLM-A et identification des vitesses critiques de résonance.
2	1	6aa3293d7ece93257e58053f	Étude de sensibilité de la réponse structurelle à l'amortissement.
3	1	6aa3293d7ece93257e580540	Dimensionnement d'amortisseurs à masse accordée (AMA / TMD) sous Python.
\.


--
-- Data for Name: publication_side_facts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.publication_side_facts (_order, _parent_id, id, k, v, accent) FROM stdin;
1	1	6aa3293d7ece93257e580541	Norme	EN 1991-2	t
2	1	6aa3293d7ece93257e580542	Convois	HSLM-A	f
3	1	6aa3293d7ece93257e580543	Outils	Python · AMA/TMD	f
\.


--
-- Data for Name: site; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.site (id, brand, cv_url, footer_note, section_titles_about, section_titles_experience, section_titles_experience_lead, section_titles_research, section_titles_projects, section_titles_projects_lead, section_titles_freelance, section_titles_skills, section_titles_education, section_titles_contact, updated_at, created_at) FROM stdin;
1	Cheikh Oumar Sy	/cv-cheikh-oumar-sy.pdf	Conçu à Dakar.	À propos	Expérience	Bureau de contrôle, conduite de travaux, chantier.	Recherche appliquée	Projets	Conception, modélisation et calcul de bâtiments résidentiels — du volume à l'élément.	Freelance	Compétences	Formation	Contact	2026-09-10 22:03:41.339+00	2026-09-10 22:03:41.339+00
\.


--
-- Data for Name: skills; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.skills (id, updated_at, created_at) FROM stdin;
1	2026-09-10 22:03:41.328+00	2026-09-10 22:03:41.328+00
\.


--
-- Data for Name: skills_personal; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.skills_personal (_order, _parent_id, id, value) FROM stdin;
1	1	6aa3293d7ece93257e580556	Rigueur
2	1	6aa3293d7ece93257e580557	Analyse & résolution de problèmes
3	1	6aa3293d7ece93257e580558	Gestion de projet
4	1	6aa3293d7ece93257e580559	Polyvalence bureau / terrain
5	1	6aa3293d7ece93257e58055a	Adaptabilité
\.


--
-- Data for Name: skills_technical; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.skills_technical (_order, _parent_id, id, value) FROM stdin;
1	1	6aa3293d7ece93257e580544	Dimensionnement béton armé & charpente métallique (Eurocodes, BAEL)
2	1	6aa3293d7ece93257e580545	Production de plans d'exécution
3	1	6aa3293d7ece93257e580546	Vérification de conformité (bureau de contrôle)
4	1	6aa3293d7ece93257e580547	Dynamique des structures & analyse modale (EN 1991-2, EN 1990)
5	1	6aa3293d7ece93257e580548	Développement d'outils de calcul sous Python
6	1	6aa3293d7ece93257e580549	Métrés, attachements & devis
\.


--
-- Data for Name: skills_tools; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.skills_tools (_order, _parent_id, id, name, key) FROM stdin;
1	1	6aa3293d7ece93257e58054a	RSA	t
2	1	6aa3293d7ece93257e58054b	Revit	t
3	1	6aa3293d7ece93257e58054c	Python	t
4	1	6aa3293d7ece93257e58054d	CYPECAD	t
5	1	6aa3293d7ece93257e58054e	Archicad	f
6	1	6aa3293d7ece93257e58054f	AutoCAD	f
7	1	6aa3293d7ece93257e580550	Graitec	f
8	1	6aa3293d7ece93257e580551	CBS	f
9	1	6aa3293d7ece93257e580552	DDC	f
10	1	6aa3293d7ece93257e580553	EXPERT	f
11	1	6aa3293d7ece93257e580554	RMD7	f
12	1	6aa3293d7ece93257e580555	LaTeX	f
\.


--
-- Data for Name: users_sessions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users_sessions (_order, _parent_id, id, created_at, expires_at) FROM stdin;
1	1	d0abc6e1-d233-4422-a7bd-6f50994e80ac	2026-09-10 22:20:03.694+00	2026-09-11 00:20:03.694+00
\.


--
-- Name: about_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.about_id_seq', 1, true);


--
-- Name: contact_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.contact_id_seq', 1, true);


--
-- Name: education_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.education_id_seq', 3, true);


--
-- Name: experience_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.experience_id_seq', 3, true);


--
-- Name: freelance_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.freelance_id_seq', 2, true);


--
-- Name: hero_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.hero_id_seq', 1, true);


--
-- Name: media_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.media_id_seq', 1, false);


--
-- Name: payload_kv_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.payload_kv_id_seq', 1, false);


--
-- Name: payload_locked_documents_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.payload_locked_documents_id_seq', 1, false);


--
-- Name: payload_locked_documents_rels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.payload_locked_documents_rels_id_seq', 1, false);


--
-- Name: payload_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.payload_migrations_id_seq', 2, true);


--
-- Name: payload_preferences_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.payload_preferences_id_seq', 1, false);


--
-- Name: payload_preferences_rels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.payload_preferences_rels_id_seq', 1, false);


--
-- Name: projects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.projects_id_seq', 5, true);


--
-- Name: publication_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.publication_id_seq', 1, true);


--
-- Name: site_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.site_id_seq', 1, true);


--
-- Name: skills_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.skills_id_seq', 1, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- PostgreSQL database dump complete
--

\unrestrict 991cTqpGnPuqf3c827kJPE2wFWUFVxo40XB3SVq2Vkv4fCL8mNExh5pcVw3aVvb

