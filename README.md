# AKWABA FC — Plateforme numérique officielle

Site public + Club TV + back-office administrable pour AKWABA FC : actualités,
équipes (Hommes, Féminines, Réserve, U18), joueurs, Centre de Formation,
Match Center, classements, Club TV, galerie, supporters, billetterie,
boutique, partenaires, espace presse, recrutement — le tout piloté depuis un
CMS interne (aucune information n'est codée en dur).

## Stack

- **Next.js 16** (App Router, Turbopack) + **TypeScript** + **Tailwind CSS v4**
- **Prisma** + **SQLite** en local (fichier `prisma/dev.db`, zéro configuration).
  Pour la production, changer `provider` en `"postgresql"` dans
  `prisma/schema.prisma`, renseigner `DATABASE_URL`, puis `pnpm db:push`.
- **Authentification maison** : sessions JWT signées (`jose`) + mots de passe
  hashés (`bcryptjs`), rôles (Super Admin, Administrateur, Éditeur,
  Responsable sportif, Responsable Academy, Responsable média) appliqués par
  `proxy.ts` (middleware) et par chaque Server Action.
- **Framer Motion** pour les animations (apparitions, compteurs animés,
  transitions), mode sombre natif.

## Démarrage

```bash
pnpm install
cp .env.example .env        # puis générer un SESSION_SECRET (voir le fichier)
pnpm db:push                # crée le schéma SQLite
pnpm db:seed                # peuple des données de démonstration réalistes
pnpm dev                    # http://localhost:3000
```

Identifiants admin créés par le seed (à changer en production) :
`admin@akwabafc.ci` / mot de passe défini dans `.env` (`SEED_ADMIN_PASSWORD`).
Des comptes de démonstration existent aussi pour chaque rôle
(`redaction@`, `sportif@`, `academy@`, `media@`, `direction@akwabafc.ci`,
même mot de passe).

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
