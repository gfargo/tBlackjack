import React from 'react'
import { Text } from 'ink'
import chalk from 'chalk'

interface MessageProps {
  message: string
}

const Message: React.FC<MessageProps> = ({ message }) => {
  if (!message) return null

  const coloredMessage = message.includes('win')
    ? chalk.green(message)
    : message.includes('lose') || message.includes('Bust')
    ? chalk.red(message)
    : chalk.yellow(message)

  return <Text>{coloredMessage}</Text>
}

export default Message