# test_node_js

## Description
Ce projet est une application complète de gestion de tâches (todos) avec un backend Node.js/Express/Prisma et un frontend React/Vite.

---

# Backend

## Fonctionnalités
- Authentification JWT
- Gestion des utilisateurs (CRUD, upload d'image, rôles)
- Gestion des tâches (CRUD, partage, marquer comme complétée, fichiers image/audio)
- Historique des actions
- Notifications
- Documentation Swagger

## Installation
1. Cloner le dépôt :
   ```bash
   git clone <repo-url>
   cd test_node_js
   ```
2. Installer les dépendances :
   ```bash
   npm install
   ```
3. Configurer la base de données dans `.env` :
   ```env
   DATABASE_URL="mysql://user:password@localhost:3306/nom_de_la_db"
   ```
4. Générer le client Prisma et migrer la base :
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```
5. Lancer le serveur :
   ```bash
   npm run dev
   ```

## Structure du backend
```
├── src/
│   ├── index.ts                # Point d'entrée principal
│   ├── auth/                   # JWT et config
│   ├── config/                 # Config DB/env
│   ├── controllers/            # Logique métier (auth, user, todo, historique)
│   ├── middlewares/            # Auth, accès
│   ├── repositories/           # Accès aux données
│   ├── routes/                 # Définition des routes
│   ├── services/               # Services métier
│   ├── utils/                  # Utilitaires
│   ├── validators/             # Validation des schémas
├── prisma/
│   ├── schema.prisma           # Schéma de la base
│   ├── migrations/             # Migrations SQL
│   ├── seeds.js                # Seed de données
├── assets/                     # Images uploadées
├── audio/                      # Fichiers audio
├── package.json                # Dépendances et scripts
├── tsconfig.json               # Config TypeScript
```

## Principales routes API

### Authentification
- `POST /api/auth/login` : Connexion
- `POST /api/auth/refresh-token` : Rafraîchir le token
- `POST /api/auth/logout` : Déconnexion

### Utilisateurs
- `GET /api/user` : Liste des utilisateurs
- `GET /api/user/:id` : Détail utilisateur
- `POST /api/user` : Création
- `PUT /api/user/:id` : Modification
- `DELETE /api/user/:id` : Suppression
- `POST /api/user/:id/upload-image` : Upload d'image de profil
- `GET /api/user/:id/shared-todos` : Todos partagés avec l'utilisateur

### Todos
- `GET /api/todo` : Liste des tâches
- `GET /api/todo/:id` : Détail tâche
- `POST /api/todo` : Création
- `PUT /api/todo/:id` : Modification
- `DELETE /api/todo/:id` : Suppression
- `PATCH /api/todo/:id/complete` : Marquer comme complétée
- `PATCH /api/todo/:id/archive` : Archiver
- `PATCH /api/todo/:id/unarchive` : Désarchiver
- `POST /api/todo/:id/share` : Partager une tâche

### Historique
- `GET /api/historique` : Liste des actions
- `POST /api/historique` : Ajouter une action
- `PUT /api/historique/:id` : Modifier une action
- `DELETE /api/historique/:id` : Supprimer une action

### Notifications
- `GET /api/notifications/:userId` : Notifications d'un utilisateur
- `PATCH /api/notifications/:id/read` : Marquer comme lue

### Documentation API
- Swagger disponible sur : `GET /api-docs`

## Schéma de la base de données (Prisma)

Voir le fichier `prisma/schema.prisma` pour le schéma complet.

---

# Frontend

## Fonctionnalités
- Application React avec Vite
- Authentification et gestion de session
- Affichage, création, édition, suppression de tâches
- Partage de tâches entre utilisateurs
- Upload d'image et d'audio
- Pagination, filtres, onglets
- Historique des actions
- Notifications
- UI moderne avec Tailwind CSS

## Installation
1. Aller dans le dossier `front-end` :
   ```bash
   cd front-end
   ```
2. Installer les dépendances :
   ```bash
   npm install
   ```
3. Lancer le serveur de développement :
   ```bash
   npm run dev
   ```

## Structure du frontend
```
front-end/
├── src/
│   ├── App.jsx                # Composant principal
│   ├── main.jsx               # Point d'entrée
│   ├── components/            # Composants réutilisables (TodoCard, Form, Header...)
│   ├── pages/                 # Pages (Login, Register, Todos, Dashboard...)
│   ├── hooks/                 # Hooks personnalisés
│   ├── utils/                 # Fonctions utilitaires
│   ├── assets/                # Images
│   ├── index.css, App.css     # Styles
├── public/                    # Fichiers statiques
├── package.json               # Dépendances et scripts
├── tailwind.config.js         # Config Tailwind
├── vite.config.js             # Config Vite
```

## Pages principales
- `/login` : Connexion
- `/register` : Inscription
- `/dashboard` : Tableau de bord
- `/todos` : Liste et gestion des tâches

## Fonctionnement général
- Le frontend communique avec l’API backend via fetch/axios.
- La gestion d’état se fait avec React et des hooks personnalisés.
- Les formulaires utilisent `react-hook-form`.
- La navigation est gérée par `react-router-dom`.
- Les notifications et historiques sont affichés en temps réel.

## Auteur
Moustapha Ndiaye
