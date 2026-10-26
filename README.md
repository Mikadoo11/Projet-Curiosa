# Curiosa — plateforme de culture générale

Application Next.js responsive, pensée pour une consultation simple sur ordinateur et iPhone, avec trois pages principales : Accueil, Bibliothèque et Explorer. La page d'accueil affiche directement les domaines. Le catalogue public peut fonctionner sur des données de démonstration ou lire les fiches publiées dans Sanity.

## Stack

- Next.js App Router, React et TypeScript
- Sanity CMS pour conserver les domaines et fiches publiées
- Gemini API pour la génération serveur des fiches
- Zod pour valider les variables et les fiches générées
- Vercel pour l'hébergement et l'exécution quotidienne de la tâche planifiée

## Prérequis et démarrage local

- Node.js 22 ou supérieur
- npm 10 ou supérieur

```bash
npm install
cp .env.example .env.local
npm run dev
```

Ouvre ensuite <http://localhost:3000>.

## Vérifications

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Les fichiers de génération automatique ont été ajoutés, mais **la génération reste désactivée tant que `GENERATION_ENABLED=false`**. Il faut d'abord créer/configurer les projets Sanity et Gemini, renseigner les variables d'environnement dans Vercel, puis réaliser un test contrôlé.

## Variables d'environnement

Copie `.env.example` vers `.env.local` pour le développement local. Pour Vercel, configure les mêmes variables dans Settings → Environment Variables.

- `SITE_URL` : adresse publique de Curiosa.
- `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET` : identifiants du projet/dataset Sanity.
- `SANITY_API_READ_TOKEN` : facultatif pour un dataset dont les documents publiés peuvent être lus publiquement.
- `SANITY_API_WRITE_TOKEN` : secret Sanity avec autorisation d'écriture. Ne jamais le préfixer par `NEXT_PUBLIC_` ni le committer.
- `/studio` : interface d'administration Sanity ; l'accès aux modifications dépend de la connexion Sanity et des droits de ton compte.
- `GEMINI_API_KEY` : clé Gemini API issue d'un projet conservé sur le niveau gratuit.
- `GEMINI_PRIMARY_MODEL=gemini-3.8-flash` : modèle prioritaire.
- `GEMINI_FALLBACK_MODEL=gemini-3.5-flash-lite` : modèle de secours si le quota du modèle prioritaire est épuisé.
- `GENERATION_ENABLED=false` : conserver `false` jusqu'à ce que toutes les intégrations soient configurées et testées.
- `GENERATION_DAILY_TARGET=5` : maximum local de fiches tentées par exécution quotidienne (de 1 à 5).
- `CRON_SECRET` : secret serveur utilisé pour protéger le point d'entrée de la tâche programmée.

## Génération programmée

Le fichier `vercel.json` configure une tâche quotidienne vers `/api/cron/generate` (17:00 UTC, environ 02:00–02:59 en Corée). Vercel Hobby permet une invocation planifiée par jour. Après configuration, le même endpoint autorise des appels manuels authentifiés avec `?count=10` pour accélérer le stock initial ; le cron quotidien reste à 5 fiches maximum. La tâche :

1. initialise les domaines manquants ;
2. transfère une fois les fiches de démonstration dans Sanity pour éviter une bibliothèque vide ;
3. crée au plus cinq fiches au cours de l'exécution ;
4. essaie Gemini 3.8 Flash d'abord et bascule sur Gemini 3.5 Flash-Lite en cas de quota épuisé ;
5. valide la structure, les doublons, les liens HTTPS et les domaines de sources autorisés ;
6. publie dans Sanity les fiches qui passent les contrôles.

Si les quotas sont épuisés, la génération s'arrête sans appeler de modèle payant. Les fiches déjà publiées restent disponibles.

Les contrôles de sources ne représentent **pas** une vérification indépendante de chaque affirmation factuelle. Une URL peut être bien formée et provenir d'un domaine fiable sans que chaque phrase de l'article soit nécessairement correcte. Les fiches restent rédigées avec prudence et sources visibles.

Pour viser strictement 0 €, conserve le projet Gemini au niveau gratuit, n'active pas de facturation pour ce projet et n'ajoute pas d'outils payants comme la recherche intégrée. Google peut utiliser les données soumises au niveau gratuit pour améliorer ses produits ; n'envoie donc pas de données personnelles ou confidentielles.

Voir aussi [`docs/generation-automatique.md`](docs/generation-automatique.md) pour les détails de configuration. Après avoir renseigné le Project ID et le dataset Sanity, tu pourras ouvrir `/studio` sur le site déployé pour consulter les domaines et fiches.
