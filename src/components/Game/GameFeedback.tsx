import chalk from 'chalk'
import { Box, Text } from 'ink'
import React, { useEffect, useState } from 'react'
import type { GameStatus } from '../../utils/types.js'

interface GameFeedbackProps {
  status: GameStatus
}

const getStatusColor = (type: GameStatus['type']) => {
  switch (type) {
    case 'success':
      return chalk.green
    case 'error':
      return chalk.red
    case 'warning':
      return chalk.yellow
    default:
      return chalk.gray
  }
}

const GameFeedback: React.FC<GameFeedbackProps> = ({ status }) => {
  const [showBubble, setShowBubble] = useState(true)

  useEffect(() => {
    if (status.message) {
      // Blink effect when message changes
      setShowBubble(false)
      const timer = setTimeout(() => setShowBubble(true), 100)
      return () => clearTimeout(timer)
    }
    return undefined
  }, [status.message])

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
      borderStyle="single" 
      borderColor="gray" 
      borderTop={false}
      borderBottom={false}
      paddingX={1}
      minHeight={3}
      alignItems="center"
      justifyContent="center"
      width={"100%"}
    >
      {showBubble ? getStatusContent() : <Text> </Text>}
    </Box>
  )
}

export default GameFeedback