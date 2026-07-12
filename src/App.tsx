import { useState } from 'react'
import { IngredientForm } from './components/IngredientForm'
import { RecipeResult } from './components/RecipeResult'
import { matchRecipe } from './lib/matchRecipe'
import type { Recipe } from './types/recipe'
import './App.css'

type Screen = 'input' | 'result'

function App() {
  const [screen, setScreen] = useState<Screen>('input')
  const [inputText, setInputText] = useState('')
  const [recipe, setRecipe] = useState<Recipe | null>(null)

  const handleSubmit = (text: string) => {
    setInputText(text)
    setRecipe(matchRecipe(text))
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
        <RecipeResult recipe={recipe} inputText={inputText} onBack={handleBack} />
      )}
    </main>
  )
}

export default App
