class DirectionInput {
  constructor() {
    this.heldDirections = [];

    this.map = {
      "ArrowUp": "up",
      "KeyW": "up",
      "ArrowDown": "down",
      "KeyS": "down",
      "ArrowLeft": "left",
      "KeyA": "left",
      "ArrowRight": "right",
      "KeyD": "right",
    }
  }

  get direction() {
    return this.heldDirections[0];
  }

  init() {
    document.addEventListener("keydown", e => {
      const dir = this.map[e.code];
      if (dir && this.heldDirections.indexOf(dir) === -1) {
        this.heldDirections.unshift(dir);
      }
    });
    document.addEventListener("keyup", e => {
      const dir = this.map[e.code];
      const index = this.heldDirections.indexOf(dir);
      if (index > -1) {
        this.heldDirections.splice(index, 1);
      }
    })

    const buttons = document.querySelectorAll('.direction-button');
    buttons.forEach(button => {
      const dir = button.getAttribute('data-direction');
      
      const startHandler = () => {
        if (this.heldDirections.indexOf(dir) === -1) {
          this.heldDirections.unshift(dir);
        }
      };

      const endHandler = () => {
        const index = this.heldDirections.indexOf(dir);
        if (index > -1) {
          this.heldDirections.splice(index, 1);
        }
      };

      button.addEventListener('mousedown', startHandler);
      button.addEventListener('mouseup', endHandler);
      button.addEventListener('touchstart', startHandler);
      button.addEventListener('touchend', endHandler);
    });
    
    /*const buttons = document.querySelectorAll('.direction-button');
        buttons.forEach(button => {
          button.addEventListener('mousedown', () => {
            const dir = button.getAttribute('data-direction');
            if (this.heldDirections.indexOf(dir) === -1) {
              this.heldDirections.unshift(dir);
            }
          });
          button.addEventListener('mouseup', () => {
            const dir = button.getAttribute('data-direction');
            const index = this.heldDirections.indexOf(dir);
            if (index > -1) {
              this.heldDirections.splice(index, 1);
            }
          });
        });*/

  }

}