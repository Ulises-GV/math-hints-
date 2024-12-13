class PauseMenu {
  constructor({progress, onComplete}) {
    this.progress = progress;
    this.onComplete = onComplete;
  }

  getOptions(pageKey) {

    //Case 1: Show the first page of options
    if (pageKey === "root") {
      const lineupPersonaje = playerState.lineup.map(id => {
        const {personajeId} = playerState.personaje[id];
        const base = Personaje[personajeId];
        return {
          label: base.name,
          description: base.description,
          handler: () => {
            this.keyboardMenu.setOptions( this.getOptions(id) )
          }
        }
      })
      return [
        ...lineupPersonaje,
        {
          label: "Guardar",
          description: "Guarda tu progreso",
          handler: () => {
            this.progress.save();
            this.close();
          }
        },
        {
          label: "Cerrar",
          description: "Cerrar Menu",
          handler: () => {
            this.close();
          }
        }
      ]
    }

    //Case 2: Show the options for just one pizza (by id)
    const unequipped = Object.keys(playerState.personaje).filter(id => {
      return playerState.lineup.indexOf(id) === -1;
    }).map(id => {
      const {personajeId} = playerState.personaje[id];
      const base = Personaje[personajeId];
      return {
        label: `Cambiar por ${base.name}`,
        description: base.description,
        handler: () => {
          playerState.swapLineup(pageKey, id);
          this.keyboardMenu.setOptions( this.getOptions("root") );
        }
      }
    })

    return [
      /*...unequipped,
      {
        label: "Move to front",
        description: "Move this atack to the front of the list",
        handler: () => {
          playerState.moveToFront(pageKey);
          this.keyboardMenu.setOptions( this.getOptions("root") );
        }
      },*/
      {
        label: "Atrás",
        description: "Regresar",
        handler: () => {
          this.keyboardMenu.setOptions( this.getOptions("root") );
        }
      }
    ];
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("PauseMenu");
    this.element.classList.add("overlayMenu");
    this.element.innerHTML = (`
      <h2>Menu de Pausa</h2>
    `)
  }

  close() {
    this.esc?.unbind();
    this.keyboardMenu.end();
    this.element.remove();
    this.onComplete();
  }

  async init(container) {
    this.createElement();
    this.keyboardMenu = new KeyboardMenu({
      descriptionContainer: container
    })
    this.keyboardMenu.init(this.element);
    this.keyboardMenu.setOptions(this.getOptions("root"));

    container.appendChild(this.element);

    utils.wait(200);
    this.esc = new KeyPressListener("Escape", () => {
      this.close();
    })
  }

}