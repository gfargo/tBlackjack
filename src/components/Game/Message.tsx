import React, { useEffect, useState } from 'react'
import { Box, Text } from 'ink'
import chalk from 'chalk'
import type { GameStatus } from '../../utils/types.js'

interface MessageProps {
  status: GameStatus
}

const getMessageColor = (type: GameStatus['type']) => {
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

const Message: React.FC<MessageProps> = ({ status }) => {
  const [visible, setVisible] = useState(true)
  
  useEffect(() => {
    setVisible(true)
    
    if (status.duration) {
      const timer = setTimeout(() => {
        setVisible(false)
      }, status.duration)
      
      return () => clearTimeout(timer)
    }
    return undefined
  }, [status])

  const colorFn = getMessageColor(status.type)

  return (
    <Box 
      borderStyle="round" 
      paddingX={1}
      minHeight={3}
      alignItems="center"
      justifyContent="center"
    >
      {visible && status.message ? (
        <Text>
          {colorFn(status.message)}
          {status.details && (
            <Text dimColor> • {status.details}</Text>
          )}
        </Text>
      ) : (
        <Text> </Text>
      )}
    </Box>
  )
}

export default Message