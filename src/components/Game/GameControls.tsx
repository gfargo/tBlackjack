import React from 'react'
import { Text } from 'ink'
import chalk from 'chalk'
import type { GamePhase, PlayerOptions } from '../../utils/types.js'

interface GameControlsProps {
  gamePhase: GamePhase
  remainingCards: number
  playerOptions?: PlayerOptions
}

const GameControls: React.FC<GameControlsProps> = ({ 
  gamePhase, 
  remainingCards,
  playerOptions 
}) => {
  const renderPlayerControls = () => {
    if (!playerOptions) return null

    const controls: string[] = []
    
    if (playerOptions.canHit) {
      controls.push(`${chalk.yellow.bold('H')} to hit`)
    }
    
    if (playerOptions.canStand) {
      controls.push(`${chalk.yellow.bold('S')} to stand`)
    }
    


    if (controls.length === 0) {
      return <Text>{playerOptions.reason || 'No actions available'}</Text>
    }

    return (
      <Text>
        Press {controls.join(', ')}
        {chalk.dim(` (${remainingCards} cards remaining)`)}
        {chalk.dim(`, or ${chalk.bold('Q')} to quit`)}
        {playerOptions.reason && (
          <Text>
            {'\n'}{chalk.dim(playerOptions.reason)}
          </Text>
        )}
      </Text>
    )
  }

  if (gamePhase === 'playerTurn') {
    return renderPlayerControls()
  }

  if (gamePhase === 'dealerTurn') {
    return (
      <Text>
        {chalk.dim('Dealer is playing...')}
        {chalk.dim(` (${remainingCards} cards remaining)`)}
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