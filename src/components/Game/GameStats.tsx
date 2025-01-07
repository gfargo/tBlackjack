import chalk from 'chalk'
import { Box, Text } from 'ink'
import React from 'react'
import type { GamePhase } from '../../utils/types.js'

interface GameStatsProps {
  phase: GamePhase
  remainingCards: number
  isDoubleDown?: boolean
}

const GameStats: React.FC<GameStatsProps> = ({
  phase,
  remainingCards,
  isDoubleDown,
}) => {
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

  return (
    <Box
      flexDirection="row"
      justifyContent="space-between"
    >
      <Text>Phase: {getPhaseDisplay()}</Text>

      <Text bold color="green">
        {chalk.bold('♠ ♥ ♣ ♦')} Blackjack {chalk.bold('♦ ♣ ♥ ♠')}
      </Text>

      <Text>
        {isDoubleDown && chalk.magenta('Double Down Active •')}{' '}
        {chalk.dim(`${remainingCards} cards remaining`)}
      </Text>
    </Box>
  )
}

export default GameStats
