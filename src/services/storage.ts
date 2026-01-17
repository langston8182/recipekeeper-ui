import type { Recipe } from '../types/recipe';
import { getRecipes as getRecipesFromApi } from './api';

const RECIPES_KEY = 'recipekeeper_recipes';
const AUTH_KEY = 'recipekeeper_auth';

export const storageService = {
  // Authentication
  isAuthenticated(): boolean {
    return localStorage.getItem(AUTH_KEY) === 'true';
  },

  login(): void {
    localStorage.setItem(AUTH_KEY, 'true');
  },

  logout(): void {
    localStorage.removeItem(AUTH_KEY);
  },

  // Recipes - récupère depuis l'API
  async getRecipes(): Promise<Recipe[]> {
    try {
      const response = await getRecipesFromApi();
      if (response.data && Array.isArray(response.data)) {
        // Mapper _id vers id pour compatibilité
        return response.data.map((recipe: any) => ({
          ...recipe,
          id: recipe._id || recipe.id,
        }));
      }
      return [];
    } catch (error) {
      console.error('Erreur lors de la récupération des recettes:', error);
      return [];
    }
  },

  addRecipe(recipe: Recipe): Recipe {
    const newRecipe = {
      ...recipe,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    // Pour l'instant, on garde le localStorage pour addRecipe
    // À terme, ce sera un POST vers l'API
    const recipes = JSON.parse(localStorage.getItem(RECIPES_KEY) || '[]');
    recipes.unshift(newRecipe);
    localStorage.setItem(RECIPES_KEY, JSON.stringify(recipes));
    return newRecipe;
  },

  async getRecipeById(id: string): Promise<Recipe | undefined> {
    const recipes = await this.getRecipes();
    return recipes.find(r => r.id === id);
  },

  async getRecipesByTag(tag: string): Promise<Recipe[]> {
    const recipes = await this.getRecipes();
    if (tag === 'all') return recipes;
    return recipes.filter(r => r.tags.some(t => t.toLowerCase() === tag.toLowerCase()));
  },

  async searchRecipes(query: string): Promise<Recipe[]> {
    const recipes = await this.getRecipes();
    const lowerQuery = query.toLowerCase();
    
    return recipes.filter(recipe => {
      const titleMatch = recipe.title.toLowerCase().includes(lowerQuery);
      const ingredientMatch = recipe.ingredients.some(ing => 
        ing.name.toLowerCase().includes(lowerQuery)
      );
      return titleMatch || ingredientMatch;
    });
  },
};
