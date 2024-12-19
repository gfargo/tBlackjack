import test from 'ava'
import { render } from 'ink-testing-library'
import React from 'react'
import App from '../app.js'

test('basic test', (t) => {
  const { lastFrame } = render(<App />)

  t.snapshot(lastFrame())
  t.true(lastFrame()?.includes('7'))
  t.true(lastFrame()?.includes('♣'))
})
