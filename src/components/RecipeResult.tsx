import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabaseClient'
import type { Recipe } from '../types/recipe'

interface RecipeResultProps {
  recipes: Recipe[]
  inputText: string
  onBack: () => void
  onRequireAuth: () => void
}

interface RecipeCardProps {
  recipe: Recipe
  inputText: string
  onRequireAuth: () => void
}

function RecipeCard({ recipe, inputText, onRequireAuth }: RecipeCardProps) {
  const { user } = useAuth()
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSave = async () => {
    if (!user) {
      onRequireAuth()
      return
    }

    setSaving(true)
    setError(null)

    const { error: insertError } = await supabase.from('saved_recipes').insert({
      user_id: user.id,
      recipe_id: recipe.id,
      title: recipe.title,
      servings: recipe.servings,
      ingredients: recipe.ingredients,
      extra_items: recipe.extraItems,
      steps: recipe.steps,
      emoji: recipe.emoji,
      input_text: inputText,
    })

    setSaving(false)

    if (insertError) {
      setError('保存に失敗しました。時間をおいて再度お試しください。')
      return
    }

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
      {error && <p className="modal-error">{error}</p>}
      <button
        type="button"
        className="primary-button"
        onClick={handleSave}
        disabled={saved || saving}
      >
        {saved ? '保存しました' : saving ? '保存中…' : '保存する'}
      </button>
    </article>
  )
}

export function RecipeResult({ recipes, inputText, onBack, onRequireAuth }: RecipeResultProps) {
  return (
    <div className="recipe-result">
      {recipes.length > 0 ? (
        <>
          <p className="suggestion-count">{recipes.length}件のレシピを提案します</p>
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              inputText={inputText}
              onRequireAuth={onRequireAuth}
            />
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
