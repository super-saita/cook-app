import { useState } from 'react'
import { IngredientForm } from './components/IngredientForm'
import { RecipeResult } from './components/RecipeResult'
import { getRecipeSuggestions } from './lib/recipeEngine'
import type { Recipe } from './types/recipe'
import './App.css'

type Screen = 'input' | 'result'

function App() {
  const [screen, setScreen] = useState<Screen>('input')
  const [inputText, setInputText] = useState('')
  const [recipes, setRecipes] = useState<Recipe[]>([])

  const handleSubmit = (text: string) => {
    setInputText(text)
    setRecipes(getRecipeSuggestions(text))
    setScreen('result')
  }

  const handleBack = () => {
    setScreen('input')
  }

  return (
    <main className="app-container">
      {screen === 'input' ? (
        <IngredientForm onSubmit={handleSubmit} />
      ) : (
        <RecipeResult recipes={recipes} inputText={inputText} onBack={handleBack} />
      )}
    </main>
  )
}

export default App
