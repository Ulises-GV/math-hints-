class KeyboardMenu {
  constructor(config={}) {
    this.options = []; //set by updater method
    this.up = null;
    this.down = null;
    this.prevFocus = null;
    this.descriptionContainer = config.descriptionContainer || null;
  }

  static isMathExpression(expression) {
    // Verificar si la expresión está envuelta entre delimitadores de MathJax
    const isMath = expression.match(/^\$\$(.*)\$\$$/) !== null;
    //console.log("Is Math Expression:", isMath); // Verificar si la expresión es una expresión matemática
    return isMath;
  }

  setOptions(options) {
    this.options = options;
    this.element.innerHTML = this.options.map((option, index) => {
      const disabledAttr = option.disabled ? "disabled" : "";
      const label = KeyboardMenu.isMathExpression(option.label) ? `$$${option.label}$$` : option.label; // Verificar si la etiqueta contiene una expresión matemática
      return (`
        <div class="option">
          <button ${disabledAttr} data-button="${index}" data-description="${option.description}">
            ${label}
          </button>
          <span class="right">${option.right ? option.right() : ""}</span>
        </div>
      `);
    }).join("");
  //MathJax.typeset();
  setTimeout(() => {
    MathJax.typeset();
}, 1);

    this.element.querySelectorAll("button").forEach(button => {

      button.addEventListener("click", () => {
        const chosenOption = this.options[ Number(button.dataset.button) ];
        chosenOption.handler();
      })
      button.addEventListener("mouseenter", () => {
        button.focus();
      })
      button.addEventListener("focus", () => {
        this.prevFocus = button;
        this.descriptionElementText.innerText = button.dataset.description;
      })
    })

    setTimeout(() => {
      this.element.querySelector("button[data-button]:not([disabled])").focus();
    }, 10)

    


  }

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("KeyboardMenu");

    //Description box element
    this.descriptionElement = document.createElement("div");
    this.descriptionElement.classList.add("DescriptionBox");
    this.descriptionElement.innerHTML = (`<p>Información</p>`);
    this.descriptionElementText = this.descriptionElement.querySelector("p");
  }

  end() {

    //Remove menu element and description element
    this.element.remove();
    this.descriptionElement.remove();

    //Clean up bindings
    this.up.unbind();
    this.down.unbind();
  }

  init(container) {
    this.createElement();
    (this.descriptionContainer || container).appendChild(this.descriptionElement);
    container.appendChild(this.element);

    this.up = new KeyPressListener("ArrowUp", () => {
      const current = Number(this.prevFocus.getAttribute("data-button"));
      const prevButton = Array.from(this.element.querySelectorAll("button[data-button]")).reverse().find(el => {
        return el.dataset.button < current && !el.disabled;
      })
      prevButton?.focus();
    })
    this.down = new KeyPressListener("ArrowDown", () => {
      const current = Number(this.prevFocus.getAttribute("data-button"));
      const nextButton = Array.from(this.element.querySelectorAll("button[data-button]")).find(el => {
        return el.dataset.button > current && !el.disabled;
      })
      nextButton?.focus();
    })

  }

}