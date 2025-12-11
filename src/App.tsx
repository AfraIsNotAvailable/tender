import { useEffect, useState } from 'react'
import { AnimatePresence } from "motion/react"
import type { Tables } from './types/types'
import supabase from './utils/supabase'
import RecipeCard from './components/RecipeCard'

type Recipe = Tables<'recipes'>

function App() {

  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecipes = async () => {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')

      if (error) {
        console.error('Error fetching recipes: ', error)
      } else {
        setRecipes(data || [])
        console.log('Fetched data: ', data)
        setLoading(false)
      }
    }

    fetchRecipes()
  }, [])

  const handleSwipe = (direction: 'left' | 'right') => {
    console.log(`You swiped ${direction} on ${recipes[0].name}`)

    if (direction === 'right') {
      // TODO: Later we will save this as "Cooked Today"
    }

    setRecipes((current) => current.slice(1))
  }

  const visibleRecipes = recipes.slice(0, 3)

  if (loading) return <div className="flex h-screen items-center justify-center bg-gray-100">Loading...</div>

  if (recipes.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100 flex-col gap-4">
        <h2 className="text-xl font-bold text-gray-500">No more hungry?</h2>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-blue-500 text-white rounded-full font-bold shadow-lg"
        >
          Reset Deck
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-gray-100 overflow-hidden">
      {/* The Card Container */}
      <div className="relative w-full max-w-sm aspect-3/4 p-4">
        <AnimatePresence>
          {visibleRecipes.map((recipe, index) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              index={index}
              onSwipe={handleSwipe}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default App
