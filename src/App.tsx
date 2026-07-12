import { useEffect, useState } from 'react'
import { IngredientForm } from './components/IngredientForm'
import { RecipeResult } from './components/RecipeResult'
import { AuthModal } from './components/AuthModal'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { getRecipeSuggestions } from './lib/recipeEngine'
import type { StyleKey } from './lib/recipeEngine'
import type { Recipe } from './types/recipe'
import './App.css'

type Screen = 'input' | 'result'

function AppContent() {
  const { user, signOut } = useAuth()
  const [screen, setScreen] = useState<Screen>('input')
  const [inputText, setInputText] = useState('')
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [authModalOpen, setAuthModalOpen] = useState(false)

  // ブラウザ・端末の「戻る」操作をアプリ内の画面遷移として扱う。
  // これをしないと「戻る」を押した際にアプリの外（存在しないパス）に
  // 抜けてしまい、404が表示されてしまう。
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const state = event.state as { screen?: Screen } | null
      setScreen(state?.screen === 'result' ? 'result' : 'input')
    }
    window.history.replaceState({ screen: 'input' }, '')
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const handleSubmit = (text: string, style: StyleKey | null) => {
    setInputText(text)
    setRecipes(getRecipeSuggestions(text, style))
    setScreen('result')
    window.history.pushState({ screen: 'result' }, '')
  }

  const handleBack = () => {
    window.history.back()
  }

  return (
    <main className="app-container">
      <div className="account-bar">
        {user ? (
          <>
            <span className="account-email">{user.email}</span>
            <button type="button" className="account-link" onClick={() => signOut()}>
              ログアウト
            </button>
          </>
        ) : (
          <button type="button" className="account-link" onClick={() => setAuthModalOpen(true)}>
            ログイン
          </button>
        )}
      </div>

      {screen === 'input' ? (
        <IngredientForm onSubmit={handleSubmit} />
      ) : (
        <RecipeResult
          recipes={recipes}
          inputText={inputText}
          onBack={handleBack}
          onRequireAuth={() => setAuthModalOpen(true)}
        />
      )}

      {authModalOpen && <AuthModal onClose={() => setAuthModalOpen(false)} />}
    </main>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
