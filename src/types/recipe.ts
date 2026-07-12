export interface RecipeIngredient {
  name: string
  amount: string
}

export interface Recipe {
  id: string
  title: string
  requiredKeywords: string[]
  servings: string
  ingredients: RecipeIngredient[]
  extraItems: string
  steps: string[]
  emoji: string
}
