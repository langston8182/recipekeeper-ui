import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { extractRecipe, uploadRecipeFile, ApiError } from '../services/api';
import { storageService } from '../services/storage';
import type { Recipe } from '../types/recipe';
import './AddRecipe.css';

type ModeType = 'text' | 'url' | 'upload';

export const AddRecipe = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<ModeType>('text');
  const [recipeText, setRecipeText] = useState('');
  const [url, setUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  const [extractedRecipe, setExtractedRecipe] = useState<Recipe | null>(null);

  const handleExtract = async () => {
    setError(null);
    setErrorDetails([]);
    setExtractedRecipe(null);
    setLoading(true);

    try {
      const request = mode === 'text' ? { recipeText } : { url };
      const response = await extractRecipe(request);

      if (response.success && response.data?.recipe) {
        setExtractedRecipe(response.data.recipe);
      } else {
        setError('Impossible d\'extraire la recette');
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        if (err.details) {
          setErrorDetails(err.details);
        }
      } else {
        setError('Une erreur est survenue lors de l\'extraction');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (extractedRecipe) {
      storageService.addRecipe(extractedRecipe);
      navigate('/');
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    setError(null);
    setErrorDetails([]);
    setExtractedRecipe(null);
    setLoading(true);

    try {
      const response = await uploadRecipeFile(selectedFile);

      if (response.success && response.data?.recipe) {
        setExtractedRecipe(response.data.recipe);
      } else {
        setError('Impossible d\'extraire la recette depuis le fichier');
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        if (err.details) {
          setErrorDetails(err.details);
        }
      } else {
        setError('Une erreur est survenue lors de l\'upload du fichier');
      }
    } finally {
      setLoading(false);
    }
  };



  const getErrorHelp = (statusCode?: number) => {
    switch (statusCode) {
      case 400:
        return 'Vérifiez que vous avez bien rempli tous les champs requis.';
      case 422:
        return 'Le contenu fourni ne semble pas contenir de recette. Essayez d\'ajouter plus de détails.';
      case 502:
        return 'Impossible de récupérer le contenu de l\'URL. Vérifiez qu\'elle est accessible.';
      case 503:
        return 'Le service d\'extraction est temporairement indisponible. Réessayez dans quelques instants.';
      default:
        return '';
    }
  };

  return (
    <div className="add-recipe-page">
      <Header />

      <div className="add-recipe-content">
        <Link to="/" className="back-link">
          ← Retour
        </Link>

        <h1>Ajouter une recette</h1>

        <div className="mode-selector">
          <button
            className={`mode-btn ${mode === 'text' ? 'active' : ''}`}
            onClick={() => setMode('text')}
          >
            📝 Texte
          </button>
          <button
            className={`mode-btn ${mode === 'url' ? 'active' : ''}`}
            onClick={() => setMode('url')}
          >
            🔗 URL
          </button>
          <button
            className={`mode-btn ${mode === 'upload' ? 'active' : ''}`}
            onClick={() => setMode('upload')}
          >
            📷 Photo/PDF
          </button>
        </div>

        <div className="extraction-form">
          {mode === 'text' && (
            <div className="form-section">
              <label htmlFor="recipeText">Collez votre recette</label>
              <textarea
                id="recipeText"
                value={recipeText}
                onChange={(e) => setRecipeText(e.target.value)}
                placeholder="Collez le texte de votre recette ici...&#10;&#10;Exemple:&#10;Pâtes Carbonara pour 4 personnes&#10;&#10;Ingrédients:&#10;- 400g de spaghetti&#10;- 200g de lardons..."
                rows={12}
                disabled={loading}
              />
              <button
                className="btn-primary"
                onClick={handleExtract}
                disabled={loading || !recipeText.trim()}
              >
                {loading ? 'Extraction en cours...' : 'Extraire la recette'}
              </button>
            </div>
          )}

          {mode === 'url' && (
            <div className="form-section">
              <label htmlFor="url">URL de la recette</label>
              <input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.marmiton.org/recettes/..."
                disabled={loading}
              />
              <button
                className="btn-primary"
                onClick={handleExtract}
                disabled={loading || !url.trim()}
              >
                {loading ? 'Extraction en cours...' : 'Extraire depuis l\'URL'}
              </button>
            </div>
          )}

          {mode === 'upload' && (
            <div className="form-section">
              <div className="file-upload-section">
                {selectedFile ? (
                  <div className="file-selected">
                    <div className="file-info">
                      <span className="file-icon">
                        {selectedFile.type.startsWith('image/') ? '🖼️' : '📄'}
                      </span>
                      <div className="file-details">
                        <span className="file-name">{selectedFile.name}</span>
                        <span className="file-size">
                          {(selectedFile.size / 1024).toFixed(1)} KB
                        </span>
                      </div>
                    </div>
                    <button
                      className="btn-remove"
                      onClick={() => setSelectedFile(null)}
                      type="button"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="upload-buttons">
                    <label htmlFor="cameraInput" className="camera-button">
                      <input
                        id="cameraInput"
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleFileChange}
                        className="file-input"
                        disabled={loading}
                      />
                      <span className="button-icon">📷</span>
                      <span className="button-text">Ouvrir la caméra</span>
                    </label>
                    
                    <label htmlFor="fileSelect" className="file-button">
                      <input
                        id="fileSelect"
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={handleFileChange}
                        className="file-input"
                        disabled={loading}
                      />
                      <span className="button-icon">📁</span>
                      <span className="button-text">Choisir un fichier</span>
                    </label>
                  </div>
                )}
              </div>

              {selectedFile && (
                <button
                  className="btn-primary"
                  onClick={handleFileUpload}
                  disabled={loading}
                >
                  {loading ? 'Extraction en cours...' : 'Extraire la recette'}
                </button>
              )}
            </div>
          )}
        </div>

        {error && (
          <div className="error-message">
            <div className="error-header">
              <span className="error-icon">⚠️</span>
              <span className="error-text">{error}</span>
            </div>
            {getErrorHelp(503) && (
              <p className="error-help">{getErrorHelp(503)}</p>
            )}
            {errorDetails.length > 0 && (
              <>
                <button
                  className="error-toggle"
                  onClick={() => setShowDetails(!showDetails)}
                >
                  {showDetails ? '▼' : '▶'} Voir les détails
                </button>
                {showDetails && (
                  <div className="error-details">
                    {errorDetails.map((detail, idx) => (
                      <p key={idx}>{detail}</p>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {extractedRecipe && (
          <div className="extracted-result">
            <div className="result-header">
              <h2>✅ Recette extraite avec succès</h2>
              <button className="btn-primary" onClick={handleSave}>
                Sauvegarder
              </button>
            </div>

            <div className="result-preview">
              <h3>{extractedRecipe.title}</h3>
              <p className="result-meta">
                👥 {extractedRecipe.servings} personnes • 📝 {extractedRecipe.steps.length} étapes
              </p>

              <div className="result-section">
                <h4>Ingrédients ({extractedRecipe.ingredients.length})</h4>
                <ul>
                  {extractedRecipe.ingredients.slice(0, 5).map((ing, idx) => (
                    <li key={idx}>
                      {ing.quantity}
                      {ing.unit || ''} {ing.name}
                    </li>
                  ))}
                  {extractedRecipe.ingredients.length > 5 && (
                    <li className="more-indicator">
                      + {extractedRecipe.ingredients.length - 5} autre(s)
                    </li>
                  )}
                </ul>
              </div>

              <div className="result-section">
                <h4>Étapes</h4>
                <ol>
                  {extractedRecipe.steps.slice(0, 3).map((step) => (
                    <li key={step.order}>{step.text}</li>
                  ))}
                  {extractedRecipe.steps.length > 3 && (
                    <li className="more-indicator">
                      + {extractedRecipe.steps.length - 3} autre(s) étape(s)
                    </li>
                  )}
                </ol>
              </div>

              {extractedRecipe.tags.length > 0 && (
                <div className="result-tags">
                  {extractedRecipe.tags.map(tag => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
