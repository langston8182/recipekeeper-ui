# Guide de test RecipeKeeper UI

## ✅ Le projet est prêt !

L'application est en cours d'exécution sur **http://localhost:5173**

## 🧪 Tests à effectuer

### 1. Page de Login (Mock)
- Accédez à l'application
- Vous devriez être redirigé vers `/login`
- Entrez n'importe quel email/mot de passe (ou laissez vide)
- Cliquez sur "Se connecter"
- ✅ Vous devriez être redirigé vers l'accueil

### 2. Page d'accueil
- Vérifiez le header orange avec le logo et les boutons
- Onglets : **PLATS**, **FAVORIS**, **RÉCENT**
- Si aucune recette : message "Aucune recette pour le moment" + bouton "Ajouter une recette"
- Cliquez sur "Favoris" : doit afficher "🌟 Fonctionnalité à venir"

### 3. Ajouter une recette (Mode Texte)
- Cliquez sur le bouton **+** dans le header
- Sélectionnez l'onglet **📝 Texte**
- Collez ce texte de test :

```
Pâtes Carbonara pour 4 personnes

Ingrédients:
- 400g de spaghetti
- 200g de lardons
- 4 œufs
- 100g de parmesan râpé
- Sel et poivre

Étapes:
1. Cuire les pâtes al dente dans l'eau bouillante salée
2. Faire revenir les lardons dans une poêle
3. Mélanger les œufs et le parmesan dans un bol
4. Égoutter les pâtes et les mélanger hors du feu avec les œufs et lardons
5. Poivrer et servir immédiatement
```

- Cliquez sur "Extraire la recette"
- ⚠️ **Note** : L'API doit être disponible pour que ça fonctionne
- Si l'extraction réussit : un aperçu s'affiche
- Cliquez sur "Sauvegarder"
- ✅ Vous devriez être redirigé vers l'accueil avec la recette visible

### 4. Ajouter une recette (Mode URL)
- Retournez sur "Ajouter une recette"
- Sélectionnez l'onglet **🔗 URL**
- Essayez une URL comme :
  ```
  https://www.marmiton.org/recettes/recette_pates-a-la-carbonara_11736.aspx
  ```
- Cliquez sur "Extraire depuis l'URL"
- Même comportement qu'avec le texte

### 5. Catalogue de recettes
- Sur l'accueil, vous devriez voir des tuiles :
  - **Tout** (avec le nombre total de recettes)
  - Une tuile par catégorie/tag
- Cliquez sur "Tout" : affiche toutes les recettes
- Cliquez sur une catégorie : filtre les recettes

### 6. Détail d'une recette
- Cliquez sur une recette
- Vérifiez les 4 onglets :
  - **APERÇU** : portions, tags, source
  - **INGRÉDIENTS** : liste avec quantités
  - **PRÉPARATION** : étapes numérotées
  - **NOTES** : "Aucune note disponible"
- Testez le bouton **📤 Partager** : doit copier la recette dans le presse-papiers
- Cliquez sur "← Retour" : retour à l'accueil

### 7. Déconnexion
- Cliquez sur le bouton 🚪 dans le header
- ✅ Vous devriez être redirigé vers `/login`
- Le localStorage est vidé

## ⚠️ Points d'attention

### Si l'API n'est pas disponible
L'extraction (texte ou URL) échouera avec une erreur. C'est normal !
- L'erreur sera affichée avec un message clair
- Pour tester sans l'API, vous pouvez :
  1. Modifier temporairement `AddRecipe.tsx` pour créer une recette mock
  2. Ou attendre que l'API soit déployée

### Données locales
- Les recettes sont stockées dans `localStorage`
- Elles persistent entre les rechargements de page
- Pour réinitialiser : `localStorage.clear()` dans la console du navigateur

## 🎨 Vérifications visuelles

### Design attendu
- ✅ Header rouge/orange (#f85032)
- ✅ Tuiles colorées sur l'accueil
- ✅ Design responsive mobile
- ✅ Transitions douces au survol

### Mobile
- Testez en mode responsive (cmd+option+i sur Mac, F12 sur Windows)
- Le design doit s'adapter aux petits écrans
- Les onglets doivent rester accessibles

## 🐛 Commandes utiles

### Relancer le serveur
```bash
npm run dev
```

### Voir les erreurs
```bash
# Dans la console du navigateur (F12)
```

### Nettoyer le localStorage
```javascript
// Dans la console du navigateur
localStorage.clear()
location.reload()
```

## 📦 Build de production

Pour créer une version de production :
```bash
npm run build
npm run preview
```

## 🔧 Problèmes courants

### Erreur "Cannot find module"
→ Relancez `npm install`

### Erreur CORS avec l'API
→ Normal si l'API n'autorise pas localhost
→ Utilisez le mode texte avec des recettes mockées

### Le style ne s'applique pas
→ Vérifiez que les fichiers CSS sont bien importés
→ Rechargez avec cmd+shift+R (Mac) ou ctrl+shift+R (Windows)

---

**Bon test ! 🚀**
