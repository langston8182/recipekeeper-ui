import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Header } from '../components/Header';
import type { Recipe } from '../types/recipe';
import { storageService } from '../services/storage';
import './RecipeDetail.css';

type TabType = 'apercu' | 'ingredients' | 'preparation' | 'notes';

export const RecipeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('apercu');

  useEffect(() => {
    if (id) {
      const foundRecipe = storageService.getRecipeById(id);
      if (foundRecipe) {
        setRecipe(foundRecipe);
      } else {
        navigate('/');
      }
    }
  }, [id, navigate]);

  if (!recipe) {
    return (
      <div className="recipe-detail-page">
        <Header />
        <div className="loading">Chargement...</div>
      </div>
    );
  }

  const handleShare = () => {
    const text = `${recipe.title}\n\nPour ${recipe.servings} personnes\n\nIngrédients:\n${recipe.ingredients
      .map(i => `- ${i.quantity}${i.unit || ''} ${i.name}`)
      .join('\n')}\n\nÉtapes:\n${recipe.steps.map(s => `${s.order}. ${s.text}`).join('\n')}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      alert('Recette copiée dans le presse-papiers !');
    }
  };

  return (
    <div className="recipe-detail-page">
      <Header />

      <div className="recipe-detail-content">
        <Link to="/" className="back-link">
          ← Retour
        </Link>

        <div className="recipe-header">
          <div className="recipe-image-large">
            <span>🍽️</span>
          </div>
          <div className="recipe-title-section">
            <h1>{recipe.title}</h1>
            <button onClick={handleShare} className="btn-share" title="Partager">
              📤 Partager
            </button>
          </div>
        </div>

        <div className="recipe-tabs">
          <button
            className={`recipe-tab ${activeTab === 'apercu' ? 'active' : ''}`}
            onClick={() => setActiveTab('apercu')}
          >
            APERÇU
          </button>
          <button
            className={`recipe-tab ${activeTab === 'ingredients' ? 'active' : ''}`}
            onClick={() => setActiveTab('ingredients')}
          >
            INGRÉDIENTS
          </button>
          <button
            className={`recipe-tab ${activeTab === 'preparation' ? 'active' : ''}`}
            onClick={() => setActiveTab('preparation')}
          >
            PRÉPARATION
          </button>
          <button
            className={`recipe-tab ${activeTab === 'notes' ? 'active' : ''}`}
            onClick={() => setActiveTab('notes')}
          >
            NOTES
          </button>
        </div>

        <div className="recipe-tab-content">
          {activeTab === 'apercu' && (
            <div className="tab-panel">
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Source</span>
                  <span className="info-value">
                    {recipe.sourceUrl ? (
                      <a href={recipe.sourceUrl} target="_blank" rel="noopener noreferrer">
                        Lien source
                      </a>
                    ) : (
                      'Recipe Keeper'
                    )}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Taille de portion</span>
                  <span className="info-value">{recipe.servings}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Échelle</span>
                  <span className="info-value">1x</span>
                </div>
              </div>

              {recipe.tags.length > 0 && (
                <div className="tags-section">
                  <h3>Tags</h3>
                  <div className="tags-list">
                    {recipe.tags.map(tag => (
                      <span key={tag} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'ingredients' && (
            <div className="tab-panel">
              <ul className="ingredients-list">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="ingredient-item">
                    <span className="ingredient-quantity">
                      {ingredient.quantity}
                      {ingredient.unit || ''}
                    </span>
                    <span className="ingredient-name">{ingredient.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'preparation' && (
            <div className="tab-panel">
              <ol className="steps-list">
                {recipe.steps.map(step => (
                  <li key={step.order} className="step-item">
                    <span className="step-number">{step.order}</span>
                    <span className="step-text">{step.text}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="tab-panel">
              <p className="notes-placeholder">Aucune note disponible pour cette recette.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
