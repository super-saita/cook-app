import { useState } from 'react'
import type { Recipe, SavedRecipe } from '../types/recipe'

const STORAGE_KEY = 'cook-app.savedRecipes'

interface RecipeResultProps {
  recipe: Recipe | null
  inputText: string
  onBack: () => void
}

export function RecipeResult({ recipe, inputText, onBack }: RecipeResultProps) {
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    if (!recipe) return
    const existing: SavedRecipe[] = JSON.parse(
      localStorage.getItem(STORAGE_KEY) ?? '[]',
    )
    const newEntry: SavedRecipe = {
      ...recipe,
      inputText,
      savedAt: new Date().toISOString(),
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...existing, newEntry]))
    setSaved(true)
  }

  return (
    <div className="recipe-result">
      {recipe ? (
        <>
          <h2>{recipe.title}</h2>
          <p className="servings">{recipe.servings}</p>

          <h3>材料</h3>
          <ul className="ingredients">
            {recipe.ingredients.map((ingredient, i) => (
              <li key={i}>
                <span className="ingredient-name">{ingredient.name}</span>
                <span className="ingredient-amount">{ingredient.amount}</span>
              </li>
            ))}
          </ul>
          <p className="extra-items">追加で必要なもの：{recipe.extraItems}</p>

          <h3>作り方</h3>
          <ol className="steps">
            {recipe.steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
          <button
            type="button"
            className="primary-button"
            onClick={handleSave}
            disabled={saved}
          >
            {saved ? '保存しました' : '保存する'}
          </button>
        </>
      ) : (
        <p className="no-match">
          入力内容に合うレシピが見つかりませんでした。別の食材で試してみてください。
        </p>
      )}
      <button type="button" className="secondary-button" onClick={onBack}>
        入力に戻る
      </button>
    </div>
  )
}
