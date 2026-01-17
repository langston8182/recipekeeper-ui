export interface Ingredient {
  name: string;
  quantity: number;
  unit?: string | null;
}

export interface Step {
  order: number;
  text: string;
}

export interface Recipe {
  id?: string;
  title: string;
  servings: number;
  ingredients: Ingredient[];
  steps: Step[];
  tags: string[];
  sourceUrl?: string;
  createdAt?: string;
}

export interface ExtractionRequest {
  recipeText?: string;
  url?: string;
}

export interface ExtractionResponse {
  success: boolean;
  data?: {
    recipe: Recipe;
    apiResponse?: {
      statusCode: number;
      message: string;
    };
    sourceUrl?: string;
    extractedTextLength?: number;
  };
  error?: string;
  statusCode?: number;
  details?: string[];
}

export interface HealthCheckResponse {
  success: boolean;
  data?: {
    status: 'healthy' | 'degraded' | 'unhealthy';
    timestamp: string;
    version: string;
    services?: {
      bedrock?: 'available' | 'unavailable';
      textract?: 'available' | 'unavailable';
    };
  };
}
