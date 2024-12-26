import type { TCard } from 'ink-playing-cards/dist/types'
import { evaluateHand } from './handEvaluation.js'
import type { HandEvaluation } from './types.js'

export interface DealerDecision {
  action: 'hit' | 'stand'
  reason: string
  confidence: 'certain' | 'likely' | 'unsure'
}

export class DealerAI {
  private hand: TCard[]
  public readonly evaluation: HandEvaluation
  private readonly SOFT_17_HIT = true // Casino rule: hit on soft 17

  constructor(hand: TCard[]) {
    this.hand = hand
    this.evaluation = evaluateHand(hand)
  }

  public getUpcard(): TCard | undefined {
    return this.hand[0]
  }

  public isShowingAce(): boolean {
    const upcard = this.getUpcard()
    return (upcard as { value: string }).value === 'A'
  }

  public shouldHit(): DealerDecision {
    const { score, isSoft, possibleScores } = this.evaluation

    // Blackjack - always stand
    if (this.evaluation.isBlackjack) {
      return {
        action: 'stand',
        reason: 'Dealer has Blackjack',
        confidence: 'certain'
      }
    }

    // Bust - always stand (though this shouldn't happen in practice)
    if (Math.min(...possibleScores) > 21) {
      return {
        action: 'stand',
        reason: 'Dealer is bust',
        confidence: 'certain'
      }
    }

    // Soft hands
    if (isSoft) {
      if (score === 17 && this.SOFT_17_HIT) {
        return {
          action: 'hit',
          reason: 'Dealer must hit on soft 17',
          confidence: 'certain'
        }
      }
      
      if (score === 18 && this.hand.length === 2) {
        return {
          action: 'stand',
          reason: 'Dealer stands on soft 18',
          confidence: 'likely'
        }
      }

      if (score >= 19) {
        return {
          action: 'stand',
          reason: `Strong soft hand: ${score}`,
          confidence: 'certain'
        }
      }

      return {
        action: 'hit',
        reason: `Dealer hits on soft ${score}`,
        confidence: 'likely'
      }
    }

    // Hard hands
    if (score >= 17) {
      return {
        action: 'stand',
        reason: `Dealer stands on hard ${score}`,
        confidence: 'certain'
      }
    }

    if (score <= 16) {
      const confidence = score <= 14 ? 'certain' : 'likely'
      return {
        action: 'hit',
        reason: `Dealer must hit on ${score}`,
        confidence
      }
    }

    // Shouldn't reach here, but just in case
    return {
      action: 'hit',
      reason: 'Dealer follows basic strategy',
      confidence: 'unsure'
    }
  }

  public getHandDescription(): string {
    const { score, isSoft, isBlackjack, possibleScores } = this.evaluation
    
    if (isBlackjack) {
      return 'Blackjack'
    }
    
    if (isSoft && possibleScores.length > 1) {
      return `Soft ${score} (or ${possibleScores.filter((s: number) => s !== score).join(', ')})`
    }
    
    return `${isSoft ? 'Soft' : 'Hard'} ${score}`
  }

  public getHandStrength(): string {
    const { score, isSoft, isBlackjack } = this.evaluation

    if (isBlackjack) return 'Unbeatable'
    if (score > 21) return 'Bust'
    if (score === 21) return 'Very Strong'
    if (score >= 19) return 'Strong'
    if (score === 18) return isSoft ? 'Decent' : 'Good'
    if (score === 17) return isSoft ? 'Risky' : 'Marginal'
    if (score >= 13) return 'Weak'
    return 'Very Weak'
  }
}