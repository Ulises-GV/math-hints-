/*class RevealingText {
  constructor(config) {
    this.element = config.element;
    this.text = config.text;
    this.speed = config.speed || 60;

    this.timeout = null;
    this.isDone = false;
  }

  revealOneCharacter(list) {
    const next = list.splice(0,1)[0];
    next.span.classList.add("revealed");

    if (list.length > 0) {
      this.timeout = setTimeout(() => {
        this.revealOneCharacter(list)
      }, next.delayAfter)
    } else {
      this.isDone = true;
    }
  }

  warpToDone() {
    clearTimeout(this.timeout);
    this.isDone = true;
    this.element.querySelectorAll("span, img").forEach(s => {
      s.classList.add("revealed");
    })
  }
  reset() {
    clearTimeout(this.timeout);
    this.isDone = false;
    this.element.innerHTML = ''; // Limpiar el contenido del elemento
  }

  init() {
    this.reset(); // Limpiar el contenido previo del elemento

    
      
    let characters = [];
    let imgDelay = 0; // Variable para manejar el retraso de las imágenes
    let spanDelay = 0;

    // Expresión regular para buscar expresiones matemáticas en el texto
    const mathRegex = /(\$\$.*?\$\$)|(\(.*?\))/g;

    // Dividir el texto en partes, separando las expresiones matemáticas
    const parts = this.text.split(mathRegex);

    // Verificar si parts no está vacío y es diferente de null
    if (parts && parts.length > 0) {
        // Iterar sobre las partes del texto
        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            
            // Verificar si la parte actual es una expresión matemática
            if (mathRegex.test(part)) {
                // La parte contiene una expresión matemática 
                 
                let mathjaxElement = document.createElement("span");
                mathjaxElement.innerHTML = part;
                mathjaxElement.classList.add("mathjax");
                this.element.appendChild(mathjaxElement);
                characters.push({
                    element: mathjaxElement,
                    delayAfter: this.speed,
                    
                });
      } else {
        // La parte es texto normal, similar a la lógica existente para spans e imágenes
        if (part) { // Verificar si part está definido
          for (let j = 0; j < part.length; j++) {
            let char = part[j];
            if (char === '<' && part.slice(j, j + 4) === '<img') {
              let endIndex = part.indexOf(">", j); // Encontrar el índice del cierre de la etiqueta
              let imgTag = part.substring(j, endIndex + 1); // Obtener la etiqueta completa de la imagen
              let srcMatch = imgTag.match(/src=["'](.*?)["']/); // Buscar la ruta de la imagen en la etiqueta
              let imgSrc = srcMatch ? srcMatch[1] : ''; // Extraer la ruta de la imagen
              let imgElement = document.createElement("img");
              imgElement.setAttribute("src", imgSrc); // Configurar el atributo src con la ruta de la imagen
              imgElement.classList.add("TextMessage_icon");
              this.element.appendChild(imgElement);
              characters.push({
                element: imgElement,
                delayAfter: imgDelay,
              });
              j = endIndex; // Saltar al índice después del cierre de la etiqueta de la imagen
              imgDelay += this.speed;
            } else if (char === '<' && part.slice(j, j + 5) === '<span') {
              let endIndex = part.indexOf("</span>", j); // Encontrar el índice del cierre de la etiqueta
              let spanTag = part.substring(j, endIndex + 7); // Obtener la etiqueta completa <span>...</span>

              // Extraer el contenido dentro del span
              let spanContentStart = spanTag.indexOf(">") + 1; // Encontrar el índice del inicio del contenido dentro del span
              let spanContent = spanTag.substring(
                spanContentStart,
                spanTag.length - 7
              ); // Obtener el contenido dentro del span

              // Crear el elemento <span>
              let spanElement = document.createElement("span");
              spanElement.innerHTML = spanContent; // Insertar el contenido dentro del elemento span

              // Obtener el estilo del span
              let styleMatch = spanTag.match(/style\s*=\s*["'](.*?)["']/);
              if (styleMatch) {
                let style = styleMatch[1];
                // Buscar el color en el estilo
                let colorMatch = style.match(/color\s*:\s*([^;]*)/);
                if (colorMatch) {
                  let color = colorMatch[1].trim();
                  spanElement.style.color = color; // Aplicar el color al texto del span
                }
              }

              // Agregar el elemento <span> al DOM
              this.element.appendChild(spanElement);

              // Agregar el elemento al array de caracteres
              characters.push({
                element: spanElement,
                delayAfter: spanDelay,
              });

              // Actualizar el índice y el retraso
              j = endIndex + 7; // Saltar al índice después del cierre de la etiqueta </span>
              spanDelay += this.speed;
            } else {
              // Carácter de texto normal
              let span = document.createElement("span");
              span.textContent = char;
              this.element.appendChild(span);
              characters.push({
                element: span,
                delayAfter: this.speed,
              });
            }
          }
        }
      }
    }
  }

  // Revelar caracteres secuencialmente
  
  this.revealOneCharacter(characters);


  setTimeout(() => {
    MathJax.typeset();
}, 100);
}
}*/

