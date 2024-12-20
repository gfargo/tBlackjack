import React from 'react'
import { Box, Text } from 'ink'
import { MiniCard } from 'ink-playing-cards'
import type { TCard, TCardValue, TSuit } from 'ink-playing-cards/dist/types'
import chalk from 'chalk'

interface HandProps {
  cards: TCard[]
  score: number
  isDealer?: boolean
  hideScore?: boolean
  label: string
}

const Hand: React.FC<HandProps> = ({ cards, score, isDealer, hideScore, label }) => {
  const displayScore = hideScore ? '?' : score > 21 
    ? chalk.red(score)
    : score === 21 
    ? chalk.yellow(score)
    : chalk.green(score)

  return (
    <Box flexDirection="column">
      <Text>
        {label} (Score: {displayScore}):
      </Text>
      <Box flexDirection="row" gap={1}>
        {cards.map((card, index) => (
          <MiniCard
            key={index}
            value={(card as { value: TCardValue }).value}
            suit={(card as { suit: TSuit }).suit}
            faceUp={!isDealer || !hideScore || index === 0}
          />
        ))}
      </Box>
    </Box>
  )
}

export default Hand