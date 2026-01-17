import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import type { Recipe } from '../types/recipe';
import { storageService } from '../services/storage';
import './Home.css';

type TabType = 'plats' | 'favoris' | 'recent';

interface Category {
  name: string;
  displayName: string;
  count: number;
}

export const Home = () => {
  const [activeTab, setActiveTab] = useState<TabType>('plats');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const loadedRecipes = storageService.getRecipes();
    setRecipes(loadedRecipes);

    // Extract categories from tags
    const tagCounts = new Map<string, number>();
    loadedRecipes.forEach(recipe => {
      recipe.tags.forEach(tag => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });

    const cats: Category[] = Array.from(tagCounts.entries()).map(([tag, count]) => ({
      name: tag,
      displayName: tag.charAt(0).toUpperCase() + tag.slice(1),
      count,
    }));

    setCategories(cats);
  }, []);

  const getFilteredRecipes = () => {
    if (activeTab === 'recent') {
      return [...recipes].sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA;
      }).slice(0, 10);
    }
    return recipes;
  };

  return (
    <div className="home-page">
      <Header />

      <div className="home-content">
        <div className="hero-section">
          <h1>Toutes vos recettes en un seul endroit</h1>
          <p>Entre amis et en famille</p>
        </div>

        <div className="tabs">
          <button
            className={`tab ${activeTab === 'plats' ? 'active' : ''}`}
            onClick={() => setActiveTab('plats')}
          >
            PLATS
          </button>
          <button
            className={`tab ${activeTab === 'favoris' ? 'active' : ''}`}
            onClick={() => setActiveTab('favoris')}
          >
            FAVORIS
          </button>
          <button
            className={`tab ${activeTab === 'recent' ? 'active' : ''}`}
            onClick={() => setActiveTab('recent')}
          >
            RÉCENT
          </button>
        </div>

        {activeTab === 'favoris' && (
          <div className="empty-state">
            <p>🌟 Fonctionnalité à venir</p>
          </div>
        )}

        {activeTab === 'plats' && (
          <>
            {recipes.length === 0 ? (
              <div className="empty-state">
                <p>Aucune recette pour le moment</p>
                <Link to="/add" className="btn-primary">
                  Ajouter une recette
                </Link>
              </div>
            ) : (
              <div className="categories-grid">
                <Link to="/recipes" className="category-tile all">
                  <div className="category-content">
                    <span className="category-name">Tout</span>
                    <span className="category-count">{recipes.length}</span>
                  </div>
                </Link>

                {categories.map(category => (
                  <Link
                    key={category.name}
                    to={`/recipes?tag=${category.name}`}
                    className="category-tile"
                  >
                    <div className="category-content">
                      <span className="category-name">{category.displayName}</span>
                      <span className="category-count">{category.count}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'recent' && (
          <>
            {recipes.length === 0 ? (
              <div className="empty-state">
                <p>Aucune recette récente</p>
                <Link to="/add" className="btn-primary">
                  Ajouter une recette
                </Link>
              </div>
            ) : (
              <div className="recipes-list">
                {getFilteredRecipes().map(recipe => (
                  <Link key={recipe.id} to={`/recipes/${recipe.id}`} className="recipe-card">
                    <div className="recipe-card-content">
                      <h3>{recipe.title}</h3>
                      <div className="recipe-meta">
                        <span>👥 {recipe.servings} pers.</span>
                        {recipe.tags.length > 0 && (
                          <span className="recipe-tags">
                            {recipe.tags.slice(0, 2).join(', ')}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
