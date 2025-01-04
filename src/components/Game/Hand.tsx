import chalk from 'chalk'
import { Box, Text } from 'ink'
import type { TCard, TCardValue, TSuit } from 'ink-playing-cards'
import { MiniCard } from 'ink-playing-cards'
import React from 'react'
import type { HandEvaluation } from '../../utils/types.js'

interface HandProps {
  cards: TCard[]
  evaluation: HandEvaluation
  isDealer?: boolean
  hideEvaluation?: boolean
  isActive?: boolean
  label: string
}

const Hand: React.FC<HandProps> = ({ 
  cards, 
  evaluation, 
  isDealer, 
  hideEvaluation, 
  isActive,
  label 
}) => {
  const { score, possibleScores, isBlackjack, isSoft, isPair } = evaluation
  
  const displayScore = hideEvaluation 
    ? '?' 
    : score > 21 
      ? chalk.red(score)
      : score === 21 
        ? chalk.yellow(score)
        : chalk.green(score)

  const getHandDetails = () => {
    if (hideEvaluation) return ''
    
    const details: string[] = []
    
    if (isBlackjack) {
      details.push(chalk.yellow('Blackjack!'))
    } else if (isSoft) {
      details.push(chalk.blue(`Soft ${score}`))
    }
    
    if (isPair) {
      details.push(chalk.magenta('Pair'))
    }
    
    if (possibleScores.length > 1) {
      details.push(chalk.dim(`(or ${possibleScores.filter((s: number) => s !== score).join(', ')})`))
    }
    
    return details.length ? ` ${details.join(' • ')}` : ''
  }

  return (
    <Box 
      flexDirection="column" 
      borderStyle={isActive ? 'round' : undefined}
      paddingX={isActive ? 1 : 0}
    >
      <Text>
        {label} (Score: {displayScore}){getHandDetails()}:
      </Text>
      <Box flexDirection="row" gap={1}>
        {cards.map((card, index) => (
          <MiniCard
            key={index}
            value={(card as { value: TCardValue }).value}
            suit={(card as { suit: TSuit }).suit}
            faceUp={!isDealer || !hideEvaluation || index === 0}
            // variant='micro'
          />
        ))}
      </Box>
    </Box>
  )
}

export default Hand