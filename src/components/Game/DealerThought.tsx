import React, { useEffect, useState } from 'react'
import { Box, Text } from 'ink'
import chalk from 'chalk'
import type { TCard } from 'ink-playing-cards/dist/types'
import { DealerAI } from '../../utils/dealerAI.js'


interface DealerThoughtProps {
  hand: TCard[]
  isDealing?: boolean
  isThinking?: boolean
  thoughtText?: string
}

const THINKING_DOTS = ['', '.', '..', '...']

const DealerThought: React.FC<DealerThoughtProps> = ({ 
  hand,
  isDealing,
  isThinking,
  thoughtText
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
    if (thoughtText) {
      // Blink effect when thought changes
      setShowBubble(false)
      const timer = setTimeout(() => setShowBubble(true), 100)
      return () => clearTimeout(timer)
    }
    return undefined
  }, [thoughtText])

  const dealer = hand.length > 0 ? new DealerAI(hand) : null
  const decision = dealer?.shouldHit()
  const upcard = dealer?.getUpcard()
  const upcardValue = upcard ? (upcard as { value: string }).value : ''



  const getThinkingIndicator = () => {
    if (!isThinking) return ''
    return chalk.dim(THINKING_DOTS[dots])
  }

  const getContent = () => {
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
            {baseStyle(thoughtText || decision?.reason || 'Thinking')}
            {getThinkingIndicator()}
          </Text>
          {decision?.reason && (
            <Text dimColor>
              {chalk.italic(decision.reason)}
            </Text>
          )}
        </>
      )
    }

    if (dealer) {
      // For final states (bust, blackjack, etc.), we can use colored text
      const evaluation = dealer.evaluation
      if (evaluation.score > 21) {
        return <Text>{chalk.red('Bust! ' + thoughtText)}</Text>
      }
      if (evaluation.score === 21) {
        return <Text>{chalk.yellow('Blackjack! ' + thoughtText)}</Text>
      }
      return <Text>{baseStyle(thoughtText || 'Ready')}</Text>
    }

    return <Text dimColor>Waiting for dealer...</Text>
  }

  return (
    <Box 
      flexDirection="column" 
      borderStyle="round" 
      borderColor="gray" 
      padding={1}
      marginX={2}
      minHeight={3}
    >
      {showBubble ? getContent() : <Text> </Text>}
    </Box>
  )
}

export default DealerThought