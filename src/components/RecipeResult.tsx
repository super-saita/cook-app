import { useState } from 'react'
import type { Recipe, SavedRecipe } from '../types/recipe'

const STORAGE_KEY = 'cook-app.savedRecipes'

interface RecipeResultProps {
  recipes: Recipe[]
  inputText: string
  onBack: () => void
}

interface RecipeCardProps {
  recipe: Recipe
  inputText: string
}

function RecipeCard({ recipe, inputText }: RecipeCardProps) {
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
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
    <article className="recipe-card">
      <div className="recipe-photo" aria-hidden="true">
        <span>{recipe.emoji}</span>
      </div>
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
    </article>
  )
}

export function RecipeResult({ recipes, inputText, onBack }: RecipeResultProps) {
  return (
    <div className="recipe-result">
      {recipes.length > 0 ? (
        <>
          <p className="suggestion-count">{recipes.length}件のレシピを提案します</p>
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} inputText={inputText} />
          ))}
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
