import type { HandEvaluation } from './types.js'

export const DealerMessages = {
  // Action messages (blue)
  CHECKING_CARDS: 'Checking cards',
  CONSIDERING_MOVE: 'Considering next move',
  DRAWING_CARD: 'Drawing next card',
  REVEALING_CARD: 'Revealing card',
  
  // Result messages (colored appropriately by the component)
  getHandStatus: (evaluation: HandEvaluation): string => {
    if (evaluation.score > 21) return 'Bust!'
    if (evaluation.score === 21) return 'Blackjack!'
    if (evaluation.isSoft) return `Soft ${evaluation.score}`
    return `Shows ${evaluation.score}`
  },

  getFinalStatus: (evaluation: HandEvaluation): string => {
    if (evaluation.score > 21) return 'Dealer busts'
    if (evaluation.score === 21) return 'Dealer has Blackjack'
    if (evaluation.isSoft) return `Dealer stands on soft ${evaluation.score}`
    return `Dealer stands on ${evaluation.score}`
  }
}