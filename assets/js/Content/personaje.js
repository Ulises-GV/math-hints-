

window.Personaje = {
  "s001": {
    name: "Tu",
    description: "Tu estado",
    src: "assets/images/characters/people/rostros/npc000.png",
    icon: "assets/images/icons/cerebro3.png",
    actions: ["damage4", "damage2", "damage3" ],
    opciones:[],
    text: "Slice Samurai is ready to slice!",
    resp: "aiuda",
  },
  "s002": {
    name: "Denominadores iguales",
    description: "Suma de fracciones sencillas",
    //src: "assets/images/characters/pizzas/s002.png",
    icon: "assets/images/icons/cerebro3.png",
    actions: [ "perder2" ],
    opciones: [ "damage1", "damage4","damage6","damage11"],
    text: "Cuanto es: $$\\frac{{1}}{{3}}+\\frac{{1}}{{3}}=?\$$ ",
    resp: "\\(\\frac{{2}}{{3}}\\)",
  },
  "s003": {
    name: "Diferentes denominadores",
    description: "Suma de fracciones sencillas",
    //src: "assets/images/characters/pizzas/s002.png",
    icon: "assets/images/icons/cerebro3.png",
    actions: [ "perder2" ],
    opciones: [ "damage1", "damage4","damage12","damage11"],
    text: "Cuanto es: $$\\frac{{1}}{{2}}+\\frac{{1}}{{3}}=?\$$ ",
    resp: "\\(\\frac{{5}}{{6}}\\)",
  },
  "s004": {
    name: "Diferentes denominadores",
    description: "Suma de fracciones sencillas",
    //src: "assets/images/characters/pizzas/s002.png",
    icon: "assets/images/icons/cerebro3.png",
    actions: [ "perder2" ],
    opciones: [ "damage13", "damage0","damage4","damage9"],
    text: "Cuanto es: $$\\frac{{1}}{{3}}+\\frac{{1}}{{4}}=?\$$ ",
    resp: "\\(\\frac{{7}}{{12}}\\)",
  },
  "s005": {
    name: "Diferentes denominadores",
    description: "Suma de fracciones sencillas",
    //src: "assets/images/characters/pizzas/s002.png",
    icon: "assets/images/icons/cerebro3.png",
    actions: [ "perder2" ],
    opciones: [ "damage12", "damage8","damage7","damage2"],
    text: "Cuanto es: $$\\frac{{2}}{{3}}+\\frac{{1}}{{6}}=?\$$ ",
    resp: "\\(\\frac{{5}}{{6}}\\)",
  },
  "v001": {
    name: "Denominadores iguales",
    description: "suma de fracciones",
    //src: "assets/images/characters/pizzas/v001.png",
    icon: "assets/images/icons/cerebro3.png",
    actions: [ "perder1" ],
    opciones: [ "damage1", "damage4","damage2","damage8"],
    text: "Cuanto es: $$\\frac{{2}}{{4}}+\\frac{{1}}{{4}}=?\$$",
    resp: "\\(\\frac{{3}}{{4}}\\)",
  },


  "r001": {
    name: "Mayor menor o igual",
    description: "¿que es mas grande?",
    //src: "assets/images/characters/pizzas/v001.png",
    icon: "assets/images/icons/cerebro3.png",
    actions: [ "perder1" ],
    opciones: ["mayor", "menor", "igual"],
    text: "$$\\frac{{4}}{{5}}\$$ es _______ que $$\\frac{{3}}{{4}}\$$",
    resp: "mayor",
  },
  "r002": {
    name: "Mayor menor o igual",
    description: "¿que es mas grande?",
    //src: "assets/images/characters/pizzas/v001.png",
    icon: "assets/images/icons/cerebro3.png",
    actions: [ "perder1" ],
    opciones: ["menor", "igual", "mayor"],
    text: "$$\\frac{{2}}{{12}}\$$ es _______ que $$\\frac{{1}}{{6}}\$$",
    resp: "igual",
  },



  "r003": {
    name: "Mayor menor o igual",
    description: "¿que es mas grande?",
    //src: "assets/images/characters/pizzas/v001.png",
    icon: "assets/images/icons/cerebro3.png",
    actions: [ "perder1" ],
    opciones: ["damage5", "damage14", "damage1"],
    text: "$$\\frac{{3}}{{4}} +\\frac{{1}}{{6}}\$$",
    resp: "\\(\\frac{{11}}{{12}}\\)",
  },
  "r004": {
    name: "Mayor menor o igual",
    description: "¿que es mas grande?",
    //src: "assets/images/characters/pizzas/v001.png",
    icon: "assets/images/icons/cerebro3.png",
    actions: [ "perder1" ],
    opciones: ["damage10", "damage14", "damage8"],
    text: "$$\\frac{{1}}{{4}}+\\frac{{2}}{{3}}\$$",
    resp: "\\(\\frac{{11}}{{12}}\\)",
  },



  "v002": {
    name: "Archie Artichoke",
    description: "Pizza desc here",
    //src: "assets/images/characters/pizzas/v001.png",
    icon: "assets/images/icons/veggie.png",
    actions: [ "perder3" ],
    opciones: [ "damage1", "damage4","damage2","damage3"],
    text: "pendejo!",
    resp: "no",
  },
  "f001": {
    name: "Portobello Express",
    description: "Pizza desc here",
    //src: "assets/images/characters/pizzas/f001.png",
    icon: "assets/images/icons/cerebro3.png",
    actions: [ "perder2" ],
    opciones: [ "damage1", "damage4","damage2","damage3"],
    text: 'cuanto es: $$\\frac{{1}}{{2}}+\\frac{{1}}{{2}}=?\$$',
    resp: "\\(\\frac{{1}}{{2}}\\)",
  },


  "f002": {
    name: "Primer suma",
    description: "Suma de mitades",
    //src: "assets/images/characters/pizzas/f001.png",
    icon: "assets/images/icons/cerebro3.png",
    actions: [ "perder1" ],
    opciones: [ "damage0", "damage4","damage2","damage3"],
    text: 'cuanto es: $$\\frac{{1}}{{2}}+\\frac{{1}}{{2}}=?\$$',
    resp: "1"
  }
}