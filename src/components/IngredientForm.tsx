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

      <label className="style-select-label" htmlFor="style-select">
        作りたい料理のスタイル
      </label>
      <div className="style-select-wrapper">
        <select
          id="style-select"
          className="style-select"
          value={selectedStyle ?? ''}
          onChange={(e) => setSelectedStyle((e.target.value || null) as StyleKey | null)}
        >
          <option value="">🎲 おまかせ</option>
          {STYLE_LIST.map((style) => (
            <option key={style.key} value={style.key}>
              {style.emoji} {style.label}
            </option>
          ))}
        </select>
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
