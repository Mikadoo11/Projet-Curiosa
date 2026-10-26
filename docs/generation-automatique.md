# Curiosa — génération automatique (phase suivante)

Cette mise à jour ajoute une première version du pipeline de génération quotidienne :

- déclenchement quotidien par Vercel Cron (Hobby : une invocation par jour) ;
- génération en français via Gemini 3.8 Flash, puis bascule vers Gemini 3.5 Flash-Lite quand le premier modèle renvoie une erreur de quota ;
- plafond local de 5 fiches par exécution ;
- arrêt sans bascule payante si le quota du modèle de secours est atteint ;
- validation Zod du contenu et des champs nécessaires à Sanity ;
- contrôle HTTPS, domaines de sources autorisés, détection de liens explicitement 404/410 et prévention des doublons ;
- sauvegarde des fiches publiées dans Sanity ;
- initialisation idempotente des six domaines et transfert du contenu de démonstration existant dans la bibliothèque Sanity.

## Variables à configurer dans Vercel

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET` (normalement `production`)
- `SANITY_API_WRITE_TOKEN` (token d'écriture Sanity ; secret serveur, jamais `NEXT_PUBLIC_`)
- `GEMINI_API_KEY` (clé d'un projet qui reste sur le niveau gratuit)
- `CRON_SECRET` (long secret aléatoire ; Vercel l'utilise pour signer les appels Cron)
- `GENERATION_ENABLED=true` uniquement après configuration et test
- `GENERATION_DAILY_TARGET=5`
- `GEMINI_PRIMARY_MODEL=gemini-3.8-flash`
- `GEMINI_FALLBACK_MODEL=gemini-3.5-flash-lite`
- `SITE_URL` (l'adresse Vercel finale)

Dans Google AI Studio, conserve le projet sur le niveau gratuit et n'ajoute pas de facturation à ce projet si l'exigence est zéro dépense. Le code ne demande pas la recherche Google intégrée et n'utilise pas de modèle payant comme solution de secours. Les quotas peuvent évoluer : le fait d'utiliser un modèle gratuit ne remplace pas la vérification du niveau de facturation du projet Google.

## Limites importantes

Les contrôles automatiques valident la forme de la fiche, les doublons et les domaines/URLs des sources. Ils ne constituent pas une vérification indépendante de chaque affirmation factuelle. Les fiches publiées doivent rester nuancées et citer des sources pertinentes. Si une source est invalide ou un quota indisponible, la fiche concernée n'est pas publiée et la tâche s'arrête ou continue selon l'erreur.

Le cron est programmé à 17:00 UTC, soit environ 02:00–02:59 heure de Corée selon la fenêtre d'exécution Vercel. Le plan Hobby n'exécute les cron jobs qu'une fois par jour et peut les déclencher à n'importe quel moment de l'heure configurée.



Pour accélérer le remplissage initial, après configuration complète et uniquement depuis un terminal local, l'administrateur peut appeler le même endpoint protégé avec `?count=10` (jusqu'à 10 fiches par appel). Le cron quotidien sans paramètre reste limité à 5 fiches. L'appel manuel requiert l'en-tête `Authorization: Bearer <CRON_SECRET>` ; ne mets jamais le secret dans l'URL et ne le partage pas. Le stock initial comprend aussi les fiches de démonstration existantes transférées vers Sanity au premier lancement.
