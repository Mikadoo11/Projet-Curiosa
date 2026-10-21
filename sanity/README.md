# Sanity CMS

Les schémas du domaine et des fiches sont préparés dans `schemas/`. Le studio n'est pas encore embarqué dans Next.js et aucune mutation de publication n'est active à cette étape. Lors de la phase CMS, configurez un projet Sanity, ajoutez son project ID dans `.env.local`, puis reliez ces schémas à `sanity.config.ts`. La publication automatisée doit passer par un service serveur et ses contrôles bloquants ; ne placez jamais un jeton d'écriture dans une variable `NEXT_PUBLIC_*`.
