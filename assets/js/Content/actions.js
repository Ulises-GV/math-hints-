window.Actions = {
  damage1: {
    name: "\\(\\frac{{1}}{{2}}\\)", 
    description: "La mitad",
    success: [
      { type: "textMessage", text: "{CASTER} usaste $$\\frac{{1}}{{2}}\$$!", img:" "},
      { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 100}
    ]
  },
  damage2: {
    name: "\\(\\frac{{1}}{{3}}\\)", 
    description: "Una parte de 3",
    success: [
      { type: "textMessage", text: "{CASTER} usaste $$\\frac{{1}}{{3}}\$$!", img:" "},
      { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 100}
    ]
  },
  damage3: {
    name: "\\(\\frac{{1}}{{4}}\\)", 
    description: "Una parte de 4",
    success: [
      { type: "textMessage", text: "{CASTER} usaste $$\\frac{{1}}{{4}}\$$!", img:" "},
      { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 100}
    ]
  },
  damage4: {
    name: "\\(\\frac{{1}}{{5}}\\)", 
    description: "Una parte de 5",
    success: [
      { type: "textMessage", text: "{CASTER} usaste $$\\frac{{1}}{{5}}\$$!", img:" "},
      { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 100}
    ]
  },
  damage5: {
    name: "\\(\\frac{{1}}{{6}}\\)", 
    description: "Una parte de 6",
    success: [
      { type: "textMessage", text: "{CASTER} usaste $$\\frac{{1}}{{6}}\$$!", img:" "},
      { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 100}
    ]
  },
  damage6: {
    name: "\\(\\frac{{2}}{{3}}\\)", 
    description: "dos partes de 3",
    success: [
      { type: "textMessage", text: "{CASTER} usaste $$\\frac{{2}}{{3}}\$$!", img:" "},
      { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 100}
    ]
  },
  damage7: {
    name: "\\(\\frac{{2}}{{4}}\\)", 
    description: "dos partes de 4",
    success: [
      { type: "textMessage", text: "{CASTER} usaste $$\\frac{{2}}{{4}}\$$!", img:" "},
      { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 100}
    ]
  },
  damage8: {
    name: "\\(\\frac{{3}}{{4}}\\)", 
    description: "tres partes de 4",
    success: [
      { type: "textMessage", text: "{CASTER} usaste $$\\frac{{3}}{{4}}\$$!", img:" "},
      { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 100}
    ]
  },
  damage9: {
    name: "\\(\\frac{{2}}{{5}}\\)", 
    description: "dos partes de 5",
    success: [
      { type: "textMessage", text: "{CASTER} usaste $$\\frac{{2}}{{5}}\$$!", img:" "},
      { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 100}
    ]
  },
  damage10: {
    name: "\\(\\frac{{3}}{{5}}\\)", 
    description: "tres partes de 5",
    success: [
      { type: "textMessage", text: "{CASTER} usaste $$\\frac{{3}}{{5}}\$$!", img:" "},
      { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 100}
    ]
  },
  damage11: {
    name: "\\(\\frac{{4}}{{5}}\\)", 
    description: "Cuatro partes de 5",
    success: [
      { type: "textMessage", text: "{CASTER} usaste $$\\frac{{4}}{{5}}\$$!", img:" "},
      { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 100}
    ]
  },
  damage12: {
    name: "\\(\\frac{{5}}{{6}}\\)", 
    description: "Cinco partes de 6",
    success: [
      { type: "textMessage", text: "{CASTER} usaste $$\\frac{{5}}{{6}}\$$!", img:" "},
      { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 100}
    ]
  },
  damage13: {
    name: "\\(\\frac{{7}}{{12}}\\)", 
    description: "siete partes de 12",
    success: [
      { type: "textMessage", text: "{CASTER} usaste $$\\frac{{7}}{{12}}\$$!", img:" "},
      { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 100}
    ]
  },
  damage14: {
    name: "\\(\\frac{{11}}{{12}}\\)", 
    description: "Once partes de 12",
    success: [
      { type: "textMessage", text: "{CASTER} usaste $$\\frac{{11}}{{12}}\$$!", img:" "},
      { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 100}
    ]
  },
  damage0: {
    name: "1", 
    description: "uno ",
    success: [
      { type: "textMessage", text: "{CASTER} usaste 1", img:" "},
      { type: "animation", animation: "glob"},
      { type: "stateChange", damage: 100}
    ]
  },



  igual: {
    name: "igual", 
    description: "Es igual?",
    success: [
      { type: "textMessage", text: "{CASTER} usaste es igual", img:" "},
      { type: "animation", animation: "glob"},
      { type: "stateChange", damage: 100}
    ]
  },
  mayor: {
    name: "mayor", 
    description: "Es mayor?",
    success: [
      { type: "textMessage", text: "{CASTER} usaste es mayor", img:" "},
      { type: "animation", animation: "glob"},
      { type: "stateChange", damage: 100}
    ]
  },
  menor: {
    name: "menor", 
    description: "Es menor",
    success: [
      { type: "textMessage", text: "{CASTER} usaste es menor", img:" "},
      { type: "animation", animation: "glob"},
      { type: "stateChange", damage: 100}
    ]
  },




  perder1: {
    name: "aiuda", 
    description: "causa dano 10",
    success: [
      { type: "textMessage", text: "Incorrecto!", img:" "},
      { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 10}
    ]
  },
  perder2: {
    name: "aiuda", 
    description: "causa dano de 20",
    success: [
      { type: "textMessage", text: "Incorrecto", img:" "},
      { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 20}
    ]
  },
  perder3: {
    name: "aiuda", 
    description: "causa dano 30",
    success: [
      { type: "textMessage", text: "Incorrecto!", img:" "},
      { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 30}
    ]
  },



  saucyStatus: {
    name: "\\(\\frac{{\\sin^2(x)}}{{\\cos(x)}} + \\frac{{\\sqrt{3}}}{{2}} \\cdot \\frac{{\\log(y)}}{{\\sqrt{z}}} = \\frac{{a^2 + b^2}}{{c^2}}\\)",
    description: "Applies the Saucy status",
    targetType: "friendly",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
      { type: "stateChange", status: { type: "saucy", expiresIn: 3 } }
    ]
  },
  clumsyStatus: {
    name: "\\(\\int_{a}^{b} f'(x) \\, dx = f(b) - f(a)\\)",
    description: "Slippery mess of deliciousness",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
      { type: "animation", animation: "glob", color: "#dafd2a" },
      { type: "stateChange", status: { type: "clumsy", expiresIn: 3 } },
      { type: "textMessage", text: "{TARGET} is slipping all around!"},
    ]
  },

  //Items
  item_recoverStatus: {
    name: "Heating Lamp",
    description: "Feeling fresh and warm",
    targetType: "friendly",
    success: [
      { type: "textMessage", text: "{CASTER} uses a {ACTION}!"},
      { type: "stateChange", status: null },
      { type: "textMessage", text: "Feeling fresh!", },
    ]
  },
  item_recoverHp: {
    name: "recuperador",
    targetType: "friendly",
    success: [
      //{ type:"textMessage", text: "{CASTER} sprinkles on some {ACTION}!", },
      { type:"stateChange", recover: 30, },
      { type:"textMessage", text: "Haz usado un recuperador" , img:" "},
    ]
  },
}