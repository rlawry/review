export const InputManager = {
    objects: [],
  
    register(obj) {
      this.objects.push(obj);
    },
  
    clear() {
      this.objects = [];
    },
  
    handleMouseMove(x, y) {
      this.objects.forEach(obj => {
        obj.hovered = (x >= obj.x && x <= obj.x + obj.w && y >= obj.y && y <= obj.y + obj.h);
      });
    },
  
    handleClick(x, y) {
      this.objects.forEach(obj => {
        if (x >= obj.x && x <= obj.x + obj.w && y >= obj.y && y <= obj.y + obj.h) {
          obj.onClick?.();
        }
      });
    },
  
    update(deltaTime) {
      this.objects.forEach(obj => obj.update?.(deltaTime));
    }
  };