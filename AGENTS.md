# AGENTS.md

## Project Overview

Cat Runner is a vanilla JavaScript browser-based virtual pet game with ES6 modules, no build system, and no dependencies. Uses HTML5 Canvas for rendering and Web Audio API for procedural sound generation.

## Running the Game

**No build process required.**

To play:
```bash
# Simply open index.html in any modern browser
open index.html
```

For development:
```bash
# Use any local server (optional, recommended for better performance)
python3 -m http.server 8000
# or
npx serve
```

## Testing & Quality

**No automated tests or linting configured.**

Manual testing checklist:
- Open index.html in Chrome/Firefox/Safari
- Verify canvas rendering works on resize
- Test all keyboard inputs (Space, ArrowUp, Enter, R)
- Test mouse/touch interactions
- Verify sound plays (browser may block autoplay)
- Check stat bar updates
- Test room interactions (food, water, bed, litter, door)
- Test runner mode gameplay
- Verify responsive behavior on mobile

## Code Style Guidelines

### File Structure
```
cat-run/
├── index.html    # Main HTML with import map and UI
├── style.css     # CSS for game UI overlay
├── js/
│   ├── main.js           # Entry point, initialization
│   ├── constants.js      # Game constants
│   ├── state.js          # Global state and export functions
│   ├── game.js           # Game loop and state transitions
│   ├── canvas.js         # Canvas setup and resize handling
│   ├── audio.js          # Web Audio API sound manager
│   ├── input.js          # Keyboard/touch/mouse event handlers
│   ├── stats.js          # Cat stat decay logic
│   ├── utils.js          # Utility functions
│   ├── background.js      # Parallax background rendering
│   ├── obstacles.js      # Obstacle spawning and rendering
│   ├── room/
│   │   ├── cat.js        # Cat behavior in room mode
│   │   ├── objects.js    # Room objects and furniture
│   │   └── renderer.js   # Room scene rendering
│   ├── runner/
│   │   ├── cat.js        # Cat physics and movement
│   │   └── logic.js      # Collision detection
│   └── ui/
│       ├── dom.js        # DOM element references and UI updates
│       └── screens.js    # Start screen rendering
└── README.md
```

### JavaScript Conventions

**Naming:**
- Variables/Functions: camelCase (`catStats`, `updateCat`, `drawBackground`)
- Constants: UPPER_SNAKE_CASE (`GRAVITY`, `JUMP_FORCE`, `MAX_STAT`)
- DOM elements: camelCase ending with `Element` or clear naming
- State objects: lowercase descriptive names (`game`, `cat`, `obstacles`)

**Imports:**
- Use import map aliases defined in index.html (`game/state`, `game/constants`)
- Do not use relative paths (`./state.js`) except in dynamic imports
- Always import what you use at the top of the file

**Rendering:**
- Canvas coordinates: (0,0) at top-left
- Always check `canvas` and `ctx` existence before drawing
- Use `ctx.save()`/`ctx.restore()` for transformations
- Game runs at 60fps via `requestAnimationFrame`

**State Management:**
- Export state from `state.js`, import elsewhere
- State modifications happen in update functions
- Use setter functions when needed (`setCanvas`, `setLastStatUpdate`)

**Audio:**
- Initialize audio on first user interaction
- Check `audioContext` existence before playing sounds
- Use `soundManager.ensureContext()` before any sound call

**Input Handling:**
- Single `keydown` listener in `input.js`
- Single `pointerdown` listener (handles both mouse and touch)
- Prevent default for game controls to avoid scrolling
- Initialize audio context on any user interaction

**Error Handling:**
- Check for null canvas/ctx before operations
- Validate game state before state transitions
- No try/catch needed for most operations

**CSS:**
- Flexbox/Grid for UI layout
- Absolute positioning for overlays over canvas
- `@media` queries for responsive design
- Transitions for smooth UI changes
- Text shadows for contrast

## Key Patterns

**Module Import Pattern:**
```javascript
import { game, cat, canvas, ctx } from 'game/state';
import { GRAVITY, JUMP_FORCE } from 'game/constants';
import { soundManager } from 'game/audio';
```

**State Transition Pattern:**
```javascript
export function enterRoom() {
    game.state = 'room';
    initRoomObjects();
    initCatInRoom();
    soundManager.playRoomEnter();
}
```

**Canvas Drawing Pattern:**
```javascript
export function drawCat() {
    if (!canvas || !ctx) return;
    ctx.save();
    ctx.translate(cat.x, cat.y);
    // Draw operations
    ctx.restore();
}
```

**No comments in code** - keep it minimal and self-documenting through clear naming.
