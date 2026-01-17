import type { ExtractionRequest, ExtractionResponse, HealthCheckResponse } from '../types/recipe';

const API_URL = import.meta.env.VITE_API_URL || '';

export class ApiError extends Error {
  statusCode: number;
  details?: string[];

  constructor(message: string, statusCode: number, details?: string[]) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json();
  
  if (!response.ok) {
    throw new ApiError(
      data.error || 'Une erreur est survenue',
      data.statusCode || response.status,
      data.details
    );
  }
  
  return data;
}

export const extractRecipe = async (request: ExtractionRequest): Promise<ExtractionResponse> => {
  try {
    const response = await fetch(`${API_URL}/extract-recipe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    return await handleResponse<ExtractionResponse>(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Erreur de connexion au serveur', 500);
  }
};

export const checkHealth = async (): Promise<HealthCheckResponse> => {
  try {
    const response = await fetch(`${API_URL}/health`);
    return await handleResponse<HealthCheckResponse>(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Erreur de connexion au serveur', 500);
  }
};

export const uploadRecipeFile = async (file: File): Promise<ExtractionResponse> => {
  try {
    // Étape 1 : Récupérer l'URL présignée
    const uploadResponse = await fetch('https://recipekeeper-api-preprod.cyrilmarchive.com/recipes/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileName: file.name,
        contentType: file.type,
        fileSize: file.size,
      }),
    });

    if (!uploadResponse.ok) {
      throw new ApiError('Erreur lors de la récupération de l\'URL présignée', uploadResponse.status);
    }

    const uploadData = await uploadResponse.json();
    console.log('Réponse de /recipes/upload:', uploadData);
    
    const presignedUrl = uploadData.data?.uploadUrl;
    console.log('URL présignée:', presignedUrl);

    if (!presignedUrl) {
      throw new ApiError('URL présignée non reçue', 500);
    }

    // Étape 2 : Upload du fichier vers l'URL présignée
    console.log('Upload du fichier vers S3...', { fileName: file.name, size: file.size, type: file.type });
    const putResponse = await fetch(presignedUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      body: file,
    });

    console.log('Réponse PUT:', putResponse.status, putResponse.statusText);

    if (!putResponse.ok) {
      throw new ApiError('Erreur lors de l\'upload du fichier', putResponse.status);
    }

    // Retourner les informations d'upload
    return {
      success: true,
      data: {
        recipe: {
          title: 'Fichier uploadé',
          servings: 0,
          ingredients: [],
          steps: [],
          tags: [],
        },
        s3Key: uploadData.data?.key,
        message: 'Fichier uploadé avec succès',
      },
    } as ExtractionResponse;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Erreur lors de l\'upload du fichier', 500);
  }
};
