import type { TCard } from 'ink-playing-cards/dist/types'

export type GamePhase = 
  | 'dealing'      // Initial card deal animation
  | 'playerTurn'   // Player's turn to act
  | 'dealerTurn'   // Dealer's turn
  | 'evaluating'   // Determining winner
  | 'gameOver'     // Round complete

export type MessageType = 'success' | 'error' | 'info' | 'warning'

export type PlayerAction = 'hit' | 'stand' | 'none'

export interface HandEvaluation {
  score: number
  possibleScores: number[]
  isBlackjack: boolean
  isSoft: boolean
  isPair: boolean
  canSplit: boolean
}

export interface GameStatus {
  message: string
  details?: string
  type: MessageType
  duration?: number
}

export interface PlayerOptions {
  canHit: boolean
  canStand: boolean
  reason?: string
}

export interface GameStatistics {
  handsPlayed: number
  wins: number
  losses: number
  pushes: number
  blackjacks: number
  busts: number
  doubleDowns: number
  doubleDownWins: number
  averageHandValue: number
  totalHandValue: number
  bestHand: number
}

export interface GameState {
  phase: GamePhase
  playerHand: TCard[]
  dealerHand: TCard[]
  status: GameStatus
  lastAction?: PlayerAction
  isDoubleDown?: boolean
  handEvaluation: {
    player: HandEvaluation
    dealer: HandEvaluation
  }
  playerOptions: PlayerOptions
  statistics: GameStatistics
}