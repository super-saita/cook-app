import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

interface AuthModalProps {
  onClose: () => void
}

type Mode = 'signIn' | 'signUp'

export function AuthModal({ onClose }: AuthModalProps) {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState<Mode>('signIn')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setInfo(null)
    setSubmitting(true)

    const result = mode === 'signIn' ? await signIn(email, password) : await signUp(email, password)

    setSubmitting(false)

    if (result.error) {
      setError(result.error)
      return
    }

    if (mode === 'signUp' && result.needsEmailConfirmation) {
      setInfo('確認メールを送信しました。メール内のリンクをクリックしてからログインしてください。')
      return
    }

    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close" onClick={onClose} aria-label="閉じる">
          ×
        </button>
        <h2>{mode === 'signIn' ? 'ログイン' : '新規登録'}</h2>
        <p className="modal-lead">
          レシピを保存すると、他の端末からも見られるようになります。
        </p>
        <form onSubmit={handleSubmit}>
          <label className="modal-field-label" htmlFor="auth-email">
            メールアドレス
          </label>
          <input
            id="auth-email"
            type="email"
            required
            className="modal-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <label className="modal-field-label" htmlFor="auth-password">
            パスワード
          </label>
          <input
            id="auth-password"
            type="password"
            required
            minLength={6}
            className="modal-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === 'signIn' ? 'current-password' : 'new-password'}
          />
          {error && <p className="modal-error">{error}</p>}
          {info && <p className="modal-info">{info}</p>}
          <button type="submit" className="primary-button" disabled={submitting}>
            {submitting ? '処理中…' : mode === 'signIn' ? 'ログイン' : '新規登録'}
          </button>
        </form>
        <button
          type="button"
          className="modal-switch"
          onClick={() => {
            setMode(mode === 'signIn' ? 'signUp' : 'signIn')
            setError(null)
            setInfo(null)
          }}
        >
          {mode === 'signIn' ? 'アカウントをお持ちでない方はこちら' : 'すでにアカウントをお持ちの方はこちら'}
        </button>
      </div>
    </div>
  )
}
