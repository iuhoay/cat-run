# Cat Runner - Virtual Pet Game

A charming browser-based virtual pet game where you care for a cat companion. Features a cozy home room for pet care and an endless runner mini-game for exercise.

> **A Father's Gift** - This game was lovingly created for my daughter, inspired by her imagination and ideas. Every feature, from the purring sounds to the litter box, came from her creative mind.

## Play Now

Open `index.html` in any modern web browser. No installation or build process required.

## How to Play

### Home Room
Start in the cozy cat room where you can care for your feline friend:

- **Food Bowl** - Feed your cat when hunger is low
- **Water Bowl** - Give water when thirst is low
- **Bed** - Let your cat sleep to restore energy
- **Litter Box** - Maintain hygiene by letting your cat use the litter box
- **Door** - Click to go for a run (runner mini-game)

Your cat has 4 stats that decay over time:
- **Hunger** - Feed at the food bowl
- **Thirst** - Drink at the water bowl
- **Energy** - Sleep in the bed
- **Hygiene** - Use the litter box

### Runner Mode
Click the door to enter runner mode:
- Press **SPACE** or **Click** to jump over obstacles
- Collect points as you run
- Higher speed = more points
- Game ends if you hit an obstacle

## Controls

| Key | Action |
|-----|--------|
| SPACE | Jump (runner mode) |
| Click/Tap | Jump (runner mode) / Interact (room) |
| Click door | Start runner mode |

## Features

- **Procedural Audio** - All sound effects generated using Web Audio API (no external files)
- **Parallax Background** - Smooth scrolling layers in runner mode
- **Stat Management** - Four stats that affect cat happiness
- **Responsive Design** - Works on desktop and mobile devices
- **No Dependencies** - Pure vanilla JavaScript, HTML5 Canvas, and CSS3

## Technical Details

- **Rendering**: HTML5 Canvas API
- **Audio**: Web Audio API with synthesized sound effects
- **Animation**: RequestAnimationFrame-based game loop
- **Input**: Keyboard and touch/mouse event handling

## File Structure

```
cat-run/
├── index.html    # Main HTML structure
├── style.css     # Styling and responsive design
├── game.js       # Game logic, rendering, and audio
└── README.md     # This file
```

## Browser Compatibility

- Chrome/Edge 80+
- Firefox 75+
- Safari 13+
- Mobile browsers with ES6 support

## License

MIT License - Feel free to modify and share!
