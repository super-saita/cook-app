import { useEffect, useRef, useState } from 'react'
import { STYLE_LIST } from '../lib/recipeEngine'
import type { StyleKey } from '../lib/recipeEngine'

interface IngredientFormProps {
  onSubmit: (text: string, style: StyleKey | null) => void
}

export function IngredientForm({ onSubmit }: IngredientFormProps) {
  const [text, setText] = useState('')
  const [selectedStyle, setSelectedStyle] = useState<StyleKey | null>(null)
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  const speechSupported =
    typeof window !== 'undefined' && !!(window.SpeechRecognition || window.webkitSpeechRecognition)

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop()
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    onSubmit(text, selectedStyle)
  }

  const handleMicClick = () => {
    if (isListening) {
      recognitionRef.current?.stop()
      return
    }

    const SpeechRecognitionCtor = window.SpeechRecognition ?? window.webkitSpeechRecognition
    if (!SpeechRecognitionCtor) return

    const recognition = new SpeechRecognitionCtor()
    recognition.lang = 'ja-JP'
    recognition.interimResults = false
    recognition.continuous = false

    recognition.onresult = (event) => {
      let transcript = ''
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript
      }
      setText((prev) => (prev ? `${prev}${transcript}` : transcript))
    }
    recognition.onerror = () => setIsListening(false)
    recognition.onend = () => setIsListening(false)

    recognitionRef.current = recognition
    recognition.start()
    setIsListening(true)
  }

  return (
    <form className="ingredient-form" onSubmit={handleSubmit}>
      <div className="app-badge" aria-hidden="true">🍳</div>
      <h1>目指せ食品ロスと料理の達人</h1>
      <p className="lead">冷蔵庫に残っている食材を入力してください。</p>

      <div className="style-tabs" role="tablist" aria-label="作りたい料理のスタイル">
        <button
          type="button"
          role="tab"
          aria-selected={selectedStyle === null}
          className={`style-tab${selectedStyle === null ? ' selected' : ''}`}
          onClick={() => setSelectedStyle(null)}
        >
          🎲 おまかせ
        </button>
        {STYLE_LIST.map((style) => (
          <button
            type="button"
            role="tab"
            aria-selected={selectedStyle === style.key}
            key={style.key}
            className={`style-tab${selectedStyle === style.key ? ' selected' : ''}`}
            onClick={() => setSelectedStyle(style.key)}
          >
            {style.emoji} {style.label}
          </button>
        ))}
      </div>

      <div className="input-wrapper">
        <textarea
          className="ingredient-input"
          placeholder="例：鶏胸肉ときゅうりが1本残っています。"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
        />
        {speechSupported && (
          <button
            type="button"
            className={`mic-button${isListening ? ' listening' : ''}`}
            onClick={handleMicClick}
            aria-label={isListening ? '音声入力を停止' : '音声入力を開始'}
            title={isListening ? '音声入力を停止' : '音声入力を開始'}
          >
            🎤
          </button>
        )}
      </div>

      <button type="submit" className="primary-button">
        レシピを探す
      </button>
    </form>
  )
}
