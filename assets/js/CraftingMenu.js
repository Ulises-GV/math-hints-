class CraftingMenu {
  constructor({ ecuacion, onComplete}) {
    this.ecuacion = ecuacion;
    this.onComplete = onComplete;
  }

  getOptions() {
    return this.ecuacion.map(id => {
      const base = Ecuacion[id];
      return {
        label: base.name,
        description: base.description,
        handler: () => {
          playerState.addPersonaje(id);
          this.close();
        }
      }
    })
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("CraftingMenu");
    this.element.classList.add("overlayMenu");
    this.element.innerHTML = (`
      <h2>Escoge tu ecuación</h2>
    `)
  }

  close() {
    this.keyboardMenu.end();
    this.element.remove();
    this.onComplete();
  }


  init(container) {
    this.createElement();
    this.keyboardMenu = new KeyboardMenu({
      descriptionContainer: container
    })
    this.keyboardMenu.init(this.element)
    this.keyboardMenu.setOptions(this.getOptions())

    container.appendChild(this.element);
  }
}