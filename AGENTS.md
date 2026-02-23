# AGENTS.md

## Project Overview

Cat Runner is a vanilla JavaScript browser-based virtual pet game with no build system, dependencies, or framework requirements. It uses HTML5 Canvas for rendering and Web Audio API for procedural sound generation.

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

**No automated tests or linting configured.** This is a simple single-file game.

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
├── index.html    # Main HTML structure with UI elements
├── style.css     # CSS for game UI overlay
├── game.js       # All game logic (1694 lines)
├── icon.svg      # Game favicon
└── README.md     # Documentation
```

### JavaScript Conventions

**Naming:**
- Variables/Functions: camelCase (`catStats`, `updateCat`, `drawBackground`)
- Constants: UPPER_SNAKE_CASE (`GRAVITY`, `JUMP_FORCE`, `MAX_STAT`)
- Objects/Classes: PascalCase for constructors (not used - plain objects only)
- DOM elements: camelCase ending with `Element` (`canvas`, `scoreElement`, `resetBtnElement`)

**Code Organization:**
1. DOM element references (lines 1-8)
2. `soundManager` object - Web Audio API methods (lines 11-262)
3. Canvas setup (lines 264-270)
4. Game constants (lines 272-280)
5. Game state variables (lines 282-297)
6. Game objects (rooms, cat, obstacles, background)
7. Initialization functions
8. Update functions (game logic)
9. Draw functions (rendering)
10. Input event handlers
11. Game loop (lines 1643-1694)

**Rendering:**
- Use HTML5 Canvas API (`ctx.fillStyle`, `ctx.fillRect`, `ctx.beginPath`, etc.)
- Canvas coordinates: (0,0) at top-left
- Use `ctx.save()`/`ctx.restore()` for transformations
- Game runs at 60fps via `requestAnimationFrame`

**State Management:**
- Single `gameState` variable: 'start', 'room', 'running', 'gameover'
- Cat stats object with hunger, thirst, energy, happiness, hygiene (0-100)
- All state updates happen in update functions called by gameLoop

**Audio:**
- Procedural sound generation using Web Audio API
- Initialize audio on first user interaction
- Use oscillators, gain nodes, and filters
- Always check `audioContext` existence before playing sounds

**Input Handling:**
- Keyboard: `keydown` event listener (Space, ArrowUp for jump, Enter for confirm, R for reset)
- Mouse: `pointerdown` event
- Touch: `touchstart` event (preventDefault to avoid scrolling)
- All input handlers init audio context

**Animation:**
- Use `frameCount` for time-based animations
- Bounce effects: `Math.sin(frameCount * speed) * amplitude`
- Walking/running: `Math.sin(frameCount * 0.3)` for leg oscillation
- Tail wagging: `Math.sin(frameCount * 0.1)` for slower movement

**Collision Detection:**
- AABB (Axis-Aligned Bounding Box) collision
- Shrink hitboxes slightly for fairness (10-15% smaller than sprites)

**Error Handling:**
- Minimal error handling in this simple game
- Audio operations wrapped in try/catch with console.warn for Web Audio failures
- Graceful degradation if audio unavailable

**CSS Conventions:**
- CSS Grid/Flexbox for UI layout
- Absolute positioning for UI overlays over canvas
- Responsive design with `@media` queries
- Transitions for smooth UI changes (`transition: all 0.2s ease`)
- Text shadows for better contrast
- `pointer-events: none` on UI container, `pointer-events: auto` on interactive elements

**Colors:**
- Cat: #ff8c42 (orange)
- Sky: #87CEEB
- Ground: #3d5c3d
- UI backgrounds: rgba(0,0,0,0.5-0.8) for contrast
- Stat bar gradients for visual appeal

## Key Patterns

**Game Loop Pattern:**
```javascript
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    frameCount++;
    
    if (gameState === 'room') {
        updateStats();
        updateRoomCat();
        drawRoom();
    } else if (gameState === 'running') {
        updateBackground();
        updateCat();
        updateObstacles();
        drawBackground();
        drawObstacles();
        drawCat();
        if (checkGameOver()) {
            // Handle game over
        }
    }
    
    requestAnimationFrame(gameLoop);
}
```

**State Machine for Cat:**
Cat states: 'running', 'jumping', 'falling', 'idle', 'walking', 'eating', 'drinking', 'sleeping', 'using_litter', 'bathing'

**Parallax Background:**
Multiple layers with different scroll speeds based on `gameSpeed`

## Browser Compatibility

Targets modern browsers (Chrome 80+, Firefox 75+, Safari 13+, Mobile browsers with ES6)

## Modifying the Game

- All game logic in `game.js`
- Visual changes: modify draw functions
- Gameplay changes: modify update functions and constants
- New features: add to appropriate object (cat, roomObjects, etc.)
- Add new sounds: create new method in `soundManager`

**IMPORTANT:** No comments in code - keep it minimal and self-documenting through clear naming.
