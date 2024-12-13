class TextMessage {
  constructor({ text, img, messageData, onComplete }) {
    this.text = text;
    this.img = img;
    this.messageData = messageData;
    this.onComplete = onComplete;
    this.element = null;
    this.revealingText = null;
  }

  createElement() {
    //Create the element
    this.element = document.createElement("div");
    this.element.classList.add("TextMessage");

        // Inicializar el texto con la copia original
    let textWithImages = this.text;

        // Verificar si hay datos disponibles y si el texto contiene palabras clave
    if (this.messageData && this.messageData.data.length > 0) {
            // Iterar sobre los datos de las palabras clave
      this.messageData.data.forEach((item) => {
                // Utilizar una expresión regular global para reemplazar todas las ocurrencias de la palabra clave
        const regex = new RegExp(item.palabraClave, 'g');
                // Reemplazar la palabra clave con la imagen correspondiente
        textWithImages = textWithImages.replace(regex, `<img src="${item.imagen}" class="TextMessage_icon">`);
      });
    }
      
    this.element.innerHTML = (`<img src="${this.img}" class="TextMessage_img"> <p class="TextMessage_p"></p></img>`);    
    // Agregar el botón "Next"
    this.element.innerHTML += (`<button class="TextMessage_button">Siguiente</button>`);


     // Agregar el elemento al contenedor
     const container = document.querySelector(".game-container");
     container.appendChild(this.element);
 
      //console.log(textWithImages);

    //Init the typewriter effect
    this.revealingText = new RevealingText({
      element: this.element.querySelector(".TextMessage_p"),
      text: textWithImages,
    })

    this.element.querySelector("button").addEventListener("click", () => {
      //Close the text message
      this.done();
    });

    this.actionListener = new KeyPressListener("Enter", () => {
        this.done();
    });
    
    document.getElementById("enterButton").addEventListener("click", () => {
      // Crear una nueva instancia de KeyPressListener y llamar a this.done()
      document.getElementById("enterButton").blur();
        this.done();
    
    });

    

  }

  done() {

    if (this.revealingText.isDone) {
      this.element.remove();
      this.actionListener.unbind();
      this.onComplete();
    } else {
      this.revealingText.warpToDone();
    }
  }

  init(container) {
    this.createElement();
    container.appendChild(this.element);
    this.revealingText.init();
  }

}