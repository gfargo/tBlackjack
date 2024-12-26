import type { TCard } from 'ink-playing-cards/dist/types'
import type { HandEvaluation } from './types.js'

export const evaluateHand = (hand: TCard[]): HandEvaluation => {
  const scores = calculatePossibleScores(hand)
  
  return {
    score: getBestScore(scores),
    possibleScores: scores,
    isBlackjack: isBlackjack(hand),
    isSoft: isSoftHand(hand),
    isPair: isPair(hand),
    canSplit: canSplitHand(hand)
  }
}

const calculatePossibleScores = (hand: TCard[]): number[] => {
  let scores = [0]
  let aceCount = 0

  for (const card of hand) {
    const cardProps = card as { value: string }
    if (cardProps.value === 'A') {
      aceCount++
    } else if (['J', 'Q', 'K'].includes(cardProps.value)) {
      scores = scores.map(score => score + 10)
    } else if (cardProps.value !== 'JOKER') {
      scores = scores.map(score => score + parseInt(cardProps.value))
    }
  }

  // Handle aces
  for (let i = 0; i < aceCount; i++) {
    const newScores: number[] = []
    scores.forEach(score => {
      newScores.push(score + 1)  // Ace as 1
      if (score + 11 <= 21) {
        newScores.push(score + 11)  // Ace as 11
      }
    })
    scores = [...new Set(newScores)]  // Remove duplicates
  }

  return scores.sort((a, b) => a - b)
}

const getBestScore = (scores: number[]): number => {
  const validScores = scores.filter(score => score <= 21)
  return validScores.length > 0 ? Math.max(...validScores) : Math.min(...scores)
}

const isBlackjack = (hand: TCard[]): boolean => {
  if (hand.length !== 2) return false
  
  const values = hand.map(card => (card as { value: string }).value)
  return (
    values.includes('A') &&
    values.some(value => ['10', 'J', 'Q', 'K'].includes(value))
  )
}

const isSoftHand = (hand: TCard[]): boolean => {
  const scores = calculatePossibleScores(hand)
  return scores.length > 1 && scores.some(score => score <= 21)
}

const isPair = (hand: TCard[]): boolean => {
  if (hand.length !== 2) return false
  const [card1, card2] = hand
  return (card1 as { value: string }).value === (card2 as { value: string }).value
}

const canSplitHand = (hand: TCard[]): boolean => {
  return isPair(hand)
}