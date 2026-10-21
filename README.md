# Culture générale — socle du projet

Application web responsive de culture générale, pensée pour une consultation simple sur ordinateur et iPhone, avec une bibliothèque de fiches organisée par domaine. Les fiches sont destinées à être générées et publiées automatiquement par un pipeline IA dans une phase ultérieure.

## Stack

- Next.js 16 (App Router) + React + TypeScript strict
- Tailwind CSS 4 et composants d'interface locaux
- Sanity comme CMS prévu pour le catalogue éditorial
- Zod pour valider les configurations et les données
- Vitest pour les tests unitaires ; Playwright pour les tests navigateur

## Prérequis

- Node.js 22 LTS recommandé (Next.js 16 exige une version moderne de Node.js)
- npm récent

## Démarrage local

```bash
npm install
cp .env.example .env.local
npm run dev
```

Puis ouvrir <http://localhost:3000>.

La bibliothèque fonctionne avec un jeu de démonstration tant que `NEXT_PUBLIC_SANITY_PROJECT_ID` n'est pas configuré. Les fiches de démonstration sont des exemples locaux : elles ne constituent pas encore le pipeline de génération IA et ne sont pas publiées dans un CMS.

## Vérifications

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Pour exécuter les tests de navigateur après l'installation des navigateurs Playwright :

```bash
npx playwright install chromium
npm run test:e2e
```

## Variables d'environnement

Copier `.env.example` vers `.env.local`, puis renseigner uniquement les intégrations déjà configurées. Ne jamais committer `.env.local`, ni exposer un secret via une variable `NEXT_PUBLIC_*`.

- `SITE_URL` : URL de l'application.
- `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET` : identifiants publics du projet/dataset Sanity.
- `SANITY_API_READ_TOKEN` : jeton de lecture côté serveur uniquement si nécessaire.
- `OPENAI_API_KEY`, `OPENAI_MODEL` : réservés à la future génération de fiches.
- `TRIGGER_SECRET_KEY`, `CRON_SECRET` : réservés à l'orchestration future.

## Routes déjà préparées

- `/` : accueil et domaines en vedette.
- `/bibliotheque` : bibliothèque, filtres et recherche locale.
- `/bibliotheque/[domainSlug]` : fiches d'un domaine.
- `/bibliotheque/[domainSlug]/[articleSlug]` : page de lecture.
- `/recherche?q=...` : résultats de recherche.
- `/api/health` : contrôle de disponibilité minimal, sans donnée sensible.

## État du projet après la Phase 2

Le socle de l'interface, les routes, le modèle de contenu, les schémas Sanity, la configuration PWA initiale, la validation de configuration et les tests de base sont préparés. Les données d'exemple sont utilisées si Sanity n'est pas configuré.

**Non activé à ce stade :** connexion réelle à un projet Sanity, génération IA, recherche documentaire, contrôles automatiques de qualité, publication automatisée, jobs de fond et déploiement. Ces étapes seront implémentées et testées avant d'autoriser toute publication automatique.
