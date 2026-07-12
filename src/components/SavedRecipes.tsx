import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { RecipeIngredient } from '../types/recipe'

interface SavedRecipeRow {
  id: string
  recipe_id: string
  title: string
  servings: string
  ingredients: RecipeIngredient[]
  extra_items: string
  steps: string[]
  emoji: string
  input_text: string
  saved_at: string
}

interface SavedRecipesProps {
  onBack: () => void
}

export function SavedRecipes({ onBack }: SavedRecipesProps) {
  const [rows, setRows] = useState<SavedRecipeRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      const { data, error: fetchError } = await supabase
        .from('saved_recipes')
        .select('*')
        .order('saved_at', { ascending: false })

      if (cancelled) return

      if (fetchError) {
        setError('保存済みレシピの読み込みに失敗しました。')
      } else {
        setRows(data ?? [])
      }
      setLoading(false)
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    const { error: deleteError } = await supabase.from('saved_recipes').delete().eq('id', id)
    setDeletingId(null)
    if (!deleteError) {
      setRows((prev) => prev.filter((row) => row.id !== id))
    }
  }

  return (
    <div className="recipe-result">
      <h1 className="saved-heading">保存済みレシピ</h1>

      {loading && <p className="no-match">読み込み中…</p>}
      {error && <p className="no-match">{error}</p>}
      {!loading && !error && rows.length === 0 && (
        <p className="no-match">まだ保存したレシピがありません。</p>
      )}

      {rows.map((row) => (
        <article className="recipe-card" key={row.id}>
          <div className="recipe-photo" aria-hidden="true">
            <span>{row.emoji}</span>
          </div>
          <h2>{row.title}</h2>
          <p className="servings">{row.servings}</p>

          <h3>材料</h3>
          <ul className="ingredients">
            {row.ingredients.map((ingredient, i) => (
              <li key={i}>
                <span className="ingredient-name">{ingredient.name}</span>
                <span className="ingredient-amount">{ingredient.amount}</span>
              </li>
            ))}
          </ul>
          <p className="extra-items">追加で必要なもの：{row.extra_items}</p>

          <h3>作り方</h3>
          <ol className="steps">
            {row.steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>

          <button
            type="button"
            className="secondary-button"
            onClick={() => handleDelete(row.id)}
            disabled={deletingId === row.id}
          >
            {deletingId === row.id ? '削除中…' : 'このレシピを削除'}
          </button>
        </article>
      ))}

      <button type="button" className="secondary-button" onClick={onBack}>
        入力に戻る
      </button>
    </div>
  )
}
