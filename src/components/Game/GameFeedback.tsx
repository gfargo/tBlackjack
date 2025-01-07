import chalk from 'chalk'
import { Box, Text } from 'ink'
import type { TCard } from 'ink-playing-cards/dist/types'
import React, { useEffect, useState } from 'react'
import { DealerAI } from '../../utils/dealerAI.js'
import type { GameStatus } from '../../utils/types.js'

interface GameFeedbackProps {
  hand: TCard[]
  isDealing?: boolean
  isThinking?: boolean
  status: GameStatus

}

const THINKING_DOTS = ['', '.', '..', '...']


const getStatusColor = (type: GameStatus['type']) => {
  switch (type) {
    case 'success':
      return chalk.green
    case 'error':
      return chalk.red
    case 'warning':
      return chalk.yellow
    default:
      return chalk.blue
  }
}

const GameFeedback: React.FC<GameFeedbackProps> = ({ 
  hand,
  isDealing,
  isThinking,
  status,
}) => {
  const [dots, setDots] = useState(0)
  const [showBubble, setShowBubble] = useState(true)

  useEffect(() => {
    if (isThinking) {
      const timer = setInterval(() => {
        setDots(d => (d + 1) % THINKING_DOTS.length)
      }, 500)
      return () => clearInterval(timer)
    }
    return undefined
  }, [isThinking])

  useEffect(() => {
    if (status.message) {
      // Blink effect when thought changes
      setShowBubble(false)
      const timer = setTimeout(() => setShowBubble(true), 100)
      return () => clearTimeout(timer)
    }
    return undefined
  }, [status.message])

  const dealer = hand.length > 0 ? new DealerAI(hand) : null
  const decision = dealer?.shouldHit()
  const upcard = dealer?.getUpcard()
  const upcardValue = upcard ? (upcard as { value: string }).value : ''


  const getThinkingIndicator = () => {
    if (!isThinking) return ''
    return chalk.dim(THINKING_DOTS[dots])
  }


  const getDealerContent = () => {
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
      // During thinking, keep the text color stable and only animate the dots
      return (
        <>
          <Text>
            {baseStyle(decision?.reason || 'Thinking')}
            {getThinkingIndicator()}
          </Text>
        </>
      )
    }

    if (dealer) {
      // For final states (bust, blackjack, etc.), we can use colored text
      const evaluation = dealer.evaluation
      if (evaluation.score > 21) {
        return <Text>{chalk.red('Bust!')}</Text>
      }
      
      if (evaluation.score === 21) {
        return <Text>{chalk.yellow('Blackjack!')}</Text>
      }

      return <Text>{baseStyle('Ready')}</Text>
    }

    return <Text dimColor>Waiting for dealer...</Text>
  }

  const getStatusContent = () => {
    if (!status.message) return null

    const colorFn = getStatusColor(status.type)
    return (
      <Text>
        {colorFn(status.message)}
        {status.details && (
          <Text dimColor> • {status.details}</Text>
        )}
      </Text>
    )
  }

  return (
    <Box 
      flexDirection="column" 
      borderStyle="round" 
      borderColor="gray" 
      paddingX={1}
      minHeight={3}
    >
      {showBubble ? (
        <>
          <Box flexDirection="column" gap={1}>
            {getDealerContent()}
            {getStatusContent()}
          </Box>
        </>
      ) : (
        <Text> </Text>
      )}
    </Box>
  )
}

export default GameFeedback