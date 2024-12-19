import chalk from 'chalk'
import { Box, Text, useApp, useInput } from 'ink'
import { MiniCard, useDeck } from 'ink-playing-cards'
import { DeckProvider } from 'ink-playing-cards/dist/contexts/DeckContext.js'
import type { TCard, TCardValue, TSuit } from 'ink-playing-cards/dist/types'
import React, { useEffect, useState } from 'react'

type GameState = 'betting' | 'playing' | 'dealerTurn' | 'gameOver'

const BlackjackGame = () => {
  const { exit } = useApp()
  const { deck, shuffle } = useDeck()
  const [playerHand, setPlayerHand] = useState<TCard[]>([])
  const [dealerHand, setDealerHand] = useState<TCard[]>([])
  const [gameState, setGameState] = useState<GameState>('betting')
  const [playerScore, setPlayerScore] = useState(0)
  const [dealerScore, setDealerScore] = useState(0)
  const [message, setMessage] = useState('')

  const calculateScore = (hand: TCard[]) => {
    let score = 0
    let aceCount = 0

    for (const card of hand) {
      const cardProps = card as { value: TCardValue }
      if (cardProps.value === 'A') {
        aceCount++
      } else if (['J', 'Q', 'K'].includes(cardProps.value)) {
        score += 10
      } else if (cardProps.value !== 'JOKER') {
        score += parseInt(cardProps.value)
      }
    }

    for (let i = 0; i < aceCount; i++) {
      if (score + 11 <= 21) {
        score += 11
      } else {
        score += 1
      }
    }

    return score
  }

  const updateScores = () => {
    setPlayerScore(calculateScore(playerHand))
    setDealerScore(calculateScore(dealerHand))
  }

  const startNewGame = () => {
    shuffle()
    const card1 = deck.drawCard()
    const card2 = deck.drawCard()
    const dealerCard1 = deck.drawCard()
    const dealerCard2 = deck.drawCard()
    if (card1 && card2 && dealerCard1 && dealerCard2) {
      setPlayerHand([card1, card2])
      setDealerHand([dealerCard1, dealerCard2])
      setGameState('playing')
      setMessage('')
    }
  }

  const hit = () => {
    if (gameState === 'playing') {
      const card = deck.drawCard()
      if (card) {
        const newHand = [...playerHand, card]
        setPlayerHand(newHand)
        if (calculateScore(newHand) > 21) {
          setGameState('gameOver')
          setMessage('Bust! You lose.')
        }
      }
    }
  }

  const dealerPlay = () => {
    let currentHand = [...dealerHand]
    let currentScore = calculateScore(currentHand)

    while (currentScore < 17) {
      const card = deck.drawCard()
      if (card) {
        currentHand.push(card)
        currentScore = calculateScore(currentHand)
      } else {
        break
      }
    }

    setDealerHand(currentHand)

    if (currentScore > 21) {
      setGameState('gameOver')
      setMessage('Dealer busts! You win!')
    } else if (currentScore >= playerScore) {
      setGameState('gameOver')
      setMessage('Dealer wins!')
    } else {
      setGameState('gameOver')
      setMessage('You win!')
    }
  }

  const stand = () => {
    if (gameState === 'playing') {
      setGameState('dealerTurn')
      dealerPlay()
    }
  }

  useEffect(() => {
    startNewGame()
  }, [])

  useEffect(() => {
    updateScores()
  }, [playerHand, dealerHand])

  useInput((input) => {
    if (gameState === 'playing') {
      if (input === 'h') {
        hit()
      } else if (input === 's') {
        stand()
      }
    } else if (gameState === 'gameOver') {
      if (input === 'n') {
        startNewGame()
      }
    }

    if (input === 'q') {
      exit()
    }
  })

  return (
    <Box flexDirection="column" gap={1}>
      <Text bold color="green">
        {chalk.bold('♠ ♥ ♣ ♦')} Blackjack {chalk.bold('♦ ♣ ♥ ♠')}
      </Text>
      <Box flexDirection="column">
        <Text>
          Dealer's Hand (Score:{' '}
          {gameState === 'playing'
            ? chalk.dim('?')
            : dealerScore > 21
            ? chalk.red(dealerScore)
            : chalk.green(dealerScore)}
          ):
        </Text>
        <Box flexDirection="row">
          {dealerHand.map((card, index) => (
            <MiniCard
              key={index}
              value={(card as { value: TCardValue }).value}
              suit={(card as { suit: TSuit }).suit}
              faceUp={gameState !== 'playing' || index === 0}
            />
          ))}
        </Box>
      </Box>
      <Box flexDirection="column">
        <Text>
          Your Hand (Score:{' '}
          {playerScore > 21
            ? chalk.red(playerScore)
            : playerScore === 21
            ? chalk.yellow(playerScore)
            : chalk.green(playerScore)}
          ):
        </Text>
        <Box flexDirection="row" gap={1}>
          {playerHand.map((card, index) => (
            <MiniCard
              key={index}
              value={(card as { value: TCardValue }).value}
              suit={(card as { suit: TSuit }).suit}
            />
          ))}
        </Box>
      </Box>
      <Text>
        {message &&
          (message.includes('win')
            ? chalk.green(message)
            : message.includes('lose')
            ? chalk.red(message)
            : chalk.yellow(message))}
      </Text>
      {gameState === 'playing' && (
        <Text>
          Press {chalk.yellow.bold('H')} to hit, {chalk.yellow.bold('S')} to
          stand{chalk.dim(`, or ${chalk.bold('Q')} to quit`)}
        </Text>
      )}
      {gameState === 'gameOver' && (
        <Text>Press {chalk.yellow.bold('N')} for a new game</Text>
      )}
    </Box>
  )
}

const createStandardDeck = (): TCard[] => {
  const suits: TSuit[] = ['hearts', 'diamonds', 'clubs', 'spades']
  const values: TCardValue[] = [
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    'J',
    'Q',
    'K',
    'A',
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
  const initialCards = createStandardDeck()

  return (
    <DeckProvider initialCards={initialCards}>
      <BlackjackGame />
    </DeckProvider>
  )
}

export default App
