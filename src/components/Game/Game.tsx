import chalk from 'chalk'
import { Box, Text, useInput } from 'ink'
import { useDeck } from 'ink-playing-cards'
import type { TCard } from 'ink-playing-cards/dist/types'
import React, { useEffect, useState } from 'react'
import GameControls from './GameControls.js'
import Hand from './Hand.js'
import Message from './Message.js'

type GamePhase = 'playing' | 'dealerTurn' | 'gameOver'

const Game: React.FC = () => {
  const { 
    deck, 
    // TODO: Fix bugged shuffle command (?) in `ink-playing-cards`
    // shuffle
   } = useDeck()
  const [playerHand, setPlayerHand] = useState<TCard[]>([])
  const [dealerHand, setDealerHand] = useState<TCard[]>([])
  const [gamePhase, setGamePhase] = useState<GamePhase>('playing')
  const [message, setMessage] = useState('')

  const calculateScore = (hand: TCard[]) => {
    let score = 0
    let aceCount = 0

    for (const card of hand) {
      const cardProps = card as { value: string }
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

  const startNewGame = () => {
    // TODO: implement `remainingCards` method in `ink-playing-cards`
    if (deck.cards.length < 4) {
      deck.shuffle()
    }

    const card1 = deck.drawCard()
    const card2 = deck.drawCard()
    const dealerCard1 = deck.drawCard()
    const dealerCard2 = deck.drawCard()

    if (card1 && card2 && dealerCard1 && dealerCard2) {
      setPlayerHand([card1, card2])
      setDealerHand([dealerCard1, dealerCard2])
      setGamePhase('playing')
      setMessage('')
    } else {
      setMessage('Error: Not enough cards to deal. Reshuffling...')
      deck.shuffle()
    }
  }

  const hit = () => {
    if (gamePhase !== 'playing') return

    let card = deck.drawCard()
    if (!card) {
      setMessage('Error: No cards remaining. Reshuffling...')
      deck.shuffle()
      card = deck.drawCard()

      console.log('deck.cards.length', deck.cards.length)
      console.log('card', { card })
    }

    if (!card) {
      setMessage('Error: No cards remaining after reshuffle. Game over.')
      setGamePhase('gameOver')
      return
    }

    const newHand = [...playerHand, card]
    setPlayerHand(newHand)

    const score = calculateScore(newHand)
    if (score > 21) {
      setGamePhase('gameOver')
      setMessage('Bust! You lose.')
    }
  }

  const dealerPlay = () => {
    let currentHand = [...dealerHand]
    let currentScore = calculateScore(currentHand)

    while (currentScore < 17) {
      let card = deck.drawCard()
      if (!card) {
        setMessage('Error: No cards remaining for dealer. Reshuffling...')
        deck.shuffle()
        card = deck.drawCard()
      }

      if (!card) {
        setMessage(
          'Error: No cards remaining for dealer after reshuffle. Game over.'
        )
        setGamePhase('gameOver')
        return
      }

      currentHand.push(card)
      currentScore = calculateScore(currentHand)
    }

    setDealerHand(currentHand)

    const playerScore = calculateScore(playerHand)
    if (currentScore > 21) {
      setMessage('Dealer busts! You win!')
    } else if (currentScore >= playerScore) {
      setMessage('Dealer wins!')
    } else {
      setMessage('You win!')
    }

    setGamePhase('gameOver')
  }

  const stand = () => {
    if (gamePhase === 'playing') {
      setGamePhase('dealerTurn')
      dealerPlay()
    }
  }

  useInput((input) => {
    if (gamePhase === 'playing') {
      if (input === 'h') {
        hit()
      } else if (input === 's') {
        stand()
      }
    } else if (gamePhase === 'gameOver' && input === 'n') {
      startNewGame()
    }
  })

  useEffect(() => {
    startNewGame()
  }, [])

  return (
    <Box flexDirection="column" gap={1}>
      <Text bold color="green">
        {chalk.bold('♠ ♥ ♣ ♦')} Blackjack {chalk.bold('♦ ♣ ♥ ♠')}
      </Text>

      <Hand
        cards={dealerHand}
        score={calculateScore(dealerHand)}
        isDealer
        hideScore={gamePhase === 'playing'}
        label="Dealer's Hand"
      />

      <Hand
        cards={playerHand}
        score={calculateScore(playerHand)}
        label="Your Hand"
      />

      <Message message={message} />

      <GameControls
        gamePhase={gamePhase === 'dealerTurn' ? 'gameOver' : gamePhase}
        remainingCards={deck.cards.length}
      />
    </Box>
  )
}

export default Game
