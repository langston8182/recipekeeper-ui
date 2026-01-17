import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Header } from '../components/Header';
import type { Recipe } from '../types/recipe';
import { storageService } from '../services/storage';
import './RecipeList.css';

export const RecipeList = () => {
  const [searchParams] = useSearchParams();
  const tag = searchParams.get('tag');
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    if (tag) {
      setRecipes(storageService.getRecipesByTag(tag));
    } else {
      setRecipes(storageService.getRecipes());
    }
  }, [tag]);

  return (
    <div className="recipe-list-page">
      <Header />

      <div className="recipe-list-content">
        <div className="list-header">
          <h1>{tag ? `${tag.charAt(0).toUpperCase() + tag.slice(1)}` : 'Toutes les recettes'}</h1>
          <p>{recipes.length} recette{recipes.length !== 1 ? 's' : ''}</p>
        </div>

        {recipes.length === 0 ? (
          <div className="empty-state">
            <p>Aucune recette trouvée</p>
            <Link to="/add" className="btn-primary">
              Ajouter une recette
            </Link>
          </div>
        ) : (
          <div className="recipes-grid">
            {recipes.map(recipe => (
              <Link key={recipe.id} to={`/recipes/${recipe.id}`} className="recipe-card">
                <div className="recipe-image-placeholder">
                  <span>🍽️</span>
                </div>
                <div className="recipe-info">
                  <h3>{recipe.title}</h3>
                  <div className="recipe-meta">
                    <span>👥 {recipe.servings}</span>
                    <span>📝 {recipe.steps.length} étapes</span>
                  </div>
                  {recipe.tags.length > 0 && (
                    <div className="recipe-tags">
                      {recipe.tags.map(tag => (
                        <span key={tag} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
