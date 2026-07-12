import { useState } from 'react'

interface IngredientFormProps {
  onSubmit: (text: string) => void
}

export function IngredientForm({ onSubmit }: IngredientFormProps) {
  const [text, setText] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    onSubmit(text)
  }

  return (
    <form className="ingredient-form" onSubmit={handleSubmit}>
      <div className="app-badge" aria-hidden="true">🍳</div>
      <h1>目指せ食品ロスと料理の達人</h1>
      <p className="lead">冷蔵庫に残っている食材を入力してください。</p>
      <textarea
        className="ingredient-input"
        placeholder="例：鶏胸肉ときゅうりが1本残っています。"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
      />
      <button type="submit" className="primary-button">
        レシピを探す
      </button>
    </form>
  )
}
