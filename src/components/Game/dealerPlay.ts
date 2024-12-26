import { DealerAI } from '../../utils/dealerAI.js'
import { evaluateHand } from '../../utils/handEvaluation.js'
import { DealerMessages } from '../../utils/dealerMessages.js'
import type { TCard } from 'ink-playing-cards/dist/types'


interface DealerPlayContext {
  updateGameState: (updates: any) => void
  drawCard: () => Promise<TCard | null>
  sleep: (ms: number) => Promise<void>
}

export const dealerPlay = async (
  initialHand: TCard[],
  context: DealerPlayContext
): Promise<void> => {
  const { updateGameState, drawCard, sleep } = context
  let currentHand = [...initialHand]
  let dealer = new DealerAI(currentHand)
  let decision = dealer.shouldHit()

  // Initial pause to build suspense
  updateGameState({
    status: { 
      message: DealerMessages.CHECKING_CARDS, 
      type: 'info' 
    },
    dealerHand: currentHand
  })
  await sleep(2000)

  while (decision.action === 'hit') {
    // Show dealer thinking about decision
    updateGameState({
      status: { 
        message: DealerMessages.CONSIDERING_MOVE,
        type: 'info',
        duration: 2000
      }
    })
    await sleep(2000)

    // Draw card with dramatic pause
    updateGameState({
      status: { 
        message: DealerMessages.DRAWING_CARD,
        type: 'info',
        duration: 2000
      }
    })
    await sleep(2000)

    const card = await drawCard()
    if (!card) return

    // Show the new card with a pause
    updateGameState({
      dealerHand: currentHand,
      status: {
        message: DealerMessages.REVEALING_CARD,
        type: 'info',
        duration: 1500
      }
    })
    await sleep(1500)

    // Add the card and update state
    currentHand = [...currentHand, card]
    dealer = new DealerAI(currentHand)
    decision = dealer.shouldHit()

    // Show updated hand status
    const evaluation = evaluateHand(currentHand)
    updateGameState({
      dealerHand: currentHand,
      status: {
        message: DealerMessages.getHandStatus(evaluation),
        type: 'info',
        duration: 2500
      }
    })
    await sleep(2500)
  }

  // Final decision pause
  const finalEvaluation = evaluateHand(currentHand)
  updateGameState({
    dealerHand: currentHand,
    status: {
      message: DealerMessages.getFinalStatus(finalEvaluation),
      type: 'info',
      duration: 2000
    }
  })
  await sleep(2000)

  // Evaluate final result
  updateGameState({
    dealerHand: currentHand,
    phase: 'evaluating'
  })

  await sleep(500)
}