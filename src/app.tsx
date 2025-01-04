import { createStandardDeck } from 'ink-playing-cards'
import { DeckProvider } from 'ink-playing-cards/dist/contexts/DeckContext.js'
import React, { useState } from 'react'
import Game from './components/Game/Game.js'
import Welcome from './components/Screens/Welcome.js'

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
