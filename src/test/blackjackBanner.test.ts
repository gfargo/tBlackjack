import test from 'ava'
import { BLACKJACK_BANNER } from '../components/Screens/blackjackBanner.js'

test('banner rows are all the same width', (t) => {
  const lines = BLACKJACK_BANNER.split('\n')
  const firstLength = lines[0]?.length ?? 0

  t.true(lines.length > 0)
  for (const line of lines) {
    t.is(line.length, firstLength)
  }
})
