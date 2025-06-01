import { createLevels } from './levels.js';
import { InputManager } from './inputManager.js';

const canvas = document.getElementById('gameCanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let currentLevelIndex = 0;
let feedbackMessage = null;
let feedbackTimer = 0;

function setFeedback(msg, duration = 2) {
    feedbackMessage = msg;
    feedbackTimer = duration;
  }
  
  function advanceLevel() {
    currentLevelIndex++;
    nextLevelDelayActive = true;
  }  

const levels = createLevels({ setFeedback, advanceLevel });
let previousLevelIndex = currentLevelIndex;
let nextLevelDelayActive = true;

function gameLoop(timestamp) {
    const deltaTime = 1 / 60;
  
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    if (levels[currentLevelIndex]) {
      levels[currentLevelIndex].update(deltaTime);
      levels[currentLevelIndex].draw(ctx);
      if (currentLevelIndex !== previousLevelIndex) {
        if (!nextLevelDelayActive) {
            levels[currentLevelIndex].load();
            previousLevelIndex = currentLevelIndex;
            console.log(`Loaded level ${currentLevelIndex + 1}`);
        }
      }
    }
    else {
      ctx.fillStyle = 'white';
      ctx.font = '30px sans-serif';
      ctx.fillText("You finished the quiz!", 100, 100);
    }
  
    // Draw feedback marquee if active
    if (feedbackMessage) {
      ctx.fillStyle = "rgba(0, 200, 0, 0.9)";
      ctx.font = "bold 60px sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(feedbackMessage, canvas.width / 2, canvas.height / 2);
      
      feedbackTimer -= deltaTime;
      if (feedbackTimer <= 0) {
        nextLevelDelayActive = false;
        feedbackMessage = null;
      }
    }
  
    requestAnimationFrame(gameLoop);
}

levels[currentLevelIndex].load();
gameLoop();

canvas.addEventListener('mousemove', (e) => {
  InputManager.handleMouseMove(e.offsetX, e.offsetY);
});

canvas.addEventListener('click', (e) => {
  InputManager.handleClick(e.offsetX, e.offsetY);
});