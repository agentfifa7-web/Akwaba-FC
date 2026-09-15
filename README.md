# AKWABA FC — Plateforme numérique officielle

Site public + Club TV + back-office administrable pour AKWABA FC : actualités,
équipes (Hommes, Féminines, Réserve, U18), joueurs, Centre de Formation,
Match Center, classements, Club TV, galerie, supporters, billetterie,
boutique, partenaires, espace presse, recrutement — le tout piloté depuis un
CMS interne (aucune information n'est codée en dur).

## Stack

- **Next.js 16** (App Router, Turbopack) + **TypeScript** + **Tailwind CSS v4**
- **Prisma** + **Postgres** (Neon, Vercel Postgres, Supabase... — voir
  `.env.example`). Aucune installation locale requise si vous utilisez une
  base Postgres gratuite hébergée (Neon).
- **Authentification maison** : sessions JWT signées (`jose`) + mots de passe
  hashés (`bcryptjs`), rôles (Super Admin, Administrateur, Éditeur,
  Responsable sportif, Responsable Academy, Responsable média) appliqués par
  `proxy.ts` (middleware) et par chaque Server Action.
- **Framer Motion** pour les animations (apparitions, compteurs animés,
  transitions), mode sombre natif.

## Démarrage

```bash
pnpm install
cp .env.example .env        # renseigner DATABASE_URL (Postgres) + SESSION_SECRET
pnpm db:push                # crée le schéma dans la base Postgres
pnpm db:seed                # peuple des données de démonstration réalistes
pnpm dev                    # http://localhost:3000
```

Identifiants admin créés par le seed (à changer en production) :
`admin@akwabafc.ci` / mot de passe défini dans `.env` (`SEED_ADMIN_PASSWORD`).
Des comptes de démonstration existent aussi pour chaque rôle
(`redaction@`, `sportif@`, `academy@`, `media@`, `direction@akwabafc.ci`,
même mot de passe).

## Déploiement sur Vercel

Le schéma Postgres a été validé (push + seed complet exécutés avec succès
contre une instance PostgreSQL 16 réelle) — ces étapes fonctionnent telles
quelles.

1. **Importer le projet** — sur [vercel.com/new](https://vercel.com/new),
   choisir *Import Git Repository* et sélectionner
   `agentfifa7-web/akwaba-fc`, branche `claude/plateforme-extraordinaire-nyj3a0`
   (ou `main` après fusion). Vercel détecte Next.js automatiquement, aucune
   configuration de build n'est nécessaire.
2. **Ajouter la base de données** — pendant l'écran d'import, section
   *Storage*, cliquer *Add* → **Neon** (Postgres serverless, offre gratuite)
   → *Create*. Vercel crée la base et injecte automatiquement une variable
   `DATABASE_URL` (ou `POSTGRES_URL` : dans ce cas, ajouter manuellement une
   variable `DATABASE_URL` avec la même valeur, car c'est le nom que Prisma
   attend ici).
3. **Ajouter les variables d'environnement restantes** (Project Settings →
   Environment Variables) :
   - `SESSION_SECRET` — valeur aléatoire (`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
   - `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` — utilisés uniquement par le
     seed local, pas nécessaires sur Vercel lui-même.
4. **Déployer** — cliquer *Deploy*. Le build (`prisma generate && next build`)
   ne touche pas encore aux tables : c'est volontaire, pour ne jamais risquer
   d'écraser des données en production à chaque déploiement.
5. **Créer les tables et les données de démo** (une seule fois, depuis votre
   machine, avec l'URL Postgres copiée depuis Vercel) :
   ```bash
   DATABASE_URL="<url Postgres copiée depuis Vercel>" pnpm db:push
   DATABASE_URL="<même url>" SEED_ADMIN_PASSWORD="VotreMotDePasse!" pnpm db:seed
   ```
6. Le site est en ligne sur l'URL fournie par Vercel ; `/admin/login` avec
   l'e-mail/mot de passe choisis à l'étape précédente.

Pour appliquer un futur changement de schéma en production, relancer la
commande `db:push` de l'étape 5 (jamais automatiquement au build, pour
garder le contrôle sur les migrations).

## Back-office

`/admin/login` — tableau de bord avec statistiques, puis un module CRUD par
type de contenu (actualités, joueurs, équipes, staff, matchs + événements en
direct, classements, vidéos/Club TV, galerie, partenaires, boutique,
billetterie, espace presse, pages du club, notifications, utilisateurs). Les
candidatures Academy et recrutement reçues via le site public apparaissent
directement dans le back-office.

## Ce qui est prêt pour la suite (architecture préparée, non branchée)

- **Paiement en ligne** (billetterie/boutique) : les commandes sont
  enregistrées en base (`TicketOrder`, `ShopOrder`) avec un statut ; il suffit
  de brancher un prestataire (Stripe, CinetPay…) sur la Server Action
  correspondante.
- **Upload de fichiers** : images/vidéos sont saisies par URL ; pour un
  vrai upload, connecter un stockage (Vercel Blob, S3…) au formulaire admin.
- **Notifications push** : le modèle `Notification` + le centre de
  notifications côté site sont fonctionnels ; le push web/mobile réel
  nécessite des clés VAPID / un provider mobile à configurer.
- **Diffusion vidéo en direct** : le statut `isLive` et l'affichage 🔴 EN
  DIRECT sont fonctionnels ; brancher un flux HLS/RTMP réel remplace le
  simple fichier vidéo de démonstration.
