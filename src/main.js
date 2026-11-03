const root = document.querySelector('.root');

// Game mount
const game = document.createElement('div');
game.id = 'game';
game.setAttribute('aria-label', 'Platform Game');
game.tabIndex = 0;

const status = document.createElement('p');
status.textContent = 'Game initialization pending.';

game.appendChild(status);

// Replace static fallback after successful initialization
root.replaceChildren(game);
