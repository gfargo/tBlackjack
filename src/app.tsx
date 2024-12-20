import { DeckProvider } from 'ink-playing-cards/dist/contexts/DeckContext.js'
import type { TCard, TCardValue, TSuit } from 'ink-playing-cards/dist/types'
import React, { useState } from 'react'
import Game from './components/Game/Game.js'
import Welcome from './components/Screens/Welcome.js'

const createStandardDeck = (): TCard[] => {
  const suits: TSuit[] = ['hearts', 'diamonds', 'clubs', 'spades']
  const values: TCardValue[] = [
    '2', '3', '4', '5', '6', '7', '8', '9', '10',
    'J', 'Q', 'K', 'A'
  ]
  const deck: TCard[] = []

  for (const suit of suits) {
    for (const value of values) {
      deck.push({ suit, value })
    }
  }

  return deck
}

const App = () => {
  const [screen, setScreen] = useState<'welcome' | 'game'>('welcome')
  const [showHelp, setShowHelp] = useState(false)
  const initialCards = createStandardDeck()

  const handleStartGame = () => {
    setScreen('game')
  }

  const handleToggleHelp = () => {
    setShowHelp(!showHelp)
  }

  return (
    <DeckProvider initialCards={initialCards}>
      {screen === 'welcome' ? (
        <Welcome
          onStartGame={handleStartGame}
          showHelp={showHelp}
          onToggleHelp={handleToggleHelp}
        />
      ) : (
        <Game />
      )}
    </DeckProvider>
  )
}

export default App