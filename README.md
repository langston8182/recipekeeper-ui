# RecipeKeeper UI

Application web React pour centraliser et uniformiser vos recettes.

## 🚀 Démarrage rapide

### Installation

```bash
npm install
```

### Configuration

Créez un fichier `.env` à la racine du projet (ou copiez `.env.example`) :

```env
ENVIRONMENT=preprod
VITE_API_URL=https://recipekeeper-api-preprod.cyrilmarchive.com
```

### Développement

```bash
npm run dev
```

L'application sera disponible sur `http://localhost:5173`

### Build

```bash
npm run build
```

## 📋 Fonctionnalités

- **Authentification mockée** : Login/logout sans vérification backend
- **Ajout de recettes** via 3 modes :
  - 📝 Texte brut
  - 🔗 URL de page web
  - 📷 Photo/PDF (à venir)
- **Consultation** : Liste et détail des recettes avec onglets
- **Catégorisation** : Organisation par tags
- **Recherche** : Par titre et ingrédients
- **Partage** : Copie dans le presse-papiers

## 🏗️ Structure du projet

```
src/
├── components/       # Composants réutilisables (Header, ProtectedRoute)
├── contexts/         # React Context (AuthContext)
├── pages/           # Pages de l'application
│   ├── Login.tsx    # Page de connexion mockée
│   ├── Home.tsx     # Accueil avec tuiles de catégories
│   ├── RecipeList.tsx    # Liste des recettes
│   ├── RecipeDetail.tsx  # Détail d'une recette (onglets)
│   └── AddRecipe.tsx     # Ajout/extraction de recette
├── services/        # Services (API, localStorage)
│   ├── api.ts       # Appels vers l'API backend
│   └── storage.ts   # Gestion localStorage
├── types/           # Types TypeScript
└── App.tsx          # Router principal
```

## 🎨 Design

- **Couleur principale** : Orange/Rouge (#f85032)
- **Responsive** : Mobile-first design
- **Accessibilité** : Labels, focus visible, bon contraste

## 🔧 Technologies

- **Framework** : React 18 + TypeScript
- **Build** : Vite
- **Router** : React Router v6
- **Styling** : CSS modules
- **Storage** : localStorage (MVP)

## 📡 API

L'application s'intègre avec l'API RecipeKeeper AI pour l'extraction de recettes :

- `POST /extract` : Extraction depuis texte ou URL
- `GET /health` : État du service

## 🔐 Authentification

Pour le MVP, l'authentification est mockée :
- Pas de backend d'auth
- Flag `localStorage.recipekeeper_auth`
- Login/logout simulés

## 📦 Scripts disponibles

- `npm run dev` : Démarrer le serveur de développement
- `npm run build` : Build de production
- `npm run preview` : Prévisualiser le build
- `npm run lint` : Linter le code

## 🚧 Limitations connues

- Pas de suppression ni d'édition de recettes
- Favoris non implémentés (placeholder)
- Upload photo/PDF en attente d'implémentation backend
- Données stockées uniquement en local (localStorage)

## 📝 License

MIT

