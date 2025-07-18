# 🎲 Random Table Maker

A random table maker for table top roleplaying games. Input your entries and it will figure out which die or dice combination would fit best for rolling on it.

## ✨ Features

- 🎲 Supports typical polyhedral dice; d2 (coin), d4, d6, d8, d10, d12, d20, and d100
- 🎲 Supports Dungeon Crawl Classics dice; d3, d5, d7, d14, d16, d24, and d30
- 🧠 Provides fallback options for table sizes that don't have a perfect fit:
    - Forced: Spread to a d100, causes entries near the top of the table to have slightly higher odds
    - Reroll: Will add "reroll" entries to the table to make it fit equally distributed dice size(s)
- 🏔️ Can map tables to a bell curve (normal) distribution
    - Entries near the middle of the table will have higher odds than those at the edges
- ⚖️ Can display the odds of each entry
- 📥 Import from plain text
- 📤 Export to plain text, CSV, and HTML
- 🗃️ Saves table and settings to local storage

## 🔨 Tech

- Framework: [Svelte](https://svelte.dev)
- Utility: [lodash](https://lodash.com)
- Classless Styling: [new.css](https://newcss.net)
- Animation: [autoAnimate](https://auto-animate.formkit.com)

<a href="https://gitmoji.dev">
  <img
    src="https://img.shields.io/badge/gitmoji-%20😜%20😍-FFDD67.svg?style=flat"
    alt="Gitmoji"
  />
</a>
