import chalk from 'chalk'
import type { HandEvaluation } from './types.js'

type Mood = 'confident' | 'nervous' | 'excited' | 'disappointed' | 'smug' | 'thoughtful'

interface DealerThought {
  text: string
  mood: Mood
  emoji?: string
}

const EMOJIS = {
  confident: '😎',
  nervous: '😰',
  excited: '🤩',
  disappointed: '😩',
  smug: '😏',
  thoughtful: '🤔'
}

const getRandomElement = <T>(arr: T[]): T => {
  if (arr.length === 0) {
    throw new Error('Cannot get random element from empty array')
  }
  const index = Math.floor(Math.random() * arr.length)
  const element = arr[index]
  if (element === undefined) {
    throw new Error('Array element was undefined')
  }
  return element
}

export const getDealerThought = (
  situation: 'checking' | 'drawing' | 'bust' | 'blackjack' | 'good-hand' | 'bad-hand' | 'winning' | 'losing'
): DealerThought => {
  switch (situation) {
    case 'checking':
      return getRandomElement([
        { text: "Let's see what we've got here...", mood: 'thoughtful' },
        { text: "Hmm... interesting cards today", mood: 'thoughtful' },
        { text: "Just like they taught me in dealer school...", mood: 'confident' },
        { text: "*shuffles papers nervously*", mood: 'nervous' },
        { text: "I've got a good feeling about this hand!", mood: 'excited' }
      ])

    case 'drawing':
      return getRandomElement([
        { text: "Here goes nothing...", mood: 'nervous' },
        { text: "Watch this magic trick!", mood: 'excited' },
        { text: "Picking the perfect card...", mood: 'confident' },
        { text: "*drum roll please*", mood: 'excited' },
        { text: "Eeny, meeny, miny, mo...", mood: 'thoughtful' }
      ])

    case 'bust':
      return getRandomElement([
        { text: "Well, that's embarrassing...", mood: 'disappointed' },
        { text: "I meant to do that!", mood: 'nervous' },
        { text: "This deck must be rigged...", mood: 'disappointed' },
        { text: "*pretends nothing happened*", mood: 'nervous' },
        { text: "I'll get you next time!", mood: 'confident' }
      ])

    case 'blackjack':
      return getRandomElement([
        { text: "Like a boss! 😎", mood: 'smug' },
        { text: "All skill, no luck!", mood: 'confident' },
        { text: "I could do this in my sleep!", mood: 'smug' },
        { text: "*victory dance*", mood: 'excited' },
        { text: "Did you see that?!", mood: 'excited' }
      ])

    case 'good-hand':
      return getRandomElement([
        { text: "Now we're talking!", mood: 'confident' },
        { text: "*tries to hide smile*", mood: 'smug' },
        { text: "The odds are ever in my favor", mood: 'confident' },
        { text: "Just how I planned it", mood: 'smug' },
        { text: "Watch and learn!", mood: 'confident' }
      ])

    case 'bad-hand':
      return getRandomElement([
        { text: "*sweats profusely*", mood: 'nervous' },
        { text: "This is fine. Everything is fine.", mood: 'nervous' },
        { text: "I've seen worse... probably", mood: 'thoughtful' },
        { text: "*checks job listings*", mood: 'disappointed' },
        { text: "Don't panic... DON'T PANIC!", mood: 'nervous' }
      ])

    case 'winning':
      return getRandomElement([
        { text: "Better luck next time!", mood: 'smug' },
        { text: "*does victory lap around table*", mood: 'excited' },
        { text: "All in a day's work", mood: 'confident' },
        { text: "The house always wins!", mood: 'smug' },
        { text: "Want to try double or nothing?", mood: 'confident' }
      ])

    case 'losing':
      return getRandomElement([
        { text: "This game is rigged... wait, I AM the house!", mood: 'disappointed' },
        { text: "*calls in sick for tomorrow*", mood: 'disappointed' },
        { text: "Best 2 out of 3?", mood: 'nervous' },
        { text: "I let you win... totally meant to do that", mood: 'nervous' },
        { text: "My cat ate my lucky cards", mood: 'disappointed' }
      ])

    default:
      return { text: "...", mood: 'thoughtful' }
  }
}

export const formatDealerThought = (thought: DealerThought): string => {
  const emoji = EMOJIS[thought.mood]
  const moodColor = {
    confident: chalk.green,
    nervous: chalk.yellow,
    excited: chalk.magenta,
    disappointed: chalk.red,
    smug: chalk.cyan,
    thoughtful: chalk.blue
  }[thought.mood]

  return `${emoji} ${moodColor(thought.text)}`
}

export const getHandComment = (evaluation: HandEvaluation): DealerThought => {
  if (evaluation.isBlackjack) {
    return getDealerThought('blackjack')
  }

  if (evaluation.score > 21) {
    return getDealerThought('bust')
  }

  if (evaluation.score >= 19) {
    return getDealerThought('good-hand')
  }

  if (evaluation.score <= 16) {
    return getDealerThought('bad-hand')
  }

  return getDealerThought('checking')
}