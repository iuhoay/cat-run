import { catStats, game, lastStatUpdate, setLastStatUpdate } from 'game/state';
import { MAX_STAT, STAT_DECAY_RATE } from 'game/constants';
import { updateStatBars } from 'game/ui/dom';

export function updateStats() {
    const now = Date.now();
    if (now - lastStatUpdate < 100) return;

    setLastStatUpdate(now);

    if (catStats.hunger > 0) catStats.hunger -= STAT_DECAY_RATE;
    if (catStats.thirst > 0) catStats.thirst -= STAT_DECAY_RATE;
    if (catStats.energy > 0 && game.state === 'running') catStats.energy -= STAT_DECAY_RATE * 2;
    if (catStats.hygiene > 0) catStats.hygiene -= STAT_DECAY_RATE * 0.5;

    const avgStats = (catStats.hunger + catStats.thirst + catStats.energy + catStats.hygiene) / 4;
    catStats.happiness = avgStats;

    catStats.hunger = Math.max(0, Math.min(MAX_STAT, catStats.hunger));
    catStats.thirst = Math.max(0, Math.min(MAX_STAT, catStats.thirst));
    catStats.energy = Math.max(0, Math.min(MAX_STAT, catStats.energy));
    catStats.happiness = Math.max(0, Math.min(MAX_STAT, catStats.happiness));
    catStats.hygiene = Math.max(0, Math.min(MAX_STAT, catStats.hygiene));
}