class RevealingText {
  constructor(config) {
    this.element = config.element;
    this.text = config.text;
    this.speed = config.speed || 60;

    this.timeout = null;
    this.isDone = false;
  }

  revealOneCharacter(list) {
    const next = list.splice(0,1)[0];
    next.element.classList.add("revealed");

    if (list.length > 0) {
      this.timeout = setTimeout(() => {
        this.revealOneCharacter(list)
      }, next.delayAfter)
    } else {
      this.isDone = true;
    }
  }

  warpToDone() {
    clearTimeout(this.timeout);
    this.isDone = true;
    this.element.querySelectorAll("span, img").forEach(s => {
      s.classList.add("revealed");
    })
  }
  //reset() {
    //clearTimeout(this.timeout);
    //this.isDone = false;
    //this.element.innerHTML = ''; // Limpiar el contenido del elemento
 // }

  init() {
   // this.reset(); // Limpiar el contenido previo del elemento
    
    let characters = [];
    let imgDelay = 0; // Variable para manejar el retraso de las imágenes
    let spanDelay = 0;

    // Expresión regular para buscar expresiones matemáticas en el texto
    const mathRegex = /(\$\$.*?\$\$)|(\(.*?\))/g;

    // Dividir el texto en partes, separando las expresiones matemáticas
    const parts = this.text.split(mathRegex);

    // Verificar si parts no está vacío y es diferente de null
    if (parts && parts.length > 0) {
        // Iterar sobre las partes del texto
        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            
            // Verificar si la parte actual es una expresión matemática
            if (mathRegex.test(part)) {
                // La parte contiene una expresión matemática 
                let mathjaxElement = document.createElement("span");
                mathjaxElement.innerHTML = part;
                mathjaxElement.classList.add("mathjax");
                this.element.appendChild(mathjaxElement);
                characters.push({
                    element: mathjaxElement,
                    delayAfter: this.speed,
                });
            } else {
                // La parte es texto normal, similar a la lógica existente para spans e imágenes
                if (part) { // Verificar si part está definido
                    for (let j = 0; j < part.length; j++) {
                        let char = part[j];
                        if (char === '<' && part.slice(j, j + 4) === '<img') {
                            let endIndex = part.indexOf(">", j); // Encontrar el índice del cierre de la etiqueta
                            let imgTag = part.substring(j, endIndex + 1); // Obtener la etiqueta completa de la imagen
                            let srcMatch = imgTag.match(/src=["'](.*?)["']/); // Buscar la ruta de la imagen en la etiqueta
                            let imgSrc = srcMatch ? srcMatch[1] : ''; // Extraer la ruta de la imagen
                            let imgElement = document.createElement("img");
                            imgElement.setAttribute("src", imgSrc); // Configurar el atributo src con la ruta de la imagen
                            imgElement.classList.add("TextMessage_icon");
                            this.element.appendChild(imgElement);
                            characters.push({
                                element: imgElement,
                                delayAfter: imgDelay,
                            });
                            j = endIndex; // Saltar al índice después del cierre de la etiqueta de la imagen
                            imgDelay += this.speed;
                        } else if (char === '<' && part.slice(j, j + 5) === '<span') {
                            let endIndex = part.indexOf("</span>", j); // Encontrar el índice del cierre de la etiqueta
                            let spanTag = part.substring(j, endIndex + 7); // Obtener la etiqueta completa <span>...</span>

                            // Extraer el contenido dentro del span
                            let spanContentStart = spanTag.indexOf(">") + 1; // Encontrar el índice del inicio del contenido dentro del span
                            let spanContent = spanTag.substring(
                                spanContentStart,
                                spanTag.length - 7
                            ); // Obtener el contenido dentro del span

                            // Crear el elemento <span>
                            let spanElement = document.createElement("span");
                            spanElement.innerHTML = spanContent; // Insertar el contenido dentro del elemento span

                            // Obtener el estilo del span
                            let styleMatch = spanTag.match(/style\s*=\s*["'](.*?)["']/);
                            if (styleMatch) {
                                let style = styleMatch[1];
                                // Buscar el color en el estilo
                                let colorMatch = style.match(/color\s*:\s*([^;]*)/);
                                if (colorMatch) {
                                    let color = colorMatch[1].trim();
                                    spanElement.style.color = color; // Aplicar el color al texto del span
                                }
                            }

                            // Agregar el elemento <span> al DOM
                            this.element.appendChild(spanElement);

                            // Agregar el elemento al array de caracteres
                            characters.push({
                                element: spanElement,
                                delayAfter: spanDelay,
                            });

                            // Actualizar el índice y el retraso
                            j = endIndex + 7; // Saltar al índice después del cierre de la etiqueta </span>
                            spanDelay += this.speed;
                        } else {
                            // Carácter de texto normal
                            let span = document.createElement("span");
                            span.textContent = char;
                            this.element.appendChild(span);
                            characters.push({
                                element: span,
                                delayAfter: this.speed,
                            });
                        }
                    }
                }
            }
        }
    }

    // Revelar caracteres secuencialmente
    this.revealOneCharacter(characters);

    setTimeout(() => {
        MathJax.typeset();
    }, 100);
  }

}