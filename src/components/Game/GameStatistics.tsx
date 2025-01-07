import chalk from 'chalk'
import { Box, Text } from 'ink'
import React from 'react'
import type { GameStatistics } from '../../utils/types.js'

interface GameStatisticsProps {
  statistics: GameStatistics
  isVisible: boolean
}

const formatPercentage = (value: number, total: number): string => {
  if (total === 0) return '0%'
  return `${Math.round((value / total) * 100)}%`
}

const formatAverage = (value: number): string => {
  return value.toFixed(1)
}

const GameStatisticsDisplay: React.FC<GameStatisticsProps> = ({
  statistics,
  isVisible,
}) => {
  return (
    <Box flexDirection="column" gap={1} marginTop={1}>
      {isVisible && (
        <Box flexDirection="column" gap={1}>
          <Box>
            <Text dimColor>
              Hands: {chalk.blue(statistics.handsPlayed)} • Win Rate:{' '}
              {chalk.green(
                formatPercentage(statistics.wins, statistics.handsPlayed)
              )}{' '}
              • Avg Hand:{' '}
              {chalk.blue(formatAverage(statistics.averageHandValue))} • Best:{' '}
              {chalk.yellow(statistics.bestHand)}
            </Text>
          </Box>
          <Box>
            <Text dimColor>
              Blackjacks:{' '}
              {chalk.yellow(
                formatPercentage(statistics.blackjacks, statistics.handsPlayed)
              )}{' '}
              • Busts:{' '}
              {chalk.red(
                formatPercentage(statistics.busts, statistics.handsPlayed)
              )}{' '}
              • Double Downs:{' '}
              {chalk.magenta(
                formatPercentage(statistics.doubleDowns, statistics.handsPlayed)
              )}
            </Text>
          </Box>
        </Box>
      )}
      <Text dimColor>Press {chalk.bold('TAB')} to toggle statistics</Text>
    </Box>
  )
}

export default GameStatisticsDisplay
