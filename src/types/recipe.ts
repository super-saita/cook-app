export interface Recipe {
  id: string
  title: string
  requiredKeywords: string[]
  extraItems: string
  steps: string[]
}

export interface SavedRecipe extends Recipe {
  savedAt: string
  inputText: string
}
