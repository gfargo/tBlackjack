// Hardcoded ASCII art banner so the Welcome screen doesn't depend on
// ink-big-text -> cfonts, which reads font files from disk via fs/path and
// therefore can't run in browser environments (e.g. ink-canvas).
//
// The banner is assembled from a small fixed-width block font rather than
// typed out as raw multi-line strings, so every row is guaranteed to line
// up — a hand-typed banner is easy to get subtly misaligned (see #4).
const GLYPH_WIDTH = 4
const GLYPH_HEIGHT = 5

const FONT: Record<string, string[]> = {
  A: [' ██ ', '█  █', '████', '█  █', '█  █'],
  B: ['███ ', '█  █', '███ ', '█  █', '███ '],
  C: [' ███', '█   ', '█   ', '█   ', ' ███'],
  J: ['  ██', '   █', '   █', '█  █', ' ██ '],
  K: ['█  █', '█ █ ', '██  ', '█ █ ', '█  █'],
  L: ['█   ', '█   ', '█   ', '█   ', '████'],
}

for (const [letter, glyph] of Object.entries(FONT)) {
  if (
    glyph.length !== GLYPH_HEIGHT ||
    glyph.some((row) => row.length !== GLYPH_WIDTH)
  ) {
    throw new Error(
      `blackjackBanner: glyph "${letter}" is not ${GLYPH_WIDTH}x${GLYPH_HEIGHT}`
    )
  }
}

const WORD = 'BLACKJACK'
const LETTER_GAP = ' '

export const BLACKJACK_BANNER = Array.from({ length: GLYPH_HEIGHT })
  .map((_, row) =>
    [...WORD].map((letter) => FONT[letter]?.[row] ?? '').join(LETTER_GAP)
  )
  .join('\n')
