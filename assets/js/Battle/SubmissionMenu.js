class SubmissionMenu { 
  constructor({ caster, enemy, onComplete, items, replacements }) {
    this.caster = caster;
    this.enemy = enemy;
    this.replacements = replacements;
    this.onComplete = onComplete;

    let quantityMap = {};
    items.forEach(item => {
      if (item.team === caster.team) {
        let existing = quantityMap[item.actionId];
        if (existing) {
          existing.quantity += 1;
        } else {
          quantityMap[item.actionId] = {
            actionId: item.actionId,
            quantity: 1,
            instanceId: item.instanceId,
          }
       }
      }
    })
    this.items = Object.values(quantityMap);
  }

  getPages() {

    const backOption = {
      label: "Atrás",
      description: "Regresar",
      handler: () => {
        this.keyboardMenu.setOptions(this.getPages().root)
      }
    };

    return {
      root: [
        {
          label: "Respuesta",
          description: "Selecciona la respuesta correcta",
          handler: () => {
            //Do something when chosen...
            this.keyboardMenu.setOptions( this.getPages().respuesta )
          }
        },
        {
          label: "Items",
          description: "Elije un item",
          handler: () => {
            //Go to items page...
            this.keyboardMenu.setOptions( this.getPages().items )
          }
        },
       
      ],
      respuesta: [
        ...this.enemy.opciones.map(key => {
          const action = Actions[key];
          
         //action.name = "\\frac{1}{2} + \\frac{1}{3} = \\frac{5}{6}"; // Tu expresión matemática aquí
        //const mathExpression = `\\(${action.name}\\)` //si quiero que todas las expresiones dentro de atack sean matematicas
        return {
          label:  action.name, //mathExpression,
            description: action.description,
            handler: () => {
              this.menuSubmit(action)
            }
          }
        }),
        backOption
      ],
      items: [
        ...this.items.map(item => {
          const action = Actions[item.actionId];
          return {
            label: action.name,
            description: action.description,
            right: () => {
              return "x"+item.quantity;
            },
            handler: () => {
              this.menuSubmit(action, item.instanceId)
            }
          }
        }),
        backOption
      ],
      /*replacements: [
        ...this.replacements.map(replacement => {
          return {
            label: replacement.name,
            description: replacement.description,
            handler: () => {
              //Swap me in, coach!
              this.menuSubmitReplacement(replacement)
            }
          }
        }),
        backOption
      ]*/
    }



    //este sistema maneja diferentes conjuntos de respuestas agrupados
    /*return {
      root: [
        {
          label: "Respuesta",
          description: "Selecciona la respuesta correcta",
          handler: () => {
            //Do something when chosen...
            this.keyboardMenu.setOptions( this.getPages().respuesta )
          }
        },
        {
          label: "Items",
          description: "Elije un item",
          handler: () => {
            //Go to items page...
            this.keyboardMenu.setOptions( this.getPages().items )
          }
        },
      ],
      respuesta: [
        {
          label: "Fracciones",
          description: "Elije una fraccion",
          handler: () => {
            //Go to items page...
            this.keyboardMenu.setOptions( this.getPages().fracciones )
          }
        },
        {
          label: "Numeros",
          description: "Elije un numero",
          handler: () => {
            //Go to items page...
            this.keyboardMenu.setOptions( this.getPages().numeros )
          }
        },
        {
          label: "Formulas",
          description: "Elije una formula",
          handler: () => {
            //Go to items page...
            this.keyboardMenu.setOptions( this.getPages().formulas )
          }
        },
        
        backOption
      ],
      items: [
        ...this.items.map(item => {
          const action = Actions[item.actionId];
          return {
            label: action.name,
            description: action.description,
            right: () => {
              return "x"+item.quantity;
            },
            handler: () => {
              this.menuSubmit(action, item.instanceId)
            }
          }
        }),
        backOption
      ],
      numeros:[
        ...this.caster.actions.map(key => {
          const action = Actions[key];
          
         //action.name = "\\frac{1}{2} + \\frac{1}{3} = \\frac{5}{6}"; // Tu expresión matemática aquí
        //const mathExpression = `\\(${action.name}\\)` //si quiero que todas las expresiones dentro de atack sean matematicas
        return {
          label:  action.name, //mathExpression,
            description: action.description,
            handler: () => {
              this.menuSubmit(action)
            }
          }
        }),
        backOption
      ],
      fracciones:[
        ...this.enemy.opciones.map(key => {
          const action = Actions[key];
          
         //action.name = "\\frac{1}{2} + \\frac{1}{3} = \\frac{5}{6}"; // Tu expresión matemática aquí
        //const mathExpression = `\\(${action.name}\\)` //si quiero que todas las expresiones dentro de atack sean matematicas
        return {
          label:  action.name, //mathExpression,
            description: action.description,
            handler: () => {
              this.menuSubmit(action)
            }
          }
        }),
        backOption
      ],
      formulas:[
        ...this.enemy.opciones.map(key => {
          const action = Actions[key];
          
         //action.name = "\\frac{1}{2} + \\frac{1}{3} = \\frac{5}{6}"; // Tu expresión matemática aquí
        //const mathExpression = `\\(${action.name}\\)` //si quiero que todas las expresiones dentro de atack sean matematicas
        return {
          label:  action.name, //mathExpression,
            description: action.description,
            handler: () => {
              this.menuSubmit(action)
            }
          }
        }),
        backOption
      ],*/



      /*replacements: [
        ...this.replacements.map(replacement => {
          return {
            label: replacement.name,
            description: replacement.description,
            handler: () => {
              //Swap me in, coach!
              this.menuSubmitReplacement(replacement)
            }
          }
        }),
        backOption
      ]*/
    //}
  }

  menuSubmitReplacement(replacement) {
    this.keyboardMenu?.end();
    this.onComplete({
      replacement
    })
  }

  menuSubmit(action, instanceId=null) {

    this.keyboardMenu?.end();

    this.onComplete({
      action,
      target: action.targetType === "friendly" ? this.caster : this.enemy,
      instanceId
    })
  }

  decide() {
    //TODO: Enemies should randomly decide what to do...
    this.menuSubmit(Actions[ this.caster.actions[0] ]);
  }

  showMenu(container) {
    this.keyboardMenu = new KeyboardMenu();
    this.keyboardMenu.init(container);
    this.keyboardMenu.setOptions( this.getPages().root )
  }

  init(container) {

    if (this.caster.isPlayerControlled) {
      //Show some UI
      this.showMenu(container)
    } else {
      this.decide()
    }
  }
}