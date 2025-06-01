export class CanvasButton {
    constructor({ x, y, w, h, label, onClick, correct = false }) {
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
      this.label = label;
      this.onClick = onClick;
      this.correct = correct;
      this.hovered = false;
      this.hoverTime = 0;
    }
  
    update(dt) {
      const speed = 5;
      this.hoverTime += (this.hovered ? dt : -dt) * speed;
      this.hoverTime = Math.max(0, Math.min(1, this.hoverTime));
    }
  
    draw(ctx) {
      const glow = 0.3 + 0.7 * this.hoverTime;
      ctx.fillStyle = this.hovered ? `rgba(255,165,0,${glow})` : 'lightblue';
      ctx.fillRect(this.x, this.y, this.w, this.h);
      ctx.fillStyle = 'black';
      ctx.font = '20px sans-serif';
      ctx.fillText(this.label, this.x + 10, this.y + 30);
    }
  }
  