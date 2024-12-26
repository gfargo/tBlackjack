import React from 'react'
import { Box, Text } from 'ink'
import chalk from 'chalk'
import type { GameStatistics } from '../../utils/types.js'

interface GameStatisticsProps {
  stats: GameStatistics
  isVisible: boolean
}

const GameStatisticsDisplay: React.FC<GameStatisticsProps> = ({ stats, isVisible }) => {
  if (!isVisible) return null

  const formatPercentage = (value: number, total: number): string => {
    if (total === 0) return '0%'
    return `${Math.round((value / total) * 100)}%`
  }

  const formatAverage = (value: number): string => {
    return value.toFixed(1)
  }

  return (
    <Box 
      flexDirection="column" 
      borderStyle="round" 
      borderColor="gray"
      padding={1}
    >
      <Text bold>Game Statistics</Text>
      
      <Box flexDirection="row" justifyContent="space-between">
        <Box flexDirection="column" width="50%">
          <Text>
            Hands Played: {chalk.blue(stats.handsPlayed)}
          </Text>
          <Text>
            Win Rate: {chalk.green(formatPercentage(stats.wins, stats.handsPlayed))}
          </Text>
          <Text>
            Blackjacks: {chalk.yellow(formatPercentage(stats.blackjacks, stats.handsPlayed))}
          </Text>
          <Text>
            Bust Rate: {chalk.red(formatPercentage(stats.busts, stats.handsPlayed))}
          </Text>
        </Box>
        
        <Box flexDirection="column" width="50%">
          <Text>
            Average Hand: {chalk.blue(formatAverage(stats.averageHandValue))}
          </Text>
          <Text>
            Best Hand: {chalk.yellow(stats.bestHand)}
          </Text>
          <Text>
            Double Down Rate: {chalk.magenta(formatPercentage(stats.doubleDowns, stats.handsPlayed))}
          </Text>
          <Text>
            Double Down Success: {chalk.green(formatPercentage(stats.doubleDownWins, stats.doubleDowns))}
          </Text>
        </Box>
      </Box>

      <Box flexDirection="row" marginTop={1}>
        <Text dimColor>
          Press {chalk.bold('TAB')} to toggle statistics
        </Text>
      </Box>
    </Box>
  )
}

export default GameStatisticsDisplay