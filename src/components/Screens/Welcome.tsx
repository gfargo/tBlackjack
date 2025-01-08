import { Box, Text, useApp } from 'ink'
import BigText from 'ink-big-text'
import { EnhancedSelectInput } from 'ink-enhanced-select-input'
import Gradient from 'ink-gradient'
import React from 'react'
EnhancedSelectInput

interface WelcomeProps {
  onStartGame: () => void
  showHelp: boolean
  onToggleHelp: () => void
}

const GITHUB_DISCUSSION_URL =
  'https://github.com/gfargo/tBlackjack/discussions/3'

const Welcome: React.FC<WelcomeProps> = ({
  onStartGame,
  showHelp,
  onToggleHelp,
}) => {
  const { exit } = useApp()
  const [showMultiplayer, setShowMultiplayer] = React.useState(false)

  return (
    <Box
      flexDirection="column"
      alignItems="center"
      padding={1}
      // height={10}
      justifyContent="center"
    >
      <Box
        flexDirection="column"
        marginBottom={1}
        paddingX={3}
        borderDimColor
        borderStyle={{
          topLeft: '♦',
          top: '♦',
          topRight: '♥',
          left: '♣',
          bottomLeft: '♣',
          bottom: '♠',
          bottomRight: '♠',
          right: '♥',
        }}
      >
        {showHelp ? (
          <Box flexDirection="column" marginY={1} gap={1}>
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
        ) : showMultiplayer ? (
          <Box flexDirection="column" marginY={1} gap={1}>
            <Text bold>Multiplayer Mode</Text>
            <Text>
              Admittedly, I've got a pretty busy schedule but would love to find
              the time to add Multiplayer support.  Let me know if
              it's something you'd like to see by joining the discussion on
              GitHub:
            </Text>
            <Text color="blue" underline>
              {GITHUB_DISCUSSION_URL}
            </Text>
            <Text>
              Your feedback and suggestions will help shape the multiplayer
              experience! 💜
            </Text>
          </Box>
        ) : (
          <Gradient name="morning">
            <BigText text="Blackjack" />
          </Gradient>
        )}
      </Box>

      <Box flexDirection="column" marginBottom={1}>
        <EnhancedSelectInput
          // orientation="horizontal"
          // indicatorComponent={({ isSelected, item }) => (
          //   <Text bold color={isSelected ? 'red' : undefined}>
          //     { ` `}
          //   </Text>
          // )}
          items={[
            {
              label: 'Single Player',
              value: 's',
              indicator: '♠',
              hotkey: 's',
            },
            {
              label: 'Multiplayer',
              value: 'm',
              indicator: '♦',
              hotkey: 'm',
            },
            {
              label: showHelp ? 'Hide Help' : 'Toggle Help',
              value: 'h',
              indicator: '♥',
              hotkey: 'h',
            },
            {
              label: 'Quit',
              value: 'q',
              indicator: '♣',
              hotkey: 'q',
            },
          ]}
          onSelect={({ value }) => {
            if (value === 's') {
              onStartGame()
            } else if (value === 'm') {
              setShowMultiplayer(true)
            } else if (value === 'h') {
              onToggleHelp()
              setShowMultiplayer(false)
            } else if (value === 'q') {
              exit()
            }
          }}
        />
      </Box>
    </Box>
  )
}

export default Welcome
