# tBlackjack 🎲

[![npm version](https://badge.fury.io/js/tblackjack.svg)](https://badge.fury.io/js/tblackjack)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A terminal-based Blackjack game built with [Ink](https://github.com/vadimdemedes/ink) and ♠️ [ink-playing-cards](https://github.com/gfargo/ink-playing-cards/) ♥️ 

![tBlackjack Demo](https://raw.githubusercontent.com/gfargo/tblackjack/main/assets/demo.gif)

## Features 🎯

### Core Gameplay

- 🎲 Standard Blackjack rules with dealer hit on soft 17
- 🎨 Beautiful terminal UI using React Ink
- 🃏 Realistic playing card rendering
- ⚡️ Fast and responsive gameplay

### Interactive Experience

- 🤖 Animated dealer AI with personality
- 💭 Real-time dealer thought process
- 🎮 Intuitive keyboard controls
- 📊 Real-time game statistics
- 🔄 Smart deck management with shuffle animations

### Game Features

- 📈 Session statistics tracking
- 🎯 Hand evaluation and scoring
- 📖 Built-in help and instructions
- 🎨 Color-coded messages and status updates

## Installation 💻

Play instantly with npx

```bash
npx tblackjack
```

Or install globally

```bash
npm install -g tblackjack
```

## How to Play 🎮

1. Start the game:

   ```bash
   tblackjack
   ```

2. Controls:
   - `S` - Stand (end your turn)
   - `H` - Hit (draw a card)

   - `N` - New game (after round ends)
   - `TAB` - Toggle statistics
   - `Q` - Quit game

   During welcome screen:
   - `S` - Start game
   - `H` - Toggle help
   - `Q` - Quit game

## Game Rules 📋

### Card Values

- Number cards (2-10) are worth their face value
- Face cards (J, Q, K) are worth 10
- Aces are worth 1 or 11 (automatically optimized)

### Gameplay

- Try to get as close to 21 as possible without going over
- Dealer must hit on soft 17 (Ace counted as 11)
- Dealer must stand on hard 17 or higher
- Blackjack (Ace + 10-value card) beats regular 21

### Actions

- **Hit**: Draw another card
- **Stand**: End your turn

### Winning

- Beat the dealer's hand without going over 21
- Win automatically if dealer busts (goes over 21)
- Push (tie) if your score equals dealer's
- Lose if you bust or dealer has higher score

## Development 🛠️

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/gfargo/tblackjack.git
   cd tblackjack
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start development mode:

   ```bash
   npm run dev
   ```

### Building

```bash
npm run build
```

### Testing

```bash
npm test
```

## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments 🙏

- Built with [Ink](https://github.com/vadimdemedes/ink)
- Card rendering powered by [ink-playing-cards](https://github.com/gfargo/ink-playing-cards)
- Inspired by classic terminal games

## Support 💖

If you find this project helpful, please consider giving it a ⭐️ on GitHub!

<!-- 
## Roadmap 🗺️

### Phase 1: Enhanced Gameplay

- [ ] Betting system with chip management
- [ ] Down down functionality
- [ ] Split pairs functionality
- [ ] Insurance when dealer shows Ace
- [ ] Surrender option
- [ ] Multi-deck support

### Phase 2: User Experience

- [ ] Hand history with replay

### Phase 3: Advanced Features

- [ ] Multiplayer support
- [ ] Persistent statistics

-->

Want to contribute? Check out our [Contributing Guidelines](CONTRIBUTING.md) or pick up one of the roadmap items!
