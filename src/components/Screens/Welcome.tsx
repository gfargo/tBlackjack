import chalk from 'chalk'
import { Box, Text, useApp, useInput } from 'ink'
import React from 'react'

interface WelcomeProps {
  onStartGame: () => void
  showHelp: boolean
  onToggleHelp: () => void
}

const Welcome: React.FC<WelcomeProps> = ({
  onStartGame,
  showHelp,
  onToggleHelp,
}) => {
  const { exit } = useApp()
  useInput((input) => {
    if (input === 's') {
      onStartGame()
    } else if (input === 'h') {
      onToggleHelp()
    } else if (input === 'q') {
      exit()
    }
  })

  return (
    <Box flexDirection="column" alignItems="center" padding={1}>
      <Text bold color="green">
        {chalk.bold('♠ ♥ ♣ ♦')} Welcome to Blackjack {chalk.bold('♦ ♣ ♥ ♠')}
      </Text>

      {showHelp ? (
        <Box flexDirection="column" marginTop={1} gap={1}>
          <Box flexDirection="column">
            <Text bold>How to Play:</Text>
            <Text>
              • Try to get as close to 21 as possible without going over
            </Text>
            <Text>• Face cards (J, Q, K) are worth 10</Text>
            <Text>• Aces are worth 1 or 11</Text>
            <Text>• Dealer must hit on 16 and stand on 17</Text>
          </Box>
          <Box flexDirection="column">
            <Text bold>Controls:</Text>
            <Text>• Press H to hit (get another card)</Text>
            <Text>• Press S to stand (end your turn)</Text>
            <Text>• Press Q to quit the game</Text>
            <Text>• Press N for a new game when round is over</Text>
          </Box>
        </Box>
      ) : (
        <Box flexDirection="column" marginTop={1}>
          <Text>Press {chalk.yellow.bold('S')} to start the game</Text>
          <Text>Press {chalk.yellow.bold('H')} to toggle help</Text>
          <Text>Press {chalk.yellow.bold('Q')} to quit</Text>
        </Box>
      )}
    </Box>
  )
}

export default Welcome
