import { recipes } from '../data/recipes'
import type { Recipe } from '../types/recipe'

export function matchRecipe(inputText: string): Recipe | null {
  const normalized = inputText.trim()
  if (!normalized) return null

  let bestRecipe: Recipe | null = null
  let bestScore = 0

  for (const recipe of recipes) {
    const score = recipe.requiredKeywords.filter((keyword) =>
      normalized.includes(keyword),
    ).length

    if (score > bestScore) {
      bestScore = score
      bestRecipe = recipe
    }
  }

  return bestScore > 0 ? bestRecipe : null
}
