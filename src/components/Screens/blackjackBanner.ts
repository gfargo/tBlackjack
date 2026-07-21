// Hardcoded ASCII art banner so the Welcome screen doesn't depend on
// ink-big-text -> cfonts, which reads font files from disk via fs/path and
// therefore can't run in browser environments (e.g. ink-canvas).
export const BLACKJACK_BANNER = `███  █     ██   ███ █  █    █  ██   ███ █  █
█  █ █    █  █ █    █ █     █ █  █ █    █ █
███  █    ████ █    ██      █ ████ █    ██
█  █ █    █  █ █    █ █  █  █ █  █ █    █ █
███  ████ █  █  ███ █  █  ██  █  █  ███ █  █`
