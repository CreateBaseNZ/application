import { confetti } from '../../node_modules/dom-confetti/src/main.js';

document.querySelectorAll('.project-card.completed').forEach(function (card) {
  card.addEventListener('mouseenter', () => confetti(card))
})