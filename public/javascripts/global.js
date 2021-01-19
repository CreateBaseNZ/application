import { confetti } from '../../node_modules/dom-confetti/src/main.js';

const config = {
  angle: 0,
  spread: 90,
  startVelocity: 20,
  elementCount: 20,
  width: "10px",
  height: "10px",
  perspective: "200px",
  colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"],
  duration: 2000,
  stagger: 3,
  dragFriction: 0.12,
  random: Math.random
};

document.querySelectorAll('.project-card.completed').forEach(function (card) {
  card.addEventListener('mouseenter', () => confetti(card, config))
})

document.querySelectorAll('.tags-container').forEach((container) => {
  container.addEventListener('wheel', function(e) {
    this.scrollLeft += e.deltaY * 0.25;
  })
})

