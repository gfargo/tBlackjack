import chalk from 'chalk'
import { Box, Text } from 'ink'
import type { TCard } from 'ink-playing-cards/dist/types'
import React from 'react'
import { DealerAI } from '../../utils/dealerAI.js'
import type { GamePhase } from '../../utils/types.js'

interface GameStatsProps {
  phase: GamePhase
  remainingCards: number
  isDoubleDown?: boolean
  dealerHand: TCard[]
  isDealing?: boolean
  isThinking?: boolean
}

const THINKING_DOTS = ['', '.', '..', '...']

const GameStats: React.FC<GameStatsProps> = ({
  phase,
  remainingCards,
  isDoubleDown,
  dealerHand,
  isDealing,
  isThinking,
}) => {
  const [dots, setDots] = React.useState(0)

  React.useEffect(() => {
    if (isThinking) {
      const timer = setInterval(() => {
        setDots(d => (d + 1) % THINKING_DOTS.length)
      }, 500)
      return () => clearInterval(timer)
    }
    return undefined
  }, [isThinking])
  const getThinkingIndicator = () => {
    if (!isThinking) return ''
    return chalk.dim(THINKING_DOTS[dots])
  }

  const getDealerContent = () => {
    const dealer = dealerHand.length > 0 ? new DealerAI(dealerHand) : null
    const decision = dealer?.shouldHit()
    const upcard = dealer?.getUpcard()
    const upcardValue = upcard ? (upcard as { value: string }).value : ''

    // Base style for dealer messages
    const baseStyle = chalk.blue

    if (isDealing && dealer) {
      return (
        <Text>
          {baseStyle('Dealer showing: ')}{chalk.bold(upcardValue)}
        </Text>
      )
    }

    if (isThinking && dealer) {
      return (
        <Text>
          {baseStyle(decision?.reason || 'Thinking')}
          {getThinkingIndicator()}
        </Text>
      )
    }

    if (dealer) {
      const evaluation = dealer.evaluation
      if (evaluation.score > 21) {
        return <Text>{chalk.red('Dealer Bust!')}</Text>
      }
      if (evaluation.score === 21) {
        return <Text>{chalk.yellow('Dealer Blackjack!')}</Text>
      }
    }

    return null
  }

  const getPhaseDisplay = () => {
    switch (phase) {
      case 'dealing':
        return chalk.blue('Dealing cards...')
      case 'playerTurn':
        return chalk.green('Your turn')
      case 'dealerTurn':
        return chalk.yellow("Dealer's turn")
      case 'evaluating':
        return chalk.blue('Evaluating hands...')
      case 'gameOver':
        return chalk.gray('Game Over')
      default:
        return ''
    }
  }

  const dealerContent = getDealerContent()

  return (
    <Box
      flexDirection="row"
      justifyContent="space-between"
      marginBottom={1}
    >
      <Text>Phase: {getPhaseDisplay()}</Text>

      {dealerContent ? (
        dealerContent
      ) : (
        <Text bold color="green">
          {chalk.bold('♠ ♥ ♣ ♦')} Blackjack {chalk.bold('♦ ♣ ♥ ♠')}
        </Text>
      )}

      <Text>
        {isDoubleDown && chalk.magenta('Double Down Active •')}{' '}
        {chalk.dim(`${remainingCards} cards remaining`)}
      </Text>
    </Box>
  )
}

export default GameStats
