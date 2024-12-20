import React from 'react'
import { Text } from 'ink'
import chalk from 'chalk'

interface GameControlsProps {
  gamePhase: 'playing' | 'gameOver'
  remainingCards: number
}

const GameControls: React.FC<GameControlsProps> = ({ gamePhase, remainingCards }) => {
  if (gamePhase === 'playing') {
    return (
      <Text>
        Press {chalk.yellow.bold('H')} to hit, {chalk.yellow.bold('S')} to stand
        {chalk.dim(` (${remainingCards} cards remaining)`)}
        {chalk.dim(`, or ${chalk.bold('Q')} to quit`)}
      </Text>
    )
  }

  return (
    <Text>
      Press {chalk.yellow.bold('N')} for a new game
      {chalk.dim(` (${remainingCards} cards remaining)`)}
      {chalk.dim(`, or ${chalk.bold('Q')} to quit`)}
    </Text>
  )
}

export default GameControls