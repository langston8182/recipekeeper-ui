import type { Recipe } from '../types/recipe';

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

  // Recipes
  getRecipes(): Recipe[] {
    const data = localStorage.getItem(RECIPES_KEY);
    if (!data) return [];
    
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  addRecipe(recipe: Recipe): Recipe {
    const recipes = this.getRecipes();
    const newRecipe = {
      ...recipe,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    recipes.unshift(newRecipe);
    localStorage.setItem(RECIPES_KEY, JSON.stringify(recipes));
    return newRecipe;
  },

  getRecipeById(id: string): Recipe | undefined {
    const recipes = this.getRecipes();
    return recipes.find(r => r.id === id);
  },

  getRecipesByTag(tag: string): Recipe[] {
    const recipes = this.getRecipes();
    if (tag === 'all') return recipes;
    return recipes.filter(r => r.tags.some(t => t.toLowerCase() === tag.toLowerCase()));
  },

  searchRecipes(query: string): Recipe[] {
    const recipes = this.getRecipes();
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
