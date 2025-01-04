import chalk from 'chalk'
import { Box, Text, useApp, useInput } from 'ink'
import { createStandardDeck, useDeck, Zones } from 'ink-playing-cards'
import type { TCard } from 'ink-playing-cards/dist/types'
import React, { useCallback, useEffect, useState } from 'react'
import { DealerMessages } from '../../utils/dealerMessages.js'
import { evaluateHand } from '../../utils/handEvaluation.js'
import type { GameState, GameStatistics } from '../../utils/types.js'
import { dealerPlay as playDealerTurn } from './dealerPlay.js'
import DealerThought from './DealerThought.js'
import GameControls from './GameControls.js'
import GameStatisticsDisplay from './GameStatistics.js'
import GameStats from './GameStats.js'
import Hand from './Hand.js'
import Message from './Message.js'

const DECK_RESHUFFLE_THRESHOLD = 0.25 // Reshuffle when 25% cards remain

const initialStatistics: GameStatistics = {
  handsPlayed: 0,
  wins: 0,
  losses: 0,
  pushes: 0,
  blackjacks: 0,
  busts: 0,
  doubleDowns: 0,
  doubleDownWins: 0,
  averageHandValue: 0,
  totalHandValue: 0,
  bestHand: 0,
}

const Game: React.FC = () => {
  const { deck, shuffle, reset, discardPile } = useDeck()
  const [showStats, setShowStats] = useState(false)
  const [gameState, setGameState] = useState<GameState>({
    phase: 'dealing',
    playerHand: [],
    dealerHand: [],
    status: { message: '', type: 'info' },
    handEvaluation: {
      player: {
        score: 0,
        possibleScores: [0],
        isBlackjack: false,
        isSoft: false,
        isPair: false,
        canSplit: false,
      },
      dealer: {
        score: 0,
        possibleScores: [0],
        isBlackjack: false,
        isSoft: false,
        isPair: false,
        canSplit: false,
      },
    },
    playerOptions: {
      canHit: false,
      canStand: false,
    },
    statistics: initialStatistics,
  })

  const updateStatistics = (
    current: GameState,
    updates: Partial<GameState>,
    gameOver: boolean
  ): GameStatistics => {
    const stats = { ...current.statistics }
    const playerEval =
      updates.handEvaluation?.player || current.handEvaluation.player
    const dealerEval =
      updates.handEvaluation?.dealer || current.handEvaluation.dealer

    // Update hand value statistics
    if (playerEval.score <= 21) {
      stats.totalHandValue += playerEval.score
      stats.averageHandValue = stats.totalHandValue / (stats.handsPlayed || 1)
      stats.bestHand = Math.max(stats.bestHand, playerEval.score)
    }

    // Update game outcome statistics
    if (gameOver) {
      stats.handsPlayed++

      if (playerEval.score > 21) {
        stats.busts++
        stats.losses++
      } else if (dealerEval.score > 21) {
        stats.wins++
        if (current.isDoubleDown) stats.doubleDownWins++
      } else if (playerEval.score > dealerEval.score) {
        stats.wins++
        if (current.isDoubleDown) stats.doubleDownWins++
      } else if (playerEval.score < dealerEval.score) {
        stats.losses++
      } else {
        stats.pushes++
      }

      if (playerEval.isBlackjack) {
        stats.blackjacks++
      }
    }

    // Update double down statistics
    if (updates.isDoubleDown) {
      stats.doubleDowns++
    }

    return stats
  }

  const updateGameState = (updates: Partial<GameState>) => {
    // console.log('discard pile currently', discardPile)

    setGameState((current) => {
      const newState = {
        ...current,
        ...updates,
        handEvaluation: {
          player: updates.playerHand
            ? evaluateHand(updates.playerHand)
            : current.handEvaluation.player,
          dealer: updates.dealerHand
            ? evaluateHand(updates.dealerHand)
            : current.handEvaluation.dealer,
        },
      }

      // Update player options if it's player's turn
      if (newState.phase === 'playerTurn') {
        const playerEval = newState.handEvaluation.player
        newState.playerOptions = {
          canHit: !playerEval.isBlackjack,
          canStand: true,
          reason: playerEval.isBlackjack ? 'Blackjack!' : undefined,
        }
      } else {
        newState.playerOptions = {
          canHit: false,
          canStand: false,
        }
      }

      // Update statistics
      const gameOver = updates.phase === 'gameOver'
      newState.statistics = updateStatistics(current, updates, gameOver)

      return newState
    })
  }

  const shuffleDeck = async () => {
    // Visual feedback before shuffle
    updateGameState({
      status: {
        message: '🔄 Shuffling deck...',
        type: 'info',
        details: `${deck.cards.length} cards remaining`,
      },
    })

    // Pause for visual effect
    await sleep(600)

    // Perform shuffle
    shuffle()

    // Confirmation message
    updateGameState({
      status: {
        message: '✨ Deck shuffled',
        type: 'info',
        duration: 1000,
      },
    })

    await sleep(1000)
  }

  const shouldReshuffle = () => {
    const remainingPercentage = deck.cards.length / 52
    const shouldShuffle = remainingPercentage <= DECK_RESHUFFLE_THRESHOLD

    if (shouldShuffle) {
      updateGameState({
        status: {
          message: '⚠️ Deck is low',
          type: 'warning',
          details: `${deck.cards.length} cards remaining`,
        },
      })
    }

    return shouldShuffle
  }

  const endRoundAndResetDeck = useCallback(() => {
    setGameState((current) => {
      reset(new Zones.Deck([...createStandardDeck()]))

      return {
        ...current,
        status: {
          type: 'error',
          message: 'Error: Not enough cards to deal',
        },
        playerHand: [],
        dealerHand: [],
      }
    })
  }, [gameState, discardPile, deck, reset])

  const startNewGame = useCallback(async () => {
    // Always shuffle at the start of a new game

    // need at least 4 cards to deal
    if (deck.cards.length >= 4) {
      const card1 = deck.drawCard()
      const card2 = deck.drawCard()
      const dealerCard1 = deck.drawCard()
      const dealerCard2 = deck.drawCard()

      if (card1 && card2 && dealerCard1 && dealerCard2) {
        const playerHand = [card1, card2]
        const dealerHand = [dealerCard1, dealerCard2]

        updateGameState({
          phase: 'playerTurn',
          playerHand,
          dealerHand,
          status: { message: '', type: 'info' },
        })

        // Check for blackjack
        const playerEval = evaluateHand(playerHand)
        const dealerEval = evaluateHand(dealerHand)

        if (playerEval.isBlackjack || dealerEval.isBlackjack) {
          handleBlackjack(playerEval.isBlackjack, dealerEval.isBlackjack)
        }
      }
    } else {
      // setStatus({
      //   message: 'Error: Not enough cards to deal',
      //   type: 'error',
      // })

      console.log('triggering reset, not enough cards to deal', {
        discardPile,
        deck,
      })

      endRoundAndResetDeck()

      // reset(new Zones.Deck([...createStandardDeck()]))
    }
  }, [deck])

  const handleBlackjack = (
    playerHasBlackjack: boolean,
    dealerHasBlackjack: boolean
  ) => {
    if (playerHasBlackjack && dealerHasBlackjack) {
      updateGameState({
        phase: 'gameOver',
        status: {
          message: 'Push! Both have Blackjack',
          type: 'warning',
        },
      })
    } else if (playerHasBlackjack) {
      updateGameState({
        phase: 'gameOver',
        status: {
          message: 'Blackjack! You win!',
          type: 'success',
        },
      })
    } else if (dealerHasBlackjack) {
      updateGameState({
        phase: 'gameOver',
        status: {
          message: 'Dealer has Blackjack! You lose',
          type: 'error',
        },
      })
    }
  }

  const drawCard = async () => {
    // Check if we need to shuffle before drawing
    if (shouldReshuffle()) {
      await shuffleDeck()
    }

    const card = deck.drawCard()
    if (!card) {
      updateGameState({
        status: {
          message: '❌ Error: No cards remaining',
          type: 'error',
        },
      })
      // await shuffleDeck()
      return null
    }
    return card
  }

  const hit = async () => {
    if (gameState.phase !== 'playerTurn' || !gameState.playerOptions.canHit)
      return

    const card = await drawCard()
    if (!card) return

    const newHand = [...gameState.playerHand, card] as TCard[]
    const evaluation = evaluateHand(newHand)

    updateGameState({
      playerHand: newHand,
      lastAction: 'hit',
    })

    if (evaluation.score > 21) {
      updateGameState({
        phase: 'gameOver',
        status: {
          message: '💥 Bust! You lose',
          type: 'error',
          details: `Total: ${evaluation.score}`,
        },
      })
    }
  }

  const sleep = (ms: number): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, ms))

  const dealerPlay = async () => {
    // Play out dealer's turn
    await playDealerTurn(gameState.dealerHand, {
      updateGameState,
      drawCard,
      sleep,
    })

    // Evaluate final result
    const dealerEval = evaluateHand(gameState.dealerHand)
    const playerEval = gameState.handEvaluation.player
    const isDoubleDown = gameState.isDoubleDown

    // Show final result
    if (dealerEval.score > 21) {
      updateGameState({
        phase: 'gameOver',
        status: {
          message: DealerMessages.getFinalStatus(dealerEval),
          type: 'success',
          details: `You win${isDoubleDown ? ' double!' : '!'}`,
        },
      })
    } else if (dealerEval.score >= playerEval.score) {
      updateGameState({
        phase: 'gameOver',
        status: {
          message: DealerMessages.getFinalStatus(dealerEval),
          type: 'error',
          details: `${dealerEval.score} beats ${playerEval.score}${
            isDoubleDown ? ' (Double Down)' : ''
          }`,
        },
      })
    } else {
      updateGameState({
        phase: 'gameOver',
        status: {
          message: DealerMessages.getFinalStatus(dealerEval),
          type: 'success',
          details: `Your ${playerEval.score} beats dealer's ${
            dealerEval.score
          }${isDoubleDown ? ' (Double Down!)' : ''}`,
        },
      })
    }
  }

  const stand = async () => {
    if (gameState.phase === 'playerTurn') {
      updateGameState({
        phase: 'dealerTurn',
        lastAction: 'stand',
        status: {
          message: "Dealer's turn...",
          type: 'info',
        },
      })
      await dealerPlay()
    }
  }

  const { exit } = useApp()

  useInput((input, key) => {
    const { phase, playerOptions } = gameState

    // Global controls that should work in any state
    if (input === 'q') {
      exit()
      return
    }

    if (key?.tab) {
      setShowStats(!showStats)
      return
    }

    if (phase === 'playerTurn') {
      if (input === 'h' && playerOptions.canHit) {
        void hit()
      } else if (input === 's' && playerOptions.canStand) {
        void stand()
      }
    } else if (phase === 'gameOver' && input === 'n') {
      void startNewGame()
    }
  })

  useEffect(() => {
    void startNewGame() // void is used to handle the async function in useEffect
  }, [])

  return (
    <Box flexDirection="column" gap={1} padding={1}>
      <Text bold color="green">
        {chalk.bold('♠ ♥ ♣ ♦')} Blackjack {chalk.bold('♦ ♣ ♥ ♠')}
      </Text>

      <GameStats
        phase={gameState.phase}
        remainingCards={deck.cards.length}
        isDoubleDown={gameState.isDoubleDown}
      />

      <Hand
        cards={gameState.dealerHand}
        evaluation={gameState.handEvaluation.dealer}
        isDealer
        hideEvaluation={gameState.phase === 'playerTurn'}
        label="Dealer's Hand"
      />

      <DealerThought
        hand={gameState.dealerHand}
        isDealing={gameState.phase === 'dealing'}
        isThinking={gameState.phase === 'dealerTurn'}
        thoughtText={gameState.status.message}
      />

      <Hand
        cards={gameState.playerHand}
        evaluation={gameState.handEvaluation.player}
        isActive={gameState.phase === 'playerTurn'}
        label="Your Hand"
      />

      <Message status={gameState.status} />

      <GameControls
        gamePhase={gameState.phase}
        remainingCards={deck.cards.length}
        playerOptions={gameState.playerOptions}
      />

      <GameStatisticsDisplay
        stats={gameState.statistics}
        isVisible={showStats}
      />
    </Box>
  )
}

export default Game
