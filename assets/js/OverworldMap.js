

class OverworldMap {
  constructor(config) {
    this.overworld = null;
    this.gameObjects = config.gameObjects;
    this.cutsceneSpaces = config.cutsceneSpaces || {};
    this.walls = config.walls || {};

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;

    this.isCutscenePlaying = false;
    this.isPaused = false;

    this.mapWidth = config.mapWidth; // Ancho del mapa en píxeles
    this.mapHeight = config.mapHeight; // Alto del mapa en píxeles
    this.containerWidth = config.containerWidth; // Ancho del contenedor del juego en píxeles
    this.containerHeight = config.containerHeight;

    this.hero = config.gameObjects.hero;
  }

  getHeroPosition() {
    return {
        x: this.hero.x,
        y: this.hero.y
    };
}

drawLowerImage(ctx, hero) {
  const positionX = this.getHeroPosition().x
  const positionY= this.getHeroPosition().y
  //console.log(position.x/8,position.y/8)
    if(hero){
      ctx.drawImage(this.lowerImage, utils.withGrid(10.5)-hero.x, utils.withGrid(18.5)-hero.y,) 
    }else{
      if(direccion==="bottom"){
        ctx.drawImage(this.lowerImage, utils.withGrid(10.5)-positionX, -mapAltura,)
      }else if(direccion==="top"){
        ctx.drawImage(this.lowerImage, utils.withGrid(10.5)-positionX, 0,)
      }else if(direccion==="right"){
        ctx.drawImage(this.lowerImage, -mapAncho , utils.withGrid(18.5)-positionY,)
      }else if(direccion==="left"){
        ctx.drawImage(this.lowerImage, 0, utils.withGrid(18.5)-positionY,)
      }
      else if(direccion==="corner1"){
        ctx.drawImage(this.lowerImage, 0, 0,)
      }
      else if(direccion==="corner2"){
        ctx.drawImage(this.lowerImage, -mapAncho, 0)
      }
      else if(direccion==="corner3"){
        ctx.drawImage(this.lowerImage, -mapAncho, -mapAltura)
      }
      else if(direccion==="corner4"){
        ctx.drawImage(this.lowerImage, 0, -mapAltura)
      }
      else{
        ctx.drawImage(this.lowerImage, -mapAncho,0,)
      }
    }
}

drawUpperImage(ctx, hero) {
  const positionX = this.getHeroPosition().x
  const positionY= this.getHeroPosition().y
    if(hero){
      ctx.drawImage(this.upperImage, utils.withGrid(10.5)-hero.x, utils.withGrid(18.5)-hero.y,) 
    }else{
      if(direccion==="bottom"){
        ctx.drawImage(this.upperImage, utils.withGrid(10.5)-positionX, -mapAltura,)
      }else if(direccion==="top"){
        ctx.drawImage(this.upperImage, utils.withGrid(10.5)-positionX, 0,)
      }else if(direccion==="right"){
        ctx.drawImage(this.upperImage, -mapAncho , utils.withGrid(18.5)-positionY,)
      }else if(direccion==="left"){
        ctx.drawImage(this.upperImage, 0, utils.withGrid(18.5)-positionY,)
      }
      else if(direccion==="corner1"){
        ctx.drawImage(this.upperImage, 0, 0,)
      }
      else if(direccion==="corner2"){
        ctx.drawImage(this.upperImage, -mapAncho, 0)
      }
      else if(direccion==="corner3"){
        ctx.drawImage(this.upperImage, -mapAncho, -mapAltura)
      }
      else if(direccion==="corner4"){
        ctx.drawImage(this.upperImage, 0, -mapAltura)
      }
      else{
        ctx.drawImage(this.upperImage, -mapAncho,0,)
      }
    }
}



  isSpaceTaken(currentX, currentY, direction) {
    const {x,y} = utils.nextPosition(currentX, currentY, direction);
    return this.walls[`${x},${y}`] || false;
  }

  mountObjects() {
    Object.keys(this.gameObjects).forEach(key => {

      let object = this.gameObjects[key];
      object.id = key;

      //TODO: determine if this object should actually mount
      object.mount(this);

    })
  }

  async startCutscene(events) {
    this.isCutscenePlaying = true;

    for (let i=0; i<events.length; i++) {
      const eventHandler = new OverworldEvent({
        event: events[i],
        map: this,
      })
      const result = await eventHandler.init();
      if (result === "LOST_BATTLE") {
        break;
      }
    }
    this.isCutscenePlaying = false;
    Object.values(this.gameObjects).forEach(object => object.doBehaviorEvent(this))
  }

  checkForActionCutscene() {
    const hero = this.gameObjects["hero"];
    const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction);
    const match = Object.values(this.gameObjects).find(object => {
      return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`
    });
    if (!this.isCutscenePlaying && match && match.talking.length) {

      const relevantScenario = match.talking.find(scenario => {
        return (scenario.required || []).every(sf => {
          return playerState.storyFlags[sf]
        })
      })
      relevantScenario && this.startCutscene(relevantScenario.events)
    }
  }

  checkForFootstepCutscene() {
    const hero = this.gameObjects["hero"];
    const match = this.cutsceneSpaces[ `${hero.x},${hero.y}` ];
    if (!this.isCutscenePlaying && match) {
      this.startCutscene( match[0].events )
    }
  }

  addWall(x,y) {
    this.walls[`${x},${y}`] = true;
  }
  removeWall(x,y) {
    delete this.walls[`${x},${y}`]
  }
  moveWall(wasX, wasY, direction) {
    this.removeWall(wasX, wasY);
    const {x,y} = utils.nextPosition(wasX, wasY, direction);
    this.addWall(x,y);
  }

}

window.OverworldMaps = {
  DemoRoom: {
    id: "DemoRoom",
    backgroundMusic: "assets/corridos/chona.mp3",
    lowerSrc: "assets/images/maps/adentro2.png",
    upperSrc: "assets/images/maps/Map0051.png",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(10.5),
        y: utils.withGrid(25),
      }),
      npcA: new Person({
        x: utils.withGrid(19.5),
        y: utils.withGrid(10),
        src: "assets/images/characters/people/npcb.png",
        behaviorLoop: [
          { type: "stand", direction: "down", time: 100, },
          { type: "stand", direction: "right", time: 400, },
          { type: "stand", direction: "down", time: 700, },
          { type: "stand", direction: "right", time: 600, },
          { type: "stand", direction: "down", time: 200, },
          { type: "stand", direction: "left", time: 900, },
          { type: "stand", direction: "down", time: 300, },
          { type: "stand", direction: "right", time: 600, },
          { type: "stand", direction: "down", time: 400, },
          { type: "stand", direction: "left", time: 100, },
        ],
        talking: [
          {
            required: ["streetBattle2"],
            events: [
              { type: "textMessage", text: "Por fin has aprendido a sumar fracciones, recuerda seguir practicando", faceHero: "npcA", img:"assets/images/characters/people/rostros/rostrob.png" },
            ]
          },
          {
            events: [
              { type: "textMessage", text: 'Es tiempo de que conozcas más de la vida, ve a buscar al <span style="color:red;"> profesor </span> ', faceHero: "npcA", img:"assets/images/characters/people/rostros/rostrob.png" },
            ]
          }
        ]
      }),
      npcB: new Person({
        x: utils.withGrid(-3.5),
        y: utils.withGrid(16),
        src: "assets/images/characters/people/npcx.png",
        behaviorLoop: [
          { type: "stand", direction: "up", time: 500, },
          { type: "stand", direction: "right", time: 100, },
          { type: "stand", direction: "up", time: 1700, },
          { type: "stand", direction: "right", time: 200, },
          { type: "stand", direction: "up", time: 1200, },
          { type: "stand", direction: "right", time: 100, },
          { type: "stand", direction: "up", time: 300, },
          { type: "stand", direction: "right", time: 300, },
          { type: "stand", direction: "up", time: 400, },
          { type: "stand", direction: "left", time: 100, },
        ],
        talking: [
          {
            required: ["streetBattle2"],
            events: [
              { type: "textMessage", text: "Eso es, sigue asi y llegaras muy lejos", faceHero: "npcB", img:"assets/images/characters/people/rostros/rostrox.png" },
            ]
          },
          {
            events: [
              { type: "textMessage", text: 'Dicen que el <span style="color:red;"> profesor </span> ha ido al <span style="color:green;"> mercado </span> por insumos', faceHero: "npcA", img:"assets/images/characters/people/rostros/rostrox.png" },
              
            ]
          }
        ]
      }),
      /*npcC: new Person({
        x: utils.withGrid(4),
        y: utils.withGrid(8),
        src: "/images/characters/people/npc1.png",
        behaviorLoop: [
          { type: "stand", direction: "left", time: 500, },
          { type: "stand", direction: "down", time: 500, },
          { type: "stand", direction: "right", time: 500, },
          { type: "stand", direction: "up", time: 500, },
          { type: "walk", direction: "left",  },
          { type: "walk", direction: "down",  },
          { type: "walk", direction: "right",  },
          { type: "walk", direction: "up",  },
        ],
      }),
      npcB: new Person({
        x: utils.withGrid(8),
        y: utils.withGrid(5),
        
        // behaviorLoop: [
        //   { type: "walk",  direction: "left" },
        //   { type: "stand",  direction: "up", time: 800 },
        //   { type: "walk",  direction: "up" },
        //   { type: "walk",  direction: "right" },
        //   { type: "walk",  direction: "down" },
        // ]
      }),
     */
    },
    walls: {
      
      [utils.asGridCoord(4.5,7)] : true,
      [utils.asGridCoord(5.5,7)] : true,
      [utils.asGridCoord(6.5,7)] : true,
      [utils.asGridCoord(7.5,7)] : true,
      [utils.asGridCoord(8.5,7)] : true,
      [utils.asGridCoord(9.5,7)] : true,
      [utils.asGridCoord(10.5,7)] : true,
      [utils.asGridCoord(3.5,9)] : true,
      [utils.asGridCoord(3.5,8)] : true,
      [utils.asGridCoord(2.5,9)] : true,
      [utils.asGridCoord(1.5,9)] : true,
      [utils.asGridCoord(1.5,10)] : true,
      [utils.asGridCoord(1.5,11)] : true,
      [utils.asGridCoord(11.5,7)] : true,
      [utils.asGridCoord(12.5,7)] : true,
      [utils.asGridCoord(13.5,7)] : true,
      [utils.asGridCoord(14.5,7)] : true,
      [utils.asGridCoord(15.5,8)] : true,
      [utils.asGridCoord(15.5,9)] : true,
      [utils.asGridCoord(15.5,10)] : true,
      [utils.asGridCoord(15.5,11)] : true,
      [utils.asGridCoord(15.5,12)] : true,
      [utils.asGridCoord(15.5,13)] : true,
      [utils.asGridCoord(15.5,14)] : true,
      [utils.asGridCoord(2.5,12)] : true,
      [utils.asGridCoord(3.5,12)] : true,
      [utils.asGridCoord(3.5,13)] : true,
      [utils.asGridCoord(3.5,14)] : true,
      [utils.asGridCoord(3.5,15)] : true,
      [utils.asGridCoord(2.5,15)] : true,
      [utils.asGridCoord(1.5,15)] : true,
      [utils.asGridCoord(0.5,15)] : true,
      [utils.asGridCoord(-0.5,15)] : true,
      [utils.asGridCoord(-0.5,15)] : true,
      [utils.asGridCoord(-1.5,15)] : true,
      [utils.asGridCoord(-2.5,15)] : true,
      [utils.asGridCoord(-3.5,15)] : true,
      [utils.asGridCoord(-4.5,15)] : true,
      [utils.asGridCoord(-5.5,15)] : true,
      [utils.asGridCoord(-6.5,15)] : true,
      [utils.asGridCoord(-7.5,16)] : true,
      [utils.asGridCoord(-7.5,17)] : true,
      [utils.asGridCoord(-6.5,18)] : true,
      [utils.asGridCoord(-5.5,18)] : true,
      [utils.asGridCoord(-5.5,19)] : true,
      [utils.asGridCoord(-5.5,20)] : true,
      [utils.asGridCoord(-5.5,21)] : true,
      [utils.asGridCoord(-6.5,21)] : true,
      [utils.asGridCoord(-7.5,22)] : true,
      [utils.asGridCoord(-7.5,23)] : true,
      [utils.asGridCoord(-7.5,24)] : true,
      [utils.asGridCoord(-7.5,25)] : true,
      [utils.asGridCoord(-7.5,26)] : true,
      [utils.asGridCoord(-6.5,26)] : true,
      [utils.asGridCoord(-5.5,26)] : true,
      [utils.asGridCoord(-4.5,26)] : true,
      [utils.asGridCoord(-3.5,26)] : true,
      [utils.asGridCoord(-3.5,27)] : true,
      [utils.asGridCoord(-3.5,28)] : true,
      [utils.asGridCoord(-2.5,29)] : true,
      [utils.asGridCoord(-1.5,29)] : true,
      [utils.asGridCoord(-0.5,29)] : true,
      [utils.asGridCoord(0.5,29)] : true,
      [utils.asGridCoord(0.5,30)] : true,
      [utils.asGridCoord(1.5,30)] : true,
      [utils.asGridCoord(2.5,30)] : true,
      [utils.asGridCoord(3.5,30)] : true,
      [utils.asGridCoord(4.5,30)] : true,
      [utils.asGridCoord(5.5,30)] : true,
      [utils.asGridCoord(6.5,30)] : true,
      [utils.asGridCoord(7.5,30)] : true,
      [utils.asGridCoord(8.5,30)] : true,
      [utils.asGridCoord(9.5,30)] : true,
      [utils.asGridCoord(9.5,31)] : true,
      [utils.asGridCoord(9.5,32)] : true,
      [utils.asGridCoord(9.5,33)] : true,
      [utils.asGridCoord(9.5,34)] : true,
      [utils.asGridCoord(11.5,34)] : true,
      [utils.asGridCoord(11.5,33)] : true,
      [utils.asGridCoord(11.5,32)] : true,
      [utils.asGridCoord(11.5,31)] : true,
      [utils.asGridCoord(11.5,30)] : true,
      [utils.asGridCoord(12.5,30)] : true,
      [utils.asGridCoord(13.5,30)] : true,
      [utils.asGridCoord(14.5,30)] : true,
      [utils.asGridCoord(15.5,30)] : true,
      [utils.asGridCoord(16.5,30)] : true,
      [utils.asGridCoord(17.5,30)] : true,
      [utils.asGridCoord(18.5,30)] : true,
      [utils.asGridCoord(19.5,30)] : true,
      [utils.asGridCoord(20.5,30)] : true,
      [utils.asGridCoord(21.5,30)] : true,
      [utils.asGridCoord(22.5,30)] : true,
      [utils.asGridCoord(23.5,30)] : true,
      [utils.asGridCoord(24.5,30)] : true,
      [utils.asGridCoord(25.5,30)] : true,
      [utils.asGridCoord(26.5,30)] : true,
      [utils.asGridCoord(27.5,30)] : true,
      [utils.asGridCoord(28.5,28)] : true,
      [utils.asGridCoord(28.5,29)] : true,
      [utils.asGridCoord(27.5,27)] : true,
      [utils.asGridCoord(26.5,27)] : true,
      [utils.asGridCoord(26.5,26)] : true,
      [utils.asGridCoord(26.5,25)] : true,
      [utils.asGridCoord(25.5,24)] : true,
      [utils.asGridCoord(24.5,25)] : true,
      [utils.asGridCoord(23.5,25)] : true,
      [utils.asGridCoord(22.5,25)] : true,
      [utils.asGridCoord(21.5,26)] : true,
      [utils.asGridCoord(20.5,26)] : true,
      [utils.asGridCoord(19.5,27)] : true,
      [utils.asGridCoord(19.5,28)] : true,
      [utils.asGridCoord(18.5,28)] : true,
      [utils.asGridCoord(17.5,28)] : true,
      [utils.asGridCoord(16.5,28)] : true,
      [utils.asGridCoord(15.5,28)] : true,
      [utils.asGridCoord(15.5,27)] : true,
      [utils.asGridCoord(15.5,26)] : true,
      [utils.asGridCoord(15.5,25)] : true,
      [utils.asGridCoord(15.5,24)] : true,
      [utils.asGridCoord(15.5,23)] : true,
      [utils.asGridCoord(15.5,22)] : true,
      [utils.asGridCoord(15.5,21)] : true,
      [utils.asGridCoord(15.5,20)] : true,
      [utils.asGridCoord(15.5,19)] : true,
      [utils.asGridCoord(15.5,18)] : true,
      [utils.asGridCoord(16.5,18)] : true,
      [utils.asGridCoord(17.5,18)] : true,
      [utils.asGridCoord(18.5,18)] : true,
      [utils.asGridCoord(19.5,18)] : true,
      [utils.asGridCoord(20.5,18)] : true,
      [utils.asGridCoord(21.5,18)] : true,
      [utils.asGridCoord(22.5,18)] : true,
      [utils.asGridCoord(23.5,18)] : true,
      [utils.asGridCoord(24.5,18)] : true,
      [utils.asGridCoord(25.5,18)] : true,
      [utils.asGridCoord(26.5,18)] : true,
      [utils.asGridCoord(27.5,18)] : true,
      [utils.asGridCoord(28.5,17)] : true,
      [utils.asGridCoord(28.5,16)] : true,
      [utils.asGridCoord(28.5,15)] : true,
      [utils.asGridCoord(28.5,14)] : true,
      [utils.asGridCoord(28.5,13)] : true,
      [utils.asGridCoord(28.5,12)] : true,
      [utils.asGridCoord(28.5,11)] : true,
      [utils.asGridCoord(27.5,11)] : true,
      [utils.asGridCoord(26.5,11)] : true,
      [utils.asGridCoord(25.5,11)] : true,
      [utils.asGridCoord(24.5,11)] : true,
      [utils.asGridCoord(24.5,10)] : true,
      [utils.asGridCoord(24.5,9)] : true,
      [utils.asGridCoord(24.5,8)] : true,
      [utils.asGridCoord(23.5,7)] : true,
      [utils.asGridCoord(22.5,8)] : true,
      [utils.asGridCoord(22.5,9)] : true,
      [utils.asGridCoord(21.5,9)] : true,
      [utils.asGridCoord(20.5,9)] : true,
      [utils.asGridCoord(19.5,9)] : true,
      [utils.asGridCoord(18.5,9)] : true,
      [utils.asGridCoord(17.5,10)] : true,
      [utils.asGridCoord(17.5,11)] : true,
      [utils.asGridCoord(17.5,12)] : true,
      [utils.asGridCoord(17.5,13)] : true,
      [utils.asGridCoord(17.5,14)] : true,
      [utils.asGridCoord(17.5,15)] : true,
      [utils.asGridCoord(16.5,15)] : true,
      [utils.asGridCoord(15.5,15)] : true,
      [utils.asGridCoord()] : true,

      [utils.asGridCoord(10.5,17)] : true,
      [utils.asGridCoord(9.5,17)] : true,
      [utils.asGridCoord(8.5,17)] : true,
      [utils.asGridCoord(11.5,17)] : true,
      [utils.asGridCoord(7.5,17)] : true,
      [utils.asGridCoord(6.5,17)] : true,
      [utils.asGridCoord(5.5,17)] : true,
      [utils.asGridCoord(5.5,16)] : true,
      [utils.asGridCoord(5.5,15)] : true,
      [utils.asGridCoord(5.5,14)] : true,
      [utils.asGridCoord(5.5,13)] : true,
      [utils.asGridCoord(5.5,12)] : true,
      [utils.asGridCoord(5.5,11)] : true,
      [utils.asGridCoord(6.5,11)] : true,
      [utils.asGridCoord(7.5,11)] : true,
      [utils.asGridCoord(8.5,11)] : true,
      [utils.asGridCoord(9.5,11)] : true,
      [utils.asGridCoord(10.5,11)] : true,
      [utils.asGridCoord(11.5,11)] : true,
      [utils.asGridCoord(11.5,12)] : true,
      [utils.asGridCoord(11.5,13)] : true,
      [utils.asGridCoord(11.5,14)] : true,
      [utils.asGridCoord(11.5,15)] : true,
      [utils.asGridCoord(11.5,16)] : true,
      [utils.asGridCoord(11.5,17)] : true,
    },
    cutsceneSpaces: {
      /*[utils.asGridCoord(7,4)]: [
        {
          events: [
            { who: "npcB", type: "walk",  direction: "left" },
            { who: "npcB", type: "stand",  direction: "up", time: 500 },
            { type: "textMessage", text:"You can't be in there!"},
            { who: "npcB", type: "walk",  direction: "right" },
            { who: "hero", type: "walk",  direction: "down" },
            { who: "hero", type: "walk",  direction: "left" },
          ]
        }
      ],*/
      [utils.asGridCoord(10.5,33)]: [
        {
          events: [
            { 
              type: "changeMap", 
              map: "Kitchen",
              //map: "Mundo1",
              x: utils.withGrid(14),
              y: utils.withGrid(30), 
              direction: "down"
              
            },
          ]
        }
      ]
    }
  },
  Kitchen: {
    id: "Kitchen",
    backgroundMusic: "assets/corridos/chona.mp3",
   // id: "Mundo1",
    lowerSrc: "assets/images/maps/casawey.png",
    upperSrc: "assets/images/maps/casaup.png",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
       // x: utils.withGrid(10),
       // y: utils.withGrid(5),
      }),
      kitchenNpcA: new Person({
        x: utils.withGrid(27),
        y: utils.withGrid(14),
        src: "assets/images/characters/people/npcf.png",
        behaviorLoop: [
          { type: "stand", direction: "right", time: 500, },
         // { type: "stand", direction: "left", time: 500, },
          { type: "stand", direction: "up", time: 1400, },
          { type: "stand", direction: "right", time: 1000, },
          { type: "stand", direction: "up", time: 1500, },
          { type: "stand", direction: "left", time: 300, },
          { type: "stand", direction: "up", time: 300, },
          
        ],
        talking: [
          {
            events: [
              { type: "textMessage", text: 'Dicen que solo los guerreros <span style="color:red;">nivel 5</span> obtendrán un poder increíble al acercarse a la estatua de oro ', img:"assets/images/characters/people/rostros/rostrofff.png"},
              //{ type: "battle", enemyId: "beth" }
            ]
          }
        ]
      }),
      kitchenNpcB: new Person({
        x: utils.withGrid(8),
        y: utils.withGrid(36),
        src: "assets/images/characters/people/npcgg.png",
        behaviorLoop: [
          { type: "stand", direction: "right", time: 500, },
         // { type: "stand", direction: "left", time: 500, },
          /*{ type: "stand", direction: "up", time: 1400, },
          { type: "stand", direction: "right", time: 1000, },
          { type: "stand", direction: "up", time: 1500, },
          { type: "stand", direction: "left", time: 300, },
          { type: "stand", direction: "up", time: 300, },*/
          
        ],
        talking: [
          {
            required: ["streetBattle"],
            events: [
              { type: "textMessage", text: '¡Ya conoces nuevos lugares!', faceHero: "kitchenNpcB", img:"assets/images/characters/people/rostros/rostroggg.png" },
              { type: "textMessage", text: 'Y parece que ya conoces al profesor... dime, ¿te ha enseñado algo nuevo?', faceHero: "kitchenNpcB", img:"assets/images/characters/people/rostros/rostroggg.png" },
            ]
          },
          {
            events: [
              { type: "textMessage", text: 'Estás a punto de conocer mundos nuevos, a la derecha encontrarás en <span style="color:red;">mercado</span>, y al fondo a la izquierda el <span style="color:red;">pueblo</span>', faceHero: "kitchenNpcB", img:"assets/images/characters/people/rostros/rostroggg.png" },
              { type: "textMessage", text: 'El profesor estará feliz de conocerte, creo que se dirigía al mercado....', faceHero: "kitchenNpcB", img:"assets/images/characters/people/rostros/rostroggg.png" },
            ]
          }
        ]
      }),
      kitchenNpcC: new Person({
        x: utils.withGrid(-4),
        y: utils.withGrid(12),
        src: "assets/images/characters/people/npc3.png",
        behaviorLoop: [
          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },
          { type: "stand", direction: "right" , time: 700 },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },
          { type: "stand", direction: "right" , time: 1000 },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },
          { type: "stand", direction: "right" , time: 800 },
          { type: "walk", direction: "down" },
          { type: "walk", direction: "down" },
          { type: "stand", direction: "down" , time: 1000 },
          { type: "walk", direction: "left" },
          { type: "walk", direction: "left" },
          { type: "walk", direction: "left" },
          { type: "walk", direction: "left" },
          { type: "walk", direction: "left" },
          { type: "stand", direction: "left" , time: 1700 },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },
          { type: "stand", direction: "right" , time: 400 },
          { type: "stand", direction: "up" , time: 700 },
          { type: "stand", direction: "right" , time: 200 },
          { type: "stand", direction: "down" , time: 700 },
          { type: "stand", direction: "right" , time: 300 },
          { type: "walk", direction: "left" },
          { type: "walk", direction: "left" },
          { type: "walk", direction: "left" },
          { type: "walk", direction: "left" },
          { type: "walk", direction: "left" },
          { type: "walk", direction: "left" },
          { type: "walk", direction: "left" },
          { type: "walk", direction: "left" },
          { type: "stand", direction: "left" , time: 500 },
          { type: "walk", direction: "left" },
          { type: "walk", direction: "left" },
          { type: "walk", direction: "left" },
          { type: "walk", direction: "left" },
          { type: "walk", direction: "left" },
          { type: "walk", direction: "left" },
          { type: "walk", direction: "left" },
          { type: "walk", direction: "left" },
          { type: "walk", direction: "left" },
          { type: "walk", direction: "left" },
          { type: "stand", direction: "left" , time: 1000 },
          { type: "walk", direction: "up" },
          { type: "walk", direction: "up" },
          { type: "stand", direction: "up" , time: 300 },
          { type: "stand", direction: "right" , time: 1000 },
          { type: "stand", direction: "up" , time: 200 },
          { type: "stand", direction: "left" , time: 200 },
          { type: "walk", direction: "left" },
          { type: "walk", direction: "left" },
          { type: "walk", direction: "left" },
          { type: "walk", direction: "left" },
          { type: "walk", direction: "left" },
          { type: "walk", direction: "left" },
          { type: "stand", direction: "left" , time: 1500 },
        ],
        talking: [
          {
            required: ["streetBattle2"],
            events: [
              { type: "textMessage", text: 'Así que crees saber mucho? ¡esto apenas comienza!', img:"assets/images/characters/people/rostros/npc33.png", faceHero: "kitchenNpcC" },
            ]
          },
          {
            events: [
              { type: "textMessage", text: "Si logro encontrar la solución a este problema: $$H^{p,q}(X, \\mathbb{C}) \\cap H^{2k}(X, \\mathbb{Q}) = \\bigoplus_{r+s=k} \\mathrm{Gr}^W_{p+r}(H^{p+r, q+s}(X)))\$$", img:"assets/images/characters/people/rostros/npc33.png", faceHero: "kitchenNpcC"},
              { type: "textMessage", text: '¡Por fin podría ser <span style="color: green;">Millonario!...  </span>.', img:"assets/images/characters/people/rostros/npc33.png", faceHero: "kitchenNpcC" },
              { type: "textMessage", text: '...... ¿Que no sabes que es?', img:"assets/images/characters/people/rostros/npc33.png", faceHero: "kitchenNpcC" },
              { type: "textMessage", text: 'Es la conjetura de Hodge, ¡uno de los problemas del milenio!', img:"assets/images/characters/people/rostros/npc33.png", faceHero: "kitchenNpcC" },
              { type: "textMessage", text: '...... ¿Que no sabes qué son los problemas del milenio?.....', img:"assets/images/characters/people/rostros/npc33.png", faceHero: "kitchenNpcC" },
              { type: "textMessage", text: 'Ahora no tengo tiempo de explicarte, ve a aprender lo básico primero, necesitas estudiar mucho', img:"assets/images/characters/people/rostros/npc33.png", },
              { who: "kitchenNpcC", type: "stand",  direction: "down" },
             
            ]
          }
        ]
      }),
    },
    
    cutsceneSpaces: {
       
      [utils.asGridCoord(14,28)]: [
        {
          events: [
            { 
              type: "changeMap", 
              map: "DemoRoom",
              x: utils.withGrid(10.5),
              y: utils.withGrid(32),
              direction: "up"
            }
          ]
        }
      ],
      [utils.asGridCoord(11,41)]: [
        {
          events: [
            { 
              type: "changeMap", 
              map: "DiningRoom",
              x: utils.withGrid(9),
              y: utils.withGrid(3),
              direction: "down"
            }
          ]
        }
      ],
      [utils.asGridCoord(12,41)]: [
        {
          events: [
            { 
              type: "changeMap", 
              map: "DiningRoom",
              x: utils.withGrid(9),
              y: utils.withGrid(3),
              direction: "down"
            }
          ]
        }
      ],
      [utils.asGridCoord(13,41)]: [
        {
          events: [
            { 
              type: "changeMap", 
              map: "DiningRoom",
              x: utils.withGrid(9),
              y: utils.withGrid(3),
              direction: "down"
            }
          ]
        }
      ],
      [utils.asGridCoord(14,41)]: [
        {
          events: [
            { 
              type: "changeMap", 
              map: "DiningRoom",
              x: utils.withGrid(9),
              y: utils.withGrid(3),
              direction: "down"
            }
          ]
        }
      ],
     
    },
    walls: {
      [utils.asGridCoord(32.5,1)]: true,
      
    },
    walls: function() {
      let walls = {};
      ["16,41","16,40", "16,39", "16,38", "16,37", "16,36", "16,35", "16,34", "16,33", "17,33", "18,33",  "19,33", "20,33", "21,33", "22,33", "23,33", "24,33", "25,33", "26,33", "27,33", "28,33", "29,33", "30,33",  
      "31,32", "31,31", "31,30", "31,29", "31,28", "31,27", "31,26", "31,25",  "31,24", "31,23", "31,22", "31,21", "31,20", "31,19", "31,18", "31,17", "31,16", "31,15", "32,15", "33,15", "34,15", "35,15", "36,15", "37,14", "37,13", "37,12", "36,11", "35,11", "34,11", "33,11", "33,10", "33,9", "33,8", "33,7", "33,6", "33,5", "33,4", "33,2", "33,1", "33,0", "32,0",
      "31,0", "31,1", "31,2", "31,3", "31,4", "31,5", "31,6", "31,7", "31,8", "31,9", "31,10", "31,11", "30,11", "29,11", "28,11", "27,11", "26,11", "25,11", "24,11", "23,11", "22,11", "21,11", "20,11", "19,11", "18,11", "17,11", "16,11", "15,11", "14,11", "13,11", "12,11", "11,11", "10,11", "9,11", "8,11", "7,11", "6,11", "5,11", "4,11", "3,11", "2,11", "1,11", "0,11", "-1,11", "-2,11", "-3,11", "-4,11", "-5,11",
      "-6,12", "-6,13", "-6,14", "-5,15", "-4,15", "-3,15", "-2,15", "-1,15", "0,15", "1,15", "2,15", "3,15", "4,15", "5,15", "6,15", "7,15", "8,15", "9,15", "10,15", "11,15", "12,15", "13,15", "14,15", "15,15", "16,15", "17,15", "18,15", "19,15", "20,15", "21,15", "22,15", "23,15", "24,15", "25,15", "26,15", "27,15", "27,16",
      "-2,17", "-1,17", "0,17", "1,17", "2,17", "3,17", "4,17", "5,17", "6,17", "7,17", "8,17", "9,17", "10,17", "11,17", "12,17", "13,17", "14,17", "15,17", "16,17", "17,17", "18,17", "19,17", "20,17", "21,17", "22,17", "23,17", "24,17", "25,17", "26,17", "27,17", 
      "-3,18", "-3,19", "-3,20", "-3,21", "-3,22", "-3,23", "-3,24", "-3,25", "-3,26", "-3,27", "-3,28", "-3,29", "-3,30", "-3,31", "-3,32", "-2,33", "-1,33", "0,33", "1,33", "2,33", "3,33", "4,33", "5,33", "6,33", "6,34", "6,35", "6,36", "6,37", "6,38", "6,39", "6,40", "6,41", "7,41", "8,41", "9,41", "10,41", "15,41", "16,41",
      "13,28", "15,28", "13,29", "15,29", "16,29", "17,29", "18,29", "19,29", "20,29", "21,29", "22,29", "23,29", "24,29", "25,29",   "12,29", "11,29", "10,29", "9,29", "8,29", "7,29", "6,29", "5,29", "4,29", "3,29", "3,28", "3,27", "3,26", "3,25", "3,24", "3,23", "3,22", "3,21",    "4,21", "5,21", "6,21", "7,21", "8,21", "9,21", "10,21", "11,21", "12,21", "13,21", "14,21", "15,21", "16,21", "17,21", "18,21", "19,21", "20,21", "21,21", "22,21", "23,21", "24,21", "25,21", "25,22",  "25,23",  "25,24",  "25,25",  "25,26",  "25,27",  "25,28",   
      ].forEach(coord => {
        let [x,y] = coord.split(",");
        walls[utils.asGridCoord(x,y)] = true;
      })
      return walls;
    }(),
  },
  Street: {
    id: "Street",
    lowerSrc: "assets/images/maps/market.png",
    upperSrc: "assets/images/maps/marketup.png",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        //x: utils.withGrid(30),
        //y: utils.withGrid(10),
      }),
      streetNpcA: new Person({
        x: utils.withGrid(39),
        y: utils.withGrid(29),
        src: "assets/images/characters/people/npcv.png",
        behaviorLoop: [
          { type: "stand", direction: "right", time: 1400, },
          { type: "stand", direction: "up", time: 900, },
        ],
        talking: [
          {
            required: ["PrimerPlatica2",],
            events: [
              { type: "textMessage", text: "Recuerda las matemáticas nos sirven para comparar entre resultados de una manera exacta que muchas veces no podemos identificar tan fácilmente a simple vista o intuición", faceHero: "streetNpcC" ,img:"assets/images/characters/people/rostros/rostrovv.png"},
            ]
          },
          {
            required: ["PrimerPlatica1",],
            events: [
              { type: "textMessage", text: "¿Quieres practicar?", faceHero: "streetNpcC",img:"assets/images/characters/people/rostros/rostrovv.png" },
              { type: "textMessage", text: "Resolvamos este problema:", faceHero: "streetNpcC" ,img:"assets/images/characters/people/rostros/rostrovv.png"},
              { type: "textMessage", text: "¿Que es mejor? tener $$\\frac{{3}}{{4}}\$$ pastel1 + $$\\frac{{1}}{{6}}\$$ pastel1" , faceHero: "streetNpcC",img:"assets/images/characters/people/rostros/rostrovv.png" },
              { type: "textMessage", text: "O tener $$\\frac{{1}}{{4}}\$$ pastel1 + $$\\frac{{2}}{{3}}\$$ pastel1" , faceHero: "streetNpcC" ,img:"assets/images/characters/people/rostros/rostrovv.png"},
              { type: "battle", enemyId: "BattleVendedora" },
              { type: "textMessage", text: "Como te daras cuenta es igual de conveniente, solo son dos formas de obtener el mismo resultado aunque a simple vista parezca que el resultado será muy diferente", faceHero: "streetNpcC",img:"assets/images/characters/people/rostros/rostrovv.png" },
              { type: "addStoryFlag", flag: "PrimerPlatica2"},
            ]
          },
          {
            required: ["PrimerPlatica", "streetBattle2"],
            events: [
              { type: "textMessage", text: "Parace que ya has aprendido bastante...", faceHero: "streetNpcC" ,img:"assets/images/characters/people/rostros/rostrovv.png"},
              { type: "textMessage", text: "Las fracciones son muy útiles y las usarás siempre al igual que los numeros enteros $$0,1,2,3,4,5,6,7,8,9$$", faceHero: "streetNpcC" ,img:"assets/images/characters/people/rostros/rostrovv.png"},
              { type: "textMessage", text: "Para medir, calcular y contar de una mejor manera", faceHero: "streetNpcC" ,img:"assets/images/characters/people/rostros/rostrovv.png"},
              { type: "addStoryFlag", flag: "PrimerPlatica1"},
            ]
          },
          {
            events: [
              { type: "textMessage", text: "Algunos piensan que el vendedor de al  lado les roba, pero esto es mentira", faceHero: "streetNpcA" ,img:"assets/images/characters/people/rostros/rostrovv.png"},
              { type: "textMessage", text: "Te explicare:", faceHero: "streetNpcA" ,img:"assets/images/characters/people/rostros/rostrovv.png"},
              { type: "textMessage", text: "Cuándo quieres sumar fracciones lo que debes hacer es lo mismo que haces al sumar dos números", faceHero: "streetNpcA" ,img:"assets/images/characters/people/rostros/rostrovv.png" },
              { type: "textMessage", text: "lo único que debes de considerar es que ahora en vez de sumar enteros estas sumando partes, es decir, puedes sumar mitades, tercios, cuartos, quintos, sextos, etc", faceHero: "streetNpcA" ,img:"assets/images/characters/people/rostros/rostrovv.png"},
              { type: "textMessage", text: "¿Que qué es esto?, digamos que un medio = $$\\frac{{1}}{{2}}\$$ es una mitad o la mitad de un objeto dividido en dos partes" , faceHero: "streetNpcA" ,img:"assets/images/characters/people/rostros/rostrovv.png" },
              { type: "textMessage", text: "Un tercio = $$\\frac{{1}}{{3}}\$$ es una parte de un objeto dividido en tres partes" , faceHero: "streetNpcA" ,img:"assets/images/characters/people/rostros/rostrovv.png" },
              { type: "textMessage", text: "Un cuarto = $$\\frac{{1}}{{4}}\$$ es una parte de un objeto dividido en cuatro partes" , faceHero: "streetNpcA" ,img:"assets/images/characters/people/rostros/rostrovv.png"},
              { type: "textMessage", text: "Un quinto = $$\\frac{{1}}{{5}}\$$ es una parte de un objeto dividido en cinco partes, y asi sucesivamente..." , faceHero: "streetNpcA" ,img:"assets/images/characters/people/rostros/rostrovv.png"},
              { type: "textMessage", text: "... Entendido?...." , faceHero: "streetNpcA" ,img:"assets/images/characters/people/rostros/rostrovv.png"},
              { type: "textMessage", text: "Te preguntarás como sumar fracciones entonces.... para hacer esto empecemos por lo básico:," , faceHero: "streetNpcA" ,img:"assets/images/characters/people/rostros/rostrovv.png" },
              { type: "textMessage", text: "Si tenemos un pastel  pastel1  y lo partimos en dos partes entonces tenemos dos partes o dos rebanadas grandes:" , faceHero: "streetNpcA" ,img:"assets/images/characters/people/rostros/rostrovv.png"},
              { type: "textMessage", text: "$$\\frac{{1}}{{2}}+\\frac{{1}}{{2}}=1\$$ pastel1" , faceHero: "streetNpcA" ,img:"assets/images/characters/people/rostros/rostrovv.png"}, 
              { type: "textMessage", text: "Si lo partimos en 3 $$\\frac{{1}}{{3}}+\\frac{{1}}{{3}}+\\frac{{1}}{{3}}=1\$$ pastel1" , faceHero: "streetNpcA" ,img:"assets/images/characters/people/rostros/rostrovv.png"},
              { type: "textMessage", text: "Si lo partimos en 4 $$\\frac{{1}}{{4}}+\\frac{{1}}{{4}}+\\frac{{1}}{{4}}+\\frac{{1}}{{4}}=1\$$ pastel1   , y asi continuamos" , faceHero: "streetNpcA" ,img:"assets/images/characters/people/rostros/rostrovv.png"},
              { type: "addStoryFlag", flag: "PrimerPlatica"},
            ]
          }
        ]
      }),
      streetNpcC: new Person({
        x: utils.withGrid(19),
        y: utils.withGrid(13),
        src: "assets/images/characters/people/npcw.png",
        behaviorLoop: [
          { type: "stand", direction: "down", time: 900, },
        ],
        talking: [
          {
            events: [
              { type: "textMessage", text: '¡Por fin un cliente!.... ', faceHero: "streetNpcC", img: "assets/images/characters/people/rostros/rostrow.png" },
              { type: "textMessage", text: "Oooo... ya veo, :( solo quieres que te explique acerca de mi negocio...  ", faceHero: "streetNpcC", img: "assets/images/characters/people/rostros/rostroww.png" },
              { who: "streetNpcC", type: "stand", direction: "up", time: 400 },
              { type: "textMessage", text: 'Bien.....  vendo tablas de madera tablas1 y clavos clavos1 para construir casas, en mi negocio es común que las personas requieran tablas y clavos de distintos <span style="color: brown;">tamaños y medidas</span>  ', img: "assets/images/characters/people/rostros/rostrow.png" },
              { type: "textMessage", text: 'Las pincipales medidas usan <span style="color: brown;">metros o pulgadas,</span> y es muy común necesitar fracciones para medir y encontrar lo que necesitamos ya que cada proyecto es diferente', faceHero: "streetNpcC" , img: "assets/images/characters/people/rostros/rostrow.png" },
              { type: "textMessage", text: 'Podemos tener tablas de $$\\frac{{1}}{{2}}m\$$, $$\\frac{{1}}{{3}}m\$$, $$\\frac{{1}}{{4}}m\$$, $$\\frac{{1}}{{5}}m\$$, etc. la m solo significa metros ', faceHero: "streetNpcC"  , img: "assets/images/characters/people/rostros/rostrow.png"},
              { type: "textMessage", text: 'Pero también podemos tener tablas de  $$\\frac{{2}}{{3}}m\$$, $$\\frac{{3}}{{4}}m\$$, $$\\frac{{3}}{{2}}m\$$, $$\\frac{{4}}{{5}}m\$$ o cualquier combinación posible ', faceHero: "streetNpcC", img: "assets/images/characters/people/rostros/rostrow.png" },
              { type: "textMessage", text: 'La forma como podemos interpretar esto es muy sencilla, por ejemplo $$\\frac{{2}}{{3}}m\$$ es lo mismo que decir que medimos la tabla de un metro en 3 partes iguales, y después queremos cortar lo equivalente a dos de estas 3 partes ', faceHero: "streetNpcC", img: "assets/images/characters/people/rostros/rostrow.png" },
              { type: "textMessage", text: 'Otro ejemplo es $$\\frac{{3}}{{4}}m\$$ que es lo mismo que decir que medimos la tabla de un metro en 4 partes iguales, y despues queremos cortar lo equivalente a 3 de estas 4 partes ', faceHero: "streetNpcC", img: "assets/images/characters/people/rostros/rostrow.png" },
              { type: "textMessage", text: '...¿Entiendes como va?.......', faceHero: "streetNpcC", img: "assets/images/characters/people/rostros/rostroww.png" },
              { type: "textMessage", text: ' Otro ultimo caso seria tener algo así $$\\frac{{3}}{{2}}m\$$ esto lo que nos dice es que queremos una tabla que mida mas que un metro, ¿Porque?, esto es así porque estamos diciendo que queremos 3 <span style="color: red;">Mitades  </span> ', faceHero: "streetNpcC", img: "assets/images/characters/people/rostros/rostrow.png" },
              { type: "textMessage", text: ' Recuerda que expresamos la mitad de la tabla asi $$\\frac{{1}}{{2}}m\$$ entonces $$\\frac{{3}}{{2}}m\$$ son 3 mitades, si juntamos dos mitades tenemos una tabla, pero como tenemos 3 mitades entonces es tabla y media', faceHero: "streetNpcC" , img: "assets/images/characters/people/rostros/rostrow.png"},
              { type: "textMessage", text: ' Osea $$\\frac{{3}}{{2}}m=\\frac{{1}}{{2}}m+\\frac{{1}}{{2}}m+\\frac{{1}}{{2}}m\$$ o $$\\frac{{3}}{{2}}m=1\\frac{{1}}{{2}}m\$$ osea que la tabla que queremos medira un <span style="color: red;">metro y medio </span>', faceHero: "streetNpcC", img: "assets/images/characters/people/rostros/rostrow.png" },

              { type: "textMessage", text: 'Lo mismo sucede con los clavos clavos1 solamete que ahora en vez de <span style="color: red;">metros m </span>  usamos <span style="color: blue;">pulgadas in </span>', faceHero: "streetNpcC" , img: "assets/images/characters/people/rostros/rostrow.png"},
              { type: "textMessage", text: '<span style="color: blue;">in </span> es solo la forma de representar que estamos hablando de pulgadas pero no cambia en nada nuestro metodo de representar fracciones', faceHero: "streetNpcC", img: "assets/images/characters/people/rostros/rostrow.png" },
              { type: "textMessage", text: 'por ejemplo podemos tener clavos de las siguientes medidas $$\\frac{{1}}{{2}}in\$$, $$\\frac{{1}}{{3}}in\$$, $$\\frac{{1}}{{4}}in\$$, $$\\frac{{1}}{{5}}in\$$, etc. ', faceHero: "streetNpcC" , img: "assets/images/characters/people/rostros/rostrow.png"},

              
            ]
          }
        ]
      }),
      streetNpcB: new Person({
        x: utils.withGrid(17),
        y: utils.withGrid(26),
        src: "assets/images/characters/people/npcy.png",
        behaviorLoop: [
          { type: "stand", direction: "up", time: 400, },
          { type: "stand", direction: "left", time: 800, },
          { type: "stand", direction: "down", time: 400, },
          { type: "stand", direction: "left", time: 800, },
          { type: "stand", direction: "right", time: 800, },
        ],
        
      }),
      
      streetNpcD: new Person({
        x: utils.withGrid(27),
        y: utils.withGrid(67),
        src: "assets/images/characters/people/npc5.png",
        talking: [
          {
            events: [
              { type: "textMessage", text: "Parece que el camino sigue cerrado...." , img:"assets/images/characters/people/rostros/npc55.png" },
              { type: "textMessage", text: "...." , img:"assets/images/characters/people/rostros/npc55.png" },
              //{ type: "battle", enemyId: "streetBattle" },
              { type: "addStoryFlag", flag: "CaminoBloqueado"},
            ]
          },
        ]
      }),
      streetNpcE: new Person({
        x: utils.withGrid(42),
        y: utils.withGrid(50),
        src: "assets/images/characters/people/npc1.png",
        talking: [
          {
            required: ["streetBattle","mercancias1"],
            events: [
              { type: "textMessage", text: "¡Muy bien! recuerda que si no estás muy seguro puedes realizar la división SOLO para asegurarte", faceHero: "streetNpcC" ,img:"assets/images/characters/people/rostros/npc11.png"},
              { type: "textMessage", text: 'Es decir $$\\frac{{4}}{{5}}=0.8\$$ y $$\\frac{{3}}{{4}}=0.75\$$ por tanto $$\\frac{{4}}{{5}}\$$ es <span style="color:red;">mayor </span>', faceHero: "streetNpcC" ,img:"assets/images/characters/people/rostros/npc11.png" },
            ]
          },
          {
            required: ["streetBattle",],
            events: [
              { type: "textMessage", text: "Parece que el profesor te ha enseñado unas cuantas cosas...", faceHero: "streetNpcC" ,img:"assets/images/characters/people/rostros/npc11.png" },
              { type: "battle", enemyId: "BattleMercancias" },
              { type: "addStoryFlag", flag: "mercancias1"},
            ]
          },
          {
            events: [
              { type: "textMessage", text: "¡Hola! que buscas?....", faceHero: "streetNpcC" ,img:"assets/images/characters/people/rostros/npc11.png"},
              { type: "textMessage", text: "¿Al profesor?...", faceHero: "streetNpcC" ,img:"assets/images/characters/people/rostros/npc11.png" },
              { type: "textMessage", text: "Esta en la parte norte", faceHero: "streetNpcC" ,img:"assets/images/characters/people/rostros/npc11.png" },
              { type: "textMessage", text: "¡Si necesitas mercancía yo doy muy buenas ofertas!", faceHero: "streetNpcC" ,img:"assets/images/characters/people/rostros/npc11.png" },
              //{ type: "battle", enemyId: "streetBattle" },
              //{ type: "addStoryFlag", flag: "mercancias1"},
            ]
          },
        ]
      }),
      streetNpcH: new Person({
        x: utils.withGrid(41),
        y: utils.withGrid(21),
        src: "assets/images/characters/people/npcab1.png",
        talking: [
          {
            required: ["streetBattle2"],
            events: [
              { type: "textMessage", text: "¡Muy bien...!", faceHero: "streetNpcC" ,img:"assets/images/characters/people/rostros/geniio3.png" },
              { type: "textMessage", text: "Ahora sabes como sumar fracciones...", faceHero: "streetNpcC" ,img:"assets/images/characters/people/rostros/geniio3.png"},
              { type: "textMessage", text: "Ahora puedes regresar a tu casa y demostrar lo que has aprendido...", faceHero: "streetNpcC" ,img:"assets/images/characters/people/rostros/geniio3.png"},
              { type: "textMessage", text: "No olvides hablar con las personas que encuentres eso te ayudará a ganar experiencia y practicar tus nuevas hablilidades", faceHero: "streetNpcC",img:"assets/images/characters/people/rostros/geniio3.png" },
              { type: "addStoryFlag", flag: "PrimeraLeccionCompleta"},
            ]
          },
          {
            required: ["streetBattle1"],
            events: [
              { type: "textMessage", text: "Parece que lo has entendido...", faceHero: "streetNpcC",img:"assets/images/characters/people/rostros/geniio3.png" },
              { type: "textMessage", text: "Avancemos un poco más, ahora sumaremos fracciones con denominadores distintos....", faceHero: "streetNpcC" ,img:"assets/images/characters/people/rostros/geniio3.png"},
              { type: "textMessage", text: "Por ejemplo $$\\frac{{1}}{{2}}\$$ naranja1 + $$\\frac{{1}}{{4}}\$$ naranja1 = $$\\frac{{3}}{{4}}\$$ naranja1", faceHero: "streetNpcC",img:"assets/images/characters/people/rostros/geniio3.png" },
              { type: "textMessage", text: "Para hacer esto debemos analizar que es lo que estamos sumando, recuerdas que $$\\frac{{1}}{{2}}\$$ es la mitad y un cuarto $$\\frac{{1}}{{4}}\$$ es una cuarta parte?", faceHero: "streetNpcC" ,img:"assets/images/characters/people/rostros/geniio3.png"},
              { type: "textMessage", text: "Pues si lo ves de esta manera podrás darte cuenta que $$\\frac{{1}}{{2}}=\\frac{{1}}{{4}}+\\frac{{1}}{{4}}\$$ es decir, un cuarto es la mitad de un medio ", faceHero: "streetNpcC" ,img:"assets/images/characters/people/rostros/geniio3.png"},
              { type: "textMessage", text: "En general siempre debes buscar un número en común el cual sea múltiplo de de las partes o dicho de otra manera un número al que podamos convertir nuestras facciones para poder sumar ", faceHero: "streetNpcC" ,img:"assets/images/characters/people/rostros/geniio3.png" },
              { type: "textMessage", text: "En este caso sumaremos las siguientes cantidades como ejemplo: $$\\frac{{1}}{{3}}+\\frac{{1}}{{2}}=\\frac{{2+3}}{{3*2}} = \\frac{{5}}{{6}}\$$  ", faceHero: "streetNpcC" ,img:"assets/images/characters/people/rostros/geniio3.png"},
              { type: "textMessage", text: "Hay varios métodos para hacer esto y todos son válidos pero te lo explicaré con el que yo prefiero...   ", faceHero: "streetNpcC" ,img:"assets/images/characters/people/rostros/geniio3.png"},
              { type: "textMessage", text: 'Lo que se hizo fue: como $$\\frac{{1}}{{3}}\$$ y $$\\frac{{1}}{{2}}\$$ tienen diferente denominador, entonces es como si necesitaramos convertir nuestras fracciones a algo equivalente de manera que como en el ejemplo anterior podamos sumar cosas iguales ', faceHero: "streetNpcC" ,img:"assets/images/characters/people/rostros/geniio3.png" },
              { type: "textMessage", text: 'Podemos buscar un <span style="color:red;">minimo comun multiplo "mcm" </span> esto lo podemos hacer en este caso buscando el numero mas pequeño que es divisible por 3 y por 2, si elegimos el 6 veremos que efectivamente el 3 y el 2 lo pueden dividir ', faceHero: "streetNpcC" ,img:"assets/images/characters/people/rostros/geniio3.png" },
              { type: "textMessage", text: 'Entonces el "6" sera nuestro denominador!, encontrar el numerador es igual de simple, ', faceHero: "streetNpcC" ,img:"assets/images/characters/people/rostros/geniio3.png" },
              { type: "textMessage", text: 'Para esta fracción $$\\frac{{1}}{{3}}\$$ solo necesitamos ver cuantas veces cabe el "3" en el "6", y para la otra fracción $$\\frac{{1}}{{2}}\$$ solo necesitamos ver cuantas veces cabe el "2" en el "6"', faceHero: "streetNpcC",img:"assets/images/characters/people/rostros/geniio3.png" },
              { type: "textMessage", text: 'Ya tenemos listo todo $$\\frac{{2}}{{6}}+\\frac{{3}}{{6}}\$$ lo que es igual a $$\\frac{{2+3}}{{6}}=\\frac{{5}}{{6}}\$$  ', faceHero: "streetNpcC",img:"assets/images/characters/people/rostros/geniio3.png" },
              { type: "textMessage", text: "¡Pongamos esto a prueba...!", faceHero: "streetNpcC" ,img:"assets/images/characters/people/rostros/geniio3.png"},
              { type: "battle", enemyId: "streetBattle2" },
              { type: "addStoryFlag", flag: "streetBattle2"},
            ]
          },
          {
            required: ["streetBattle"],
            events: [
              { type: "textMessage", text: "Muy bien, ahora sabes como se suman mitades...", faceHero: "streetNpcC",img:"assets/images/characters/people/rostros/geniio3.png" },
              { type: "textMessage", text: "Recuerda que dependiendo nuestras fraccionnes, el resultado puede no ser siempre entero", faceHero: "streetNpcC" ,img:"assets/images/characters/people/rostros/geniio3.png"},
              { type: "textMessage", text: "Por ejemplo $$\\frac{{1}}{{4}}\$$ manzana1 + $$\\frac{{1}}{{4}}\$$ manzana1 = $$\\frac{{2}}{{4}}\$$ manzana1", faceHero: "streetNpcC" ,img:"assets/images/characters/people/rostros/geniio3.png"},
              { type: "textMessage", text: "Veamos como lo haces con tercios, cuartos y quintos", faceHero: "streetNpcC" ,img:"assets/images/characters/people/rostros/geniio3.png" },
              { type: "battle", enemyId: "streetBattle1" },
              { type: "addStoryFlag", flag: "streetBattle1"},
            ]
          },
          {
            events: [
              { type: "textMessage", text: "¿Asi que me estabas buscando?", faceHero: "streetNpcC",img: "assets/images/characters/people/rostros/geniio3.png" },
              { type: "textMessage", text: "Yo soy el profesor, Espero ya hayas hablado con los comerciantes ellos brindan una valiosa información aparte de ofrecer excelentes productos", faceHero: "streetNpcC",img:"assets/images/characters/people/rostros/geniio3.png" },
              { type: "textMessage", text: "Empecemos por algo fácil....", faceHero: "streetNpcC", img:"assets/images/characters/people/rostros/geniio3.png"},
              { type: "textMessage", text: "...Sumaremos la mitad de un limon limon1 mas su otra mitad es decir $$\\frac{{1}}{{2}}\$$ limon1 + $$\\frac{{1}}{{2}}\$$ limon1 = 1 limon1 ", faceHero: "streetNpcC" , img:"assets/images/characters/people/rostros/geniio3.png"},
              { type: "textMessage", text: 'como puedes ver este es el caso mas simple, pues solo estamos sumando mitades $$\\frac{{1}}{{2}}\$$ limon1 + $$\\frac{{1}}{{2}}\$$ limon1 , como los denominadores osea el "2" es igual, solo necesitamos sumar los numeradores osea el "1" ', faceHero: "streetNpcC" , img:"assets/images/characters/people/rostros/geniio3.png"},
              { type: "textMessage", text: '<span style="color:red;">Numerador </span> solo es una palabra que utilizamos para referirnos al número de arriba de la fracción y <span style="color:red"> Denominador </span> es la palabra con la cual nos referimos al número de abajo de la fracción ', faceHero: "streetNpcC" , img:"assets/images/characters/people/rostros/geniio3.png"},
              { type: "textMessage", text: "¡Pongamos a prueba lo aprendido!", img: "assets/images/characters/people/rostros/geniio3.png"  },
              { type: "battle", enemyId: "streetBattle" },
              { type: "addStoryFlag", flag: "streetBattle"},
            ]
          },
        ]
      }),
      
    },
    walls: function() {
      let walls = {};
      ["55,64", "55,63", "55,62", "55,61", "55,60", "55,59", "55,58", "55,57", "55,56", "55,55", "55,54", "55,53", "55,52", "55,51", "55,50", "55,49", "55,48", "55,47", "55,46", "55,45", "55,44", "55,43", "55,42", "55,41", "55,40", "55,39", "55,38", "55,37", "55,36", "55,35", "55,34", "55,33", "55,32", "55,31", "55,30", "55,29", "55,28", "55,27", "55,26", "55,25", "55,24", "55,23", "55,22", "55,21",
      "54,20", "53,20", "52,20", "51,20", "50,20", "49,20", "48,20", "47,20", "46,20", "45,20", "44,20", "43,20", "42,20", "41,20", "40,20", "39,20", "38,20", "37,20", "36,20","36,19","36,18","36,17","36,16","36,15","37,15","38,15","39,15","40,15","41,15","42,15","43,15","44,15","45,15","46,15","46,16","46,17","46,18","47,18","48,18","49,18","50,18","51,18","52,18","52,17","52,16","52,15","52,14","51,14","50,14","49,14","49,13","49,12","48,11","47,11","46,11","46,10","46,9","46,8","45,8","44,8","43,8","42,8","41,8","40,9","40,10","40,11","39,11","38,11","37,11","36,11","35,11","34,11","33,11","32,11","31,11","30,11","29,11","28,11","27,11","26,11","25,11","24,11","23,11","22,11","21,11","20,11","19,11","18,11","17,11","16,11","16,12","16,13","16,14","15,14","14,14","13,14","13,15","13,16","13,17","12,17","11,17","10,17","9,17","8,17","7,17","6,17","5,17","4,17","3,17","2,17","2,18","2,19","2,20","3,21","4,21","5,21","6,21","7,21","8,21","9,21","10,21","11,21","12,21","13,21","14,21","15,21","16,21","17,21","18,21","19,21","20,21","21,21","22,21","22,22","22,23","22,24","22,25","22,26","22,27","22,28","22,29","21,29","20,29","19,29","18,29","17,29","16,29","15,29","14,29","13,30","13,31","13,32","12,32","11,32","10,32","9,32","8,32","7,32","6,32","6,31","6,30","5,29","4,30","4,31","4,32","3,33","3,34","3,35","2,35","1,35","0,35","-1,35","-2,35","-2,34","-2,33","-2,32","-2,31","-2,30","-2,29","-2,28","-2,27","-3,26","-4,26","-5,26","-5,25","-5,24","-6,23","-7,23",
      "-8,24","-8,25","-8,26","-8,27","-8,28","-8,29","-8,30","-8,31","-8,32","-8,33","-8,34","-8,35","-9,35","-10,35","-11,35","-11,41","-10,41","-9,41","-8,41","-7,41","-6,41","-5,41","-5,42","-5,43","-5,44","-5,45","-5,46","-5,47","-5,48","-5,49","-5,50","-5,51","-5,52","-5,53","-5,54","-5,55","-5,56","-5,57","-5,58","-5,59",
      "-4,60","-3,60","-2,60","-1,60","0,61","0,62","1,63","2,63","3,63","4,63","5,63","6,63","7,63","8,63","9,63","10,63","11,63","12,63","13,62","13,61","13,60","14,60","15,60","16,60","17,60","18,60","18,61","18,62","17,62","16,62","15,62","14,62","13,64","13,65","14,66","15,66","16,66","17,66","18,66","19,66","20,66","21,67","21,68","20,68","19,68","18,68","19,69","20,70","21,70","22,70","23,70","24,70","25,70","26,70","27,70","28,70","29,70","30,69","29,68","28,68","28,67","28,66","29,66","30,65","31,64","31,63","32,63","33,63","34,63","35,63","36,62","36,61","37,61","38,61","39,61","40,61","41,61","42,61","21,66","43,61","44,61","45,61","46,61","46,62","46,63","46,64","46,65","45,65","44,65","43,65","42,65","41,65","40,65","39,65","39,66","39,67","39,68","40,68","41,68","42,68","43,68","44,68","45,68","46,68","47,68","48,68","49,68","48,67","48,66","48,65","49,65","50,65","51,65","52,65","53,65","54,65","55,65",
      "50,51","50,52","50,53","51,51","49,51","49,52","51,52","49,53","51,53","28,53","29,53","30,53","31,53","32,53","33,53","34,53","35,53","36,53","37,53","38,53","39,53","40,53","41,53","42,53","43,53","44,53","45,53","45,52","45,51","45,50","45,49","45,48","45,47","45,46","45,45","45,44","45,43","45,42","44,42","43,42","42,42","41,42","40,42","39,42","38,42","37,42","37,43","37,44","38,44","39,44","40,44","41,44","42,44","43,45","43,46","43,47","43,48","43,49","43,50","42,51","41,51","40,51","39,51","38,51","37,51","36,51","35,51","34,51","33,51","32,51","30,50","30,49","30,48","29,48","28,48","28,49","28,50","28,51","28,52","31,51", "7,48","7,49","7,50","7,51","7,52","7,53","6,53","5,53","4,53","3,53","2,53","1,53","0,53","-1,53","-2,53","-3,53","-3,52","-3,51","-3,50","-3,49","-3,48","-2,48","-1,48","0,48","1,48","2,48","3,48","4,48","5,48","6,48","9,48","9,49","9,50","9,51","9,52","9,53","10,53","11,53","12,53","13,53","14,53","15,53","16,53","17,53","18,53","19,53","19,52","19,51","19,50","19,49","19,48","18,48","17,48","16,48","15,48","14,48","13,48","12,48","11,48","10,48",
      "28,29","28,28","28,27","28,26","28,25","28,24","29,24","30,24","31,24","32,24","33,24","34,24","35,24","36,24","37,24","38,24","39,24","40,24","41,24","42,24","43,24","44,24","45,24","45,25","45,26","45,27","45,28","45,29","45,30","45,31","45,32","44,32","43,32","42,32","42,31","42,30","42,29","42,28","42,27","42,26","41,26","40,26","39,26","38,26","37,26","36,26","35,26","34,26","33,26","32,26","31,26","30,27","30,28","30,29","29,29", "24,17","25,17","26,17","27,17","28,17","29,17","30,17","31,17","32,17","33,17","34,17","24,13","25,13","26,13","27,13","28,13","29,13","30,13","31,13","32,13","33,13","34,13","24,14","24,15","24,16","34,14","34,15","34,16",
      ].forEach(coord => {
        let [x,y] = coord.split(",");
        walls[utils.asGridCoord(x,y)] = true;
      })
      return walls;
    }(),
    cutsceneSpaces: {
      [utils.asGridCoord(-9,36)]: [
        {
          events: [
            { 
              type: "changeMap",
              map: "DiningRoom",
              x: utils.withGrid(25),
              y: utils.withGrid(9),
              direction: "left"
            }
          ]
        }
      ],
        [utils.asGridCoord(17,31)]: [
          {
            events: [
              { who: "hero", type: "stand",  direction: "up" },
              { type: "textMessage", text:"Buenas tardes...", img:"assets/images/characters/people/rostros/rostroy.png" },
              { type: "textMessage", text:"tengo el medio kilo de huevo en 20 pesos $$\\frac{{1}}{{2}}\$$ huevo1 kg $$=20$$ dinero1", img:"assets/images/characters/people/rostros/rostroy.png"},
              { type: "textMessage", text:"o te vendo un tercio en 15 pesos $$\\frac{{1}}{{3}}\$$ huevo1 kg $$=15$$ dinero1", img:"assets/images/characters/people/rostros/rostroy.png" },
              { who: "hero", type: "stand",  direction: "down" },
              { type: "textMessage", text:"........???", img:"assets/images/characters/people/rostros/npc00.png"},
              { type: "textMessage", text:"$$\\frac{{1}}{{3}}+\\frac{{1}}{{3}}+\\frac{{1}}{{3}}=1\$$ huevo1 kg entonces $$15+15+15=45$$ dinero1", img:"assets/images/characters/people/rostros/npc00.png"},
              { type: "textMessage", text:"$$\\frac{{1}}{{2}}+\\frac{{1}}{{2}}\$$ huevo1 kg entonces $$20+20=40$$ dinero1", img:"assets/images/characters/people/rostros/npc00.png"},
              { type: "textMessage", text:"Conviene comprar medio kilo!!!", img:"assets/images/characters/people/rostros/npc000.png"},              
              { who: "hero", type: "stand",  direction: "up" },
              { type: "textMessage", text:"¡Es correcto!", img:"assets/images/characters/people/rostros/rostroy.png" },
              
            
            ]
          }
        ],
      [utils.asGridCoord(-9,37)]: [
        {
          events: [
            {
              type: "changeMap",
              map: "DiningRoom",
              x: utils.withGrid(25),
              y: utils.withGrid(10),
              direction: "left"
            }
          ]
        }
      ],
      [utils.asGridCoord(-9,38)]: [
        {
          events: [
            {
              type: "changeMap",
              map: "DiningRoom",
              x: utils.withGrid(25),
              y: utils.withGrid(11),
              direction: "left"
            }
          ]
        }
      ],
      [utils.asGridCoord(-9,39)]: [
        {
          events: [
            {
              type: "changeMap",
              map: "DiningRoom",
              x: utils.withGrid(25),
              y: utils.withGrid(12),
              direction: "left"
            }
          ]
        }
      ],
      [utils.asGridCoord(-9,40)]: [
        {
          events: [
            {
              type: "changeMap",
              map: "DiningRoom",
              x: utils.withGrid(25),
              y: utils.withGrid(13),
              direction: "left"
            }
          ]
        }
      ],
    }
  },
  Shop: {
    id: "Shop",
    lowerSrc: "assets/images/maps/mapaforest.png",
    upperSrc: "assets/images/maps/forestup.png",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
       // x: utils.withGrid(3),
        //y: utils.withGrid(7),
      }),
      shopNpcA: new Person({
        x: utils.withGrid(2),
        y: utils.withGrid(80),
        behaviorLoop: [
          { type: "walk", direction: "down" },
          { type: "stand", direction: "down", time:600 },
          { type: "walk", direction: "down" },
          { type: "walk", direction: "down" },
          { type: "stand", direction: "right", time:400 },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },

          { type: "walk", direction: "up" },
          { type: "stand", direction: "up", time:1000 },

          { type: "walk", direction: "up" },
          { type: "walk", direction: "up" },
          { type: "stand", direction: "up", time:1000 },
          { type: "stand", direction: "left", time:1900 },
          { type: "stand", direction: "up", time:700 },
          { type: "stand", direction: "right", time:400 },

          { type: "walk", direction: "left" },
          { type: "walk", direction: "left" },

        ],
        src: "assets/images/characters/animals/pato1.png",
        
      }),
      shopNpcB: new Person({
        x: utils.withGrid(5),
        y: utils.withGrid(90),
        src: "assets/images/characters/animals/pato1.png",
        behaviorLoop: [
          { type: "walk", direction: "left" },
          { type: "stand", direction: "left", time:400 },
          { type: "walk", direction: "left" },
          { type: "walk", direction: "left" },
          { type: "stand", direction: "left", time:400 },
          { type: "walk", direction: "left" },

          { type: "walk", direction: "left" },

          { type: "walk", direction: "left" },
          { type: "stand", direction: "left", time:1000 },
          { type: "stand", direction: "up", time:400 },
          { type: "stand", direction: "left", time:1400 },
          { type: "stand", direction: "right", time:400 },

          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },

          { type: "walk", direction: "right" },
          { type: "stand", direction: "right", time:800 },
          { type: "walk", direction: "right" },
          { type: "stand", direction: "left", time:1500 },
        ],
      }),
      shopNpcC: new Person({
        x: utils.withGrid(32),
        y: utils.withGrid(98),
        src: "assets/images/characters/animals/caballo.png",
        behaviorLoop: [
          { type: "walk", direction: "up" },
          { type: "stand", direction: "up" },
          { type: "walk", direction: "up" },
          { type: "walk", direction: "left" },
          { type: "stand", direction: "left", time:400 },
          { type: "walk", direction: "left" },

          { type: "walk", direction: "up" },

          { type: "walk", direction: "up" },
          { type: "walk", direction: "up" },
          { type: "walk", direction: "up" },
          { type: "stand", direction: "left", time:1000 },
          { type: "stand", direction: "up", time:400 },
          { type: "stand", direction: "left", time:1400 },
          { type: "stand", direction: "right", time:400 },

          { type: "walk", direction: "right" },
          { type: "walk", direction: "down" },
          { type: "walk", direction: "down" },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "down" },
          { type: "walk", direction: "down" },

          { type: "walk", direction: "down" },
          { type: "stand", direction: "right", time:800 },
          { type: "walk", direction: "right" },
          { type: "stand", direction: "left", time:1500 },
          { type: "walk", direction: "left" },
          { type: "walk", direction: "down" },
        ],
      }),
      shopNpcD: new Person({
        x: utils.withGrid(59),
        y: utils.withGrid(84),
        src: "assets/images/characters/animals/bisonte.png",
        behaviorLoop: [
          { type: "walk", direction: "left" },
          { type: "walk", direction: "left" },
          { type: "walk", direction: "left" },
          { type: "walk", direction: "left" },
          { type: "stand", direction: "left", time:1000 },
          { type: "stand", direction: "up", time:500 },
          { type: "stand", direction: "left", time:500 },
          { type: "stand", direction: "down", time:500 },
          { type: "stand", direction: "up", time:500 },
          { type: "walk", direction: "up" },
          { type: "walk", direction: "up" },
          { type: "walk", direction: "up" },
          { type: "stand", direction: "up", time:1000 },
          { type: "walk", direction: "up" },
          { type: "walk", direction: "up" },

          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "up" },
          { type: "walk", direction: "up" },
          { type: "stand", direction: "up", time:1000 },
          { type: "stand", direction: "right", time:1000 },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },

          { type: "stand", direction: "up", time:1000 },
          { type: "stand", direction: "down", time:500 },
          { type: "walk", direction: "down" },
          { type: "walk", direction: "down" },
          { type: "walk", direction: "down" },
          { type: "stand", direction: "down", time:2000 },
          { type: "walk", direction: "down" },
          { type: "walk", direction: "down" },
          { type: "walk", direction: "down" },
          { type: "walk", direction: "down" },
          { type: "walk", direction: "left" },
          { type: "walk", direction: "left" },
        ],
      }),
      shopNpcE: new Person({
        x: utils.withGrid(37),
        y: utils.withGrid(59),
        src: "assets/images/characters/animals/camello1.png",
        behaviorLoop: [
          { type: "walk", direction: "left" },
          { type: "walk", direction: "left" },
          { type: "walk", direction: "left" },
          { type: "walk", direction: "left" },
          { type: "stand", direction: "left", time:800 },
          { type: "stand", direction: "up", time:600 },
          { type: "stand", direction: "left", time:500 },
          { type: "walk", direction: "left" },
          { type: "walk", direction: "left" },
          { type: "walk", direction: "left" },
          { type: "walk", direction: "left" },
          { type: "stand", direction: "right", time:1000 },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },
          { type: "stand", direction: "right", time:500 },
          { type: "stand", direction: "up", time:1000 },
          { type: "stand", direction: "left", time:600 },
          { type: "walk", direction: "left" },
          { type: "walk", direction: "left" },

          { type: "stand", direction: "right", time:1000 },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "left" },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },
          { type: "stand", direction: "down", time:1000 },
          { type: "stand", direction: "left", time:1000 },
          { type: "stand", direction: "down", time:1000 },
          { type: "stand", direction: "right", time:1000 },
          { type: "stand", direction: "up", time:1000 },
          { type: "stand", direction: "right", time:1000 },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },
          
        ],
      }),
      shopNpcF: new Person({
        x: utils.withGrid(-2),
        y: utils.withGrid(26),
        src: "assets/images/characters/animals/perro.png",
        behaviorLoop: [
          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },
          { type: "stand", direction: "up", time:600 },
          { type: "stand", direction: "left", time:500 },
          { type: "walk", direction: "up" },
          { type: "walk", direction: "up" },
          { type: "walk", direction: "up" },
          { type: "walk", direction: "up" },
          { type: "walk", direction: "up" },
          { type: "walk", direction: "up" },
          { type: "walk", direction: "up" },
          { type: "walk", direction: "up" },
          { type: "walk", direction: "up" },
          { type: "walk", direction: "up" },

          { type: "stand", direction: "right", time:1000 },
          { type: "walk", direction: "left" },
          { type: "walk", direction: "left" },
          { type: "walk", direction: "left" },
          { type: "stand", direction: "left", time:500 },
          { type: "stand", direction: "up", time:1000 },
          { type: "stand", direction: "left", time:600 },
          { type: "walk", direction: "left" },
          { type: "walk", direction: "left" },

          { type: "stand", direction: "left", time:1000 },
          { type: "walk", direction: "left" },
          { type: "walk", direction: "left" },

          { type: "walk", direction: "left" },
          { type: "walk", direction: "left" },

          { type: "walk", direction: "down" },
          { type: "walk", direction: "down" },
          { type: "walk", direction: "down" },
          { type: "stand", direction: "down", time:1000 },
          { type: "stand", direction: "left", time:1000 },
          { type: "stand", direction: "down", time:1000 },
          { type: "stand", direction: "right", time:1000 },
          { type: "stand", direction: "up", time:1000 },
          { type: "stand", direction: "right", time:1000 },
          { type: "walk", direction: "down" },
          { type: "walk", direction: "down" },

          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },

          { type: "walk", direction: "up" },
          { type: "walk", direction: "up" },
          { type: "walk", direction: "up" },

          { type: "walk", direction: "left" },
          { type: "walk", direction: "left" },
          { type: "walk", direction: "left" },
          { type: "walk", direction: "left" },
          { type: "walk", direction: "left" },
          { type: "walk", direction: "left" },
          { type: "walk", direction: "left" },
          { type: "walk", direction: "left" },
          { type: "walk", direction: "left" },
          { type: "walk", direction: "left" },
          { type: "walk", direction: "left" },
          { type: "walk", direction: "left" },
          { type: "walk", direction: "left" },
          { type: "walk", direction: "left" },
          { type: "walk", direction: "left" },
          { type: "walk", direction: "left" },
          { type: "walk", direction: "left" },
          { type: "walk", direction: "left" },

          { type: "walk", direction: "down" },
          { type: "walk", direction: "down" },
          { type: "walk", direction: "down" },
          { type: "walk", direction: "down" },
          { type: "walk", direction: "down" },
          { type: "walk", direction: "down" },
          { type: "walk", direction: "down" },
          { type: "walk", direction: "down" },
          
        ],
      }),
      shopNpcG: new Person({
        x: utils.withGrid(33),
        y: utils.withGrid(19),
        src: "assets/images/characters/animals/perro.png",
        behaviorLoop:[
          { type: "walk", direction: "down" },
          { type: "walk", direction: "down" },
          { type: "walk", direction: "down" },
          { type: "walk", direction: "down" },
          { type: "walk", direction: "down" },
          { type: "walk", direction: "down" },
          { type: "stand", direction: "down", time:1000 },
          { type: "stand", direction: "left", time:300 },
          { type: "stand", direction: "up", time:1200 },


          { type: "walk", direction: "up" },
          { type: "walk", direction: "up" },
          { type: "walk", direction: "up" },
          { type: "walk", direction: "up" },
          { type: "walk", direction: "up" },
          { type: "walk", direction: "up" },
          { type: "stand", direction: "up", time:8000 },
          { type: "stand", direction: "left", time:500 },
          { type: "stand", direction: "up", time:500 },
          { type: "stand", direction: "right", time:1000 },
          { type: "stand", direction: "down", time:1500 },
        ]
      }),
      shopNpcH: new Person({
        x: utils.withGrid(85),
        y: utils.withGrid(40),
        src: "assets/images/characters/animals/camello.png",
      }),
      shopNpcI: new Person({
        x: utils.withGrid(93),
        y: utils.withGrid(89),
        src: "assets/images/characters/animals/oso.png",
        behaviorLoop:[
          { type: "stand", direction: "down", time:1000 },
          { type: "stand", direction: "left", time:1000 },
          { type: "stand", direction: "down", time:1500 },
          { type: "stand", direction: "right", time:1500 },
        ]
      }),
      shopNpcJ: new Person({
        x: utils.withGrid(87),
        y: utils.withGrid(78),
        src: "assets/images/characters/animals/caballo1.png",
        behaviorLoop:[
          { type: "walk", direction: "left"},
          { type: "walk", direction: "left" },
          { type: "stand", direction: "left", time:1500 },
          { type: "walk", direction: "left"},
          { type: "walk", direction: "left" },
          { type: "stand", direction: "left", time:1500 },

          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },
          { type: "stand", direction: "right", time:1500 },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },
          { type: "stand", direction: "right", time:1500 },
        ]
      }),
      shopNpcK: new Person({
        x: utils.withGrid(101),
        y: utils.withGrid(87),
        src: "assets/images/characters/animals/bigcats.png",
        behaviorLoop:[{ type: "stand", direction: "left", time:1500 },]
      }),
      shopNpcL: new Person({
        x: utils.withGrid(90),
        y: utils.withGrid(102),
        src: "assets/images/characters/animals/toro.png",
        behaviorLoop:[{ type: "stand", direction: "right", time:1500 },]
      }),
      shopNpcM: new Person({
        x: utils.withGrid(86),
        y: utils.withGrid(58),
        src: "assets/images/characters/people/npc7.png",
        talking: [
          {
            events: [
              { type: "textMessage", text: "Esta parte del mapa aun no esta totalmente habilitada....", img: "assets/images/characters/people/rostros/npc77.png"},
              { type: "textMessage", text: 'Pero  puedes ver explorar el mapa y ver a los <span style="color: green;"> animales </span> mientras tanto ', faceHero: "shopNpcM", img: "assets/images/characters/people/rostros/npc77.png" },
              //{ type: "battle", enemyId: "streetBattle" },
              //{ type: "addStoryFlag", flag: "streetBattle"},
            ]
          },
        ]
      }),
      /*pizzaStone: new PizzaStone({
        x: utils.withGrid(1),
        y: utils.withGrid(4),
        storyFlag: "STONE_SHOP",
        pizzas: ["v002", "f002"],
      }),*/
    },
    cutsceneSpaces: {
      [utils.asGridCoord(107,60)]: [
        {
          events: [
            {
              type: "changeMap",
              map: "DiningRoom",
              x: utils.withGrid(-4),
              y: utils.withGrid(42),
              direction: "right"
            }
          ]
        }
      ],
      [utils.asGridCoord(107,61)]: [
        {
          events: [
            {
              type: "changeMap",
              map: "DiningRoom",
              x: utils.withGrid(-4),
              y: utils.withGrid(43),
              direction: "right"
            }
          ]
        }
      ],
      [utils.asGridCoord(107,62)]: [
        {
          events: [
            {
              type: "changeMap",
              map: "DiningRoom",
              x: utils.withGrid(-4),
              y: utils.withGrid(44),
              direction: "right"
            }
          ]
        }
      ],
      [utils.asGridCoord(107,63)]: [
        {
          events: [
            {
              type: "changeMap",
              map: "DiningRoom",
              x: utils.withGrid(-4),
              y: utils.withGrid(45),
              direction: "right"
            }
          ]
        }
      ],
      [utils.asGridCoord(107,64)]: [
        {
          events: [
            {
              type: "changeMap",
              map: "DiningRoom",
              x: utils.withGrid(-4),
              y: utils.withGrid(46),
              direction: "right"
            }
          ]
        }
      ],
    },
    walls: function() {
      let walls = {};
      [ "108,59", "107,59", "106,59", "105,59", "104,59", "103,59", "102,59", "101,59", "100,59", "100,58", "100,57", "100,56", "100,55", "100,54", "100,53", "100,52", "100,51", "100,50", "100,49", "100,48", "101,48", "102,48", "103,48", "102,47", "102,46", "102,45", "102,44", "102,43", "102,42", "102,41", "102,40", "102,39", "102,38", "102,37", "102,36", "102,35", "102,34", "102,33", "102,32", "102,31", "102,30", "102,29", "102,28", "102,27", "102,26", "102,25", "102,24", "102,23", "101,23", "100,23", "100,22", "100,21", "100,20", "99,20", "99,19", "99,18", "98,18", "97,18", "97,19", "97,20", "96,20", "95,20", "94,20", "93,20", "92,20", "91,20", "90,20", "89,20", "88,20", "87,20", "86,20", "85,20", "84,20", "83,20", "82,20", "82,19", "82,18", "82,17", "81,17", "80,17", "79,17", "79,18", "79,19", "79,20", "79,21", "79,22", "79,23", "80,23", "81,23", "82,23", "82,22", "82,21", "83,21", "84,21", "85,21", "86,21", "87,21", "88,21", "89,21", "90,21", "91,22", "91,23", "91,24", "91,25", "91,26", "92,26", "93,26", "94,26", "95,26", "96,26", "97,26", "97,27", "97,28", "97,29", "97,30", "97,31", "97,32", "96,32", "95,32", "94,32", "93,32", "93,33", "93,34", "92,34", "92,35", "91,35", "90,35", "89,35", "89,34", "88,34", "88,33", "90,32", "90,31", "90,30", "90,29", "89,29", "88,29", "87,29", "86,29", "85,29", "84,29", "83,29", "82,29", "81,29", "81,30", "80,31", "80,32", "79,32", "78,32", "77,31", "76,31", "76,30", "78,29", "78,28", "78,27", "78,26", "78,25", "78,24", "78,23", "77,23", "76,22", "76,21", "77,21", "78,21", "78,20", "77,20", "76,20", "75,20", "74,20", "73,20", "73,21", "73,22", "73,23", "73,24", "73,25", "73,26", "73,27", "73,28", "73,29", "73,30", "73,31", "73,32", "73,33", "73,34", "73,35", "74,35", "75,35", "76,35", "77,35", "78,35", "79,35", "80,35", "81,35", "82,35", "82,36", "82,37", "82,38", "82,39", "82,40", "82,41", "82,42", "82,43", "82,44", "83,44", "84,44", "85,44", "86,44", "87,44", "88,44", "88,45", "88,46", "88,47", "89,47", "90,47", "91,47", "91,48", "91,49", "91,50", "92,50", "93,50", "94,50", "95,50", "96,50", "97,50", "97,51", "97,52", "97,53", "97,54", "97,55", "97,56", "96,56", "95,56", "94,56", "93,56", "92,56", "91,56", "90,56", "90,56", "89,56", "88,56", "87,56", "86,56", "85,56", "84,56", "84,57", "84,58", "84,59", "83,59", "82,59", "81,59", "80,59", "79,59", "78,59", "77,59", "76,59", "75,59", "74,59", "73,59", "102,32", "101,32", "100,32", "99,32", "99,31", "99,30", "99,29", "99,28", "99,27", "99,26", "100,26", "101,26", "102,26",
      "109,65", "108,65", "107,65", "106,65", "105,65", "104,65", "103,65", "102,65", "102,66", "102,67", "102,68", "102,69", "102,70", "102,71", "102,72", "102,73", "102,74", "102,75", "102,76", "102,77", "101,77", "100,77", "99,77", "99,78", "99,79", "99,80", "98,80", "97,80", "96,80", "95,80", "94,80", "93,80", "92,80", "91,80", "90,80", "90,81", "90,82", "90,83", "90,84", "90,85", "90,86", "89,86", "88,86", "88,85", "88,84", "88,83", "88,82", "88,81", "88,80", "88,79", "88,78", "89,78", "90,78", "91,78", "91,77", "91,76", "91,75", "92,75", "93,75", "94,75", "95,75", "96,75", "97,75", "97,74", "97,73", "97,72", "98,72", "99,72", "100,72", "101,72", "102,78", "102,79", "102,80", "102,81", "102,82", "102,83", "102,84", "102,85", "102,86", "102,87", "102,88", "102,89", "102,90", "101,90", "100,90", "99,90", "98,90", "97,90", "97,90", "97,91", "97,92", "98,92", "99,92", "100,92", "100,93", "100,94", "100,95", "101,95", "102,95", "102,96", "102,97", "102,98", "102,99", "102,100", "102,101", "102,102", "102,103", "102,104", "102,105", "101,105", "100,105", "100,106", "100,107", "100,108", "100,110", "99,110", "98,110", "97,110", "96,110", "95,110", "94,110", "93,110", "92,110", "91,110", "90,110", "89,110", "88,110", "87,110", "87,109", "87,108", "87,108", "87,107", "87,106", "87,105", "86,105", "85,105", "84,105", "84,104", "84,103", "84,102", "84,101", "84,100", "84,99", "84,98", "83,98", "82,98", "81,98", "81,97", "81,96", "80,96", "79,96", "78,96", "78,95", "78,94", "78,93", "78,92", "79,92", "80,92", "81,92", "82,92", "83,92", "84,92", "84,91", "84,90", "83,90", "82,90", "81,90", "81,89", "81,88", "81,87", "81,86", "81,85", "81,84", "81,83", "81,82", "81,81", "81,80", "81,79", "81,78", "81,77", "81,76", "81,75", "81,74", "81,73", "81,72", "81,71", "82,71", "83,71", "84,71", "84,70", "84,69", "84,68", "84,67", "84,66", "84,65", "83,65", "82,65", "81,65", "80,65", "79,65", "78,65", "77,65", "76,65", "75,65", "74,65", "73,65", "73,66", "73,67", "72,67", "71,67", "70,67", "70,68",
      "76,110", "75,110", "74,110", "73,110", "72,110", "71,110", "70,110", "69,110", "68,110", "67,110", "66,110", "65,110", "64,110", "63,110", "62,110", "61,110", "60,110", "59,110", "58,110", "57,110", "56,110", "55,110", "54,110", "53,110", "52,110", "51,110", "50,110", "49,110", "48,110", "47,110", "46,110", "45,110", "44,110", "43,110", "42,110", "41,110", "40,110", "39,110", "38,110", "37,110", "36,110", "35,110", "34,110", "33,110", "32,110", "31,110", "30,110", "29,110", "28,110", "27,110", "26,110", "25,110", "23,110", "25,110", "24,110", "23,110", "22,110", "21,110", "20,110", "19,110", "18,110", "17,110", "16,110", "15,110", "14,110", "13,110", "12,110", "11,110", "10,110", "9,110", "8,110", "7,110", "6,110", "5,110", "4,110", "3,110", "2,110", "1,110", "0,110", "-1,110", "-2,110", "-3,110", "-4,110", "-5,110", "-5,109", "-5,108", "-5,107", "-5,106", "-5,105", "-5,104", "-4,104", "-3,104", "-2,105", "-2,104", "-1,105", "-1,106", "-1,107", "0,107", "1,107", "2,107", "3,107", "3,106", "3,105", "2,105", "1,105", "1,104", "1,103", "0,102", "-1,102", "-2,102", "-3,102", "-4,102", "-5,102", "-5,101", "-5,100", "-5,99", "-5,98", "-4,98", "-3,98", "-3,97", "-3,96", "-4,96", "-5,96", "-5,95", "-5,94", "-5,93", "-5,92", "-5,91", "-5,90", "-5,89", "-5,88", "-5,87", "-5,86", "-5,85", "-5,84", "-5,83", "-5,82", "-5,81", "-5,80", "-5,79", "-5,78", "-5,77", "-5,76", "-5,75", "-5,74", "-5,73", "-5,72", "-5,71", "-4,71", "-3,71", "-2,71", "-1,71", "0,71", "1,71", "2,71", "3,71", "4,71", "5,71", "6,71", "6,70", "6,69", "6,68", "6,67", "6,66", "6,65", "6,64", "6,63", "6,62", "5,62", "4,62", "3,62", "3,63", "3,64", "3,65", "3,66", "3,67", "3,68", "2,68", "1,68", "0,68", "-1,68", "-2,68", "-3,68", "-4,68", "-5,68", "-5,67", "-5,66", "-5,65", "-5,64", "-4,64", "-3,65", "-2,65", "-1,65", "0,64", "0,63", "-1,63", "-2,63", "-3,63", "-4,63", "-5,63", "-5,62", "-5,61", "-5,60", "-5,59", "-5,58", "-5,57", "-5,56", "-4,56", "-3,56", "-2,56", "-1,56", "0,56", "1,56", "2,56", "3,56", "4,56", "6,56", "7,56", "8,56", "9,56", "10,56", "10,55", "10,54", "11,54", "12,54", "12,55", "12,56", "13,56", "14,56", "15,56", "16,56", "17,56", "18,56", "18,57", "18,58", "18,59", "18,60", "18,61", "18,62", "17,62", "16,62", "16,63", "16,64", "16,65", "16,66", "16,67", "16,68", "16,69", "16,70", "16,71", "17,71", "18,71", "18,70", "18,69", "18,68", "18,67", "18,66", "18,65", "18,63", "18,62", "18,55", "18,54", "18,53", "18,52", "18,51", "18,50", "18,49", "18,48", "18,47", "18,46", "18,45", "18,44", "19,44", "20,44", "21,44", "22,44", "22,43", "22,42", "23,42", "24,42", "24,43", "24,44", "25,44", "26,44", "27,44", "28,44", "29,44", "30,44", "31,44", "32,44", "33,44", "34,44", "34,43", "34,42", "35,42", "36,42", "36,43", "36,44", "37,44", "38,44", "39,44", "40,44", "41,44", "42,44", "43,44", "43,45", "43,46", "43,47", "44,47", "45,47", "45,46", "45,45", "45,44", "45,43", "45,42", "45,41", "45,39", "45,38", "45,37", "45,36", "44,36", "43,36", "42,36", "41,36", "40,36", "39,36", "38,36", "37,36", "36,36", "35,36", "34,36", "33,36", "32,36", "31,36", "30,36", "29,36", "28,36", "27,36", "26,36", "25,36", "24,36", "23,36", "22,36", "21,36", "20,36", "19,36", "18,36", "17,36", "16,36", "15,36", "15,35", "15,34", "15,33", "14,33", "13,33", "12,33", "11,33", "10,33", "9,33", "8,33", "7,33", "6,33", "5,33", "4,33", "3,33", "2,33", "1,33", "0,33", "-1,33", "-2,33", "-3,33", "-4,33", "-5,33", "-5,32", "-5,31", "-5,30", "-5,29", "-4,29", "-3,29", "-2,29", "-1,29", "0,29", "1,29", "2,29", "3,29", "4,29", "5,29", "6,29", "7,29", "8,29", "9,29", "10,29", "11,29", "11,28", "11,27", "11,26", "11,25", "12,25", "13,25", "14,25", "15,25", "16,25", "16,26", "16,24", "16,26", "16,27", "16,28", "16,29", "17,29", "18,29", "19,29", "20,29", "21,29", "22,29", "23,29", "24,29", "25,29", "26,29", "27,29", "28,29", "29,29", "30,29", "32,29", "33,29", "34,29", "35,29", "36,29", "37,29", "38,29", "39,29", "39,28", "39,27", "38,27", "37,27", "36,27", "35,27", "34,27", "33,27", "32,27", "31,27", "30,27", "29,27", "28,27", "27,27", "26,27", "25,27", "24,27", "23,27", "22,27", "21,27", "20,27", "19,27", "18,27", "17,27", "18,25", "18,26", "18,24", "17,24", "16,24", "15,24", "14,24", "13,24", "12,24", "11,24", "11,25", "11,26", "11,27", "10,27", "9,27", "8,27", "7,27", "6,27", "5,27", "4,27", "3,27", "2,27", "1,27", "0,27", "-1,27", "-2,27", "-3,27", "-3,26", "-3,25", "-3,24", "-3,23", "-3,22", "-3,21", "-3,20", "-3,19", "-3,18", "-4,18", "-5,18", "-5,17", "-5,16", "-5,15", "-5,14", "-4,14", "-3,14", "-2,14", "-1,14", "0,14", "1,14", "2,14", "3,14", "4,14", "5,14", "6,14", "7,14", "8,14", "9,14", "10,14", "11,14", "12,14", "13,14", "14,14", "15,14", "16,14", "17,14", "18,14", "19,14", "19,15", "19,16", "19,17", "20,17", "21,17", "22,17", "23,17", "24,17", "25,17", "26,17", "27,17", "27,16", "27,15", "27,14", "28,14", "29,14", "30,14", "31,14", "32,14", "33,14", "34,14", "34,15", "34,16", "34,17", "35,17", "36,17", "36,16", "36,15", "36,14", "37,14", "38,14", "39,14", "40,14", "41,14", "42,14", "43,14", "44,14", "45,14", 
      "76,109", "76,108", "76,107", "75,107", "74,107", "73,107", "72,107", "71,107", "70,107", "69,107", "68,107", "67,107", "67,106", "67,105", "67,104", "66,104", "65,104", "64,104", "63,104", "63,105", "63,106", "62,106", "61,107", "61,107", "60,107", "59,106", "58,106", "58,105", "59,105", "60,105", "60,104", "60,103", "60,102", "61,101", "61,100", "61,99", "61,98", "61,97", "61,96", "61,95", "61,94", "61,93", "62,93", "63,93", "64,93", "64,92", "64,91", "64,90", "64,89", "64,88", "64,87", "64,86", "63,86", "62,86", "61,86", "59,86", "60,86", "58,86", "57,86", "57,87", "57,88", "57,89", "57,90", "57,91", "57,92", "57,93", "57,94", "57,95", "57,96", "57,97", "57,98", "57,99", "57,100", "56,101", "56,100", "55,101", "54,101", "53,100", "52,100", "52,99", "52,98", "52,97", "52,96", "52,95", "52,94", "52,93", "52,92", "52,91", "52,90", "52,89", "52,88", "52,87", "52,86", "53,85", "53,84", "53,83", "53,82", "53,81", "53,80", "53,79", "53,78", "53,77", "53,76", "53,75", "54,75", "55,75", "56,75", "56,74", "56,73", "56,72", "56,71", "56,70", "55,69", "55,68", "54,68", "53,68", "53,67", "52,67", "52,66", "53,66", "54,66", "55,66", "56,66", "57,66", "57,67", "58,68", "58,69", "59,69", "60,69", "60,70", "59,70", "58,71", "57,71", "58,72", "59,72", "60,72", "61,72", "62,72", "62,67", "61,67", "63,67", "63,68", "64,68", "65,67", "66,67", "66,66", "65,66", "64,66", "63,66", "62,66", "61,66", "72,59", "71,59", "70,59", "69,59", "68,59", "67,59", "66,59", "65,59", "64,59", "63,59", "62,59", "61,59", "60,59", "59,59", "58,59", "57,59", "56,59", "55,59", "54,59", "53,58", "52,58", "52,57", "53,57", "54,57", "55,57", "54,56", "54,55", "54,54", "54,53", "54,52", "54,51", "55,50", "56,50", "57,50", "57,49", "57,48", "57,47", "56,47", "55,47", "54,47", "53,47", "52,47", "52,46", "52,45", "52,44", "52,43", "52,42", "52,41", "52,40", "52,39", "52,38", "52,37", "52,36", "53,36", "54,36", "55,36", "56,36", "57,36", "46,14", "46,15", "46,16", "47,16", "47,17", "48,17", "49,17", "49,18", "49,19", "50,19", "50,20", "51,20", "52,20", "52,21", "52,22", "53,22", "53,23", "54,23", "55,23", "55,24", "55,25", "55,26", "55,27", "55,28", "55,29", "55,30", "55,31", "56,31", "56,32", "57,32", "58,32", "58,33", "58,34", "59,34", "60,35", "61,35", "61,36", "61,37", "61,38", "61,39", "61,40", "61,41", "61,42", "61,43", "62,44", "63,44", "64,44", "65,44", "66,44", "67,44", "67,45", "67,46", "67,47", "67,48", "67,49", "68,50", "69,50", "70,50", "70,51", "70,52", "70,53", "70,54", "70,55", "70,56", "70,57", "70,58", "70,59", "49,107", "48,107", "47,106", "46,106", "50,106", "50,107", "51,105", "50,105", "49,105", "48,105", "47,105", "46,105", "38,106", "38,107", "39,107", "39,106", "27,106", "26,106", "26,107", "27,107", "16,107", "15,107", "14,106", "13,106", "13,105", "14,105", "16,105", "17,105", "18,105", "18,106", "17,106", "16,107", 
      "58,35", "59,35", "59,35", "70,69", "70,70", "70,71", "70,72", "69,72", "68,72", "67,72", "66,72", "65,72", "64,72", "63,72", "45,101", "44,101", "43,101", "45,100", "45,99", "45,98", "45,97", "45,96", "45,95", "45,94", "45,93", "45,92", "45,91", "45,90", "44,90", "43,90", "42,90", "42,89", "42,88", "42,87", "41,87", "40,87", "39,87", "38,87", "38,86", "38,85", "38,84", "37,84", "36,84", "35,84", "35,83", "35,82", "35,81", "35,80", "34,80", "33,80", "35,80", "37,80", "36,80", "37,80", "38,80", "39,80", "40,80", "40,81", "40,82", "41,82", "42,83", "43,83", "44,83", "45,82", "45,81", "44,81", "43,81", "43,80", "43,79", "42,78", "41,78", "40,78", "39,78", "38,78", "37,78", "36,78", "35,78", "34,78", "34,77", "34,76", "34,75", "33,75", "32,75", "31,75", "30,75", "29,75", "28,75", "28,76", "28,77", "28,78", "27,78", "26,78", "25,78", "25,77", "25,76", "25,75", "24,75", "23,75", "22,75", "21,75", "20,75", "19,75", "19,76", "20,77", "20,76", "21,77", "22,78", "22,79", "22,80", "21,81", "20,81", "19,81", "19,82", "20,83", "21,83", "22,83", "22,84", "22,85", "22,86", "22,87", "22,88", "22,89", "22,90", "21,90", "20,90", "19,90", "19,91", "19,92", "19,93", "19,94", "19,95", "19,96", "19,97", "19,98", "19,99", "19,100", "19,101", "20,101", "21,101", "21,100", "21,99", "21,98", "21,97", "21,96", "21,95", "22,95", "23,95", "24,95", "25,95", "26,95", "26,96", "26,97", "26,98", "27,98", "28,98", "29,98", "29,99", "29,100", "29,101", "30,101", "31,101", "32,101", "33,101", "34,101", "35,101", "35,100", "35,99", "35,98", "36,98", "37,98", "38,98", "38,97", "38,96", "38,95", "39,95", "40,95", "41,95", "42,95", "-1,95", "-1,94", "6,95", "5,95", "4,95", "3,95", "2,95", "1,95", "1,94", "1,93", "1,92", "0,92", "-1,92", "-2,92", "-2,91", "-2,90", "-2,89", "-2,88", "-2,87", "-2,86", "-2,85", "-2,84", "-2,83", "-2,82", "-2,81", "-2,80", "-1,80", "0,80", "0,79", "1,78", "2,78", "3,78", "4,78", "5,78", "6,78", "6,78", "6,79", "6,80", "6,81", "7,81", "8,81", "9,81", "9,82", "9,83", "9,84", "9,85", "9,86", "9,87", "9,88", "9,89", "9,90", "9,91", "9,92", "8,92", "7,92", "6,92", "6,93", "6,94", "6,95", "5,95", "4,95", "3,95", "2,95", "11,96", "11,97", "11,98", "10,98", "10,97", "12,97", "12,96", "12,98", "12,86", "11,86", "10,86", "10,85", "10,84", "11,84", "12,84", "12,85", "11,80", "11,79", "8,77", "7,77", "7,76", "7,75", "8,75", "9,75", "9,76", "9,77", "26,71", "25,71", "25,70", "25,69", "25,68", "25,67", "25,66", "25,65", "24,65", "23,65", "23,64", "22,64", "22,63", "22,62", "22,61", "22,60", "22,59", "22,58", "22,57", "23,57", "24,57", "25,57", "26,57", "26,56", "26,55", "26,54", "27,54", "28,54", "29,54", "30,54", "30,53", "30,52", "31,51", "32,51", "33,51", "34,51", "35,51", "36,51", "36,52", "35,52", "35,53", "34,53", "34,54", "35,54", "36,54", "37,54", "38,54", "39,54", "40,54", "41,54", "42,54", "42,55", "42,56", "42,57", "43,57", "44,57", "45,57", "45,58", "44,58", "44,59", "43,59", "42,59", "41,59", "41,60", "41,61", "42,61", "42,62", "42,63", "42,64", "42,65", "41,65", "41,65", "40,65", "39,65", "38,65", "38,66", "38,67", "38,68", "37,68", "36,68", "36,69", "36,70", "35,70", "35,71", "34,71", "33,71", "32,70", "31,70", "31,69", "31,68", "30,68", "29,68", "28,68", "42,71", "43,71", "44,70", "45,70", "41,70", "40,70", "40,69", "41,69", "42,69", "43,69", "44,69", "45,69", "39,69", "46,26", "46,25", "46,24", "46,23", "47,23", "48,23", "48,24", "48,25", "48,26", "47,26", "39,23", "40,23", "40,22", "41,22", "42,22", "42,21", "42,20", "42,19", "42,18", "41,18", "40,18", "40,19", "39,20", "37,21", "38,21", "39,21", "37,22", "38,22", "99,84", "99,85", "99,86", "98,86", "97,86", "97,85", "97,84", "98,84", "99,102", "99,103", "98,103", "97,103", "97,104", "96,104", "96,105", "96,106", "95,106", "95,107", "94,107", "93,107", "93,106", "92,106", "91,106", "91,105", "92,105", "93,105", "93,104", "93,103", "93,102", "94,102", "94,101", "93,101", "92,101", "91,101", "90,101", "89,101", "88,100", "89,100", "90,100", "91,100", "91,99", "91,98", "91,97", "92,97", "93,97", "94,97", "94,96", "95,96", "96,96", "96,97", "96,98", "95,98", "94,98", "96,99", "85,93", "86,93", "87,93", "87,94", "87,95", "86,95", "85,95", "85,94", "85,93",
      "98,102", "93,100", "93,99", "93,98", "94,100", "94,99", "21,80", "21,79", "42,96", "43,96", "43,97", "43,98", "43,99", "43,100", "43,95", "43,56", "43,55", "49,24", "49,25", "49,26","95,102", "96,102", "97,102", 
      ].forEach(coord => {
        let [x,y] = coord.split(",");
        walls[utils.asGridCoord(x,y)] = true;
      })
      return walls;
    }(),
  },
 
  DiningRoom: {
    id: "DiningRoom",
    lowerSrc: "assets/images/maps/fondo1.png",
    upperSrc: "assets/images/maps/fondo2.png",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        //x: utils.withGrid(5),
        //y: utils.withGrid(8),
      }),
      diningRoomNpcA: new Person({
        x: utils.withGrid(21),
        y: utils.withGrid(9),
        src: "assets/images/characters/people/npc10.png",
        behaviorLoop: [
          { type: "stand", direction: "right", time: 1000, },
          { type: "stand", direction: "up", time: 200, },
        ],
        talking: [
          {
            required: ["diningRoomBattle"],
            events: [
              { type: "textMessage", text: "No deber'ias meterte en conversaciones ajenas", faceHero: "diningRoomNpcA" },
            ]
          },
          {
            events: [

              { type: "textMessage", text: "No se que hacer, el señor del mercado me cobro 3 dinero1 dolares por $$\\frac{{1}}{{2}}\$$ kg manzana1... ", img:" " },
              { type: "textMessage", text: "¿o sera que ya subieron de precio? ", img:" " },
              { type: "textMessage", text: "OYE!!!... No deberías meterte en conversaciones ajenas", faceHero: "diningRoomNpcA", img:"assets/images/characters/people/rostros/rostroi.png" },
              { who: "hero", type: "walk",  direction: "down" },
              { who: "hero", type: "walk",  direction: "down" },
              
            ]
          },
        ]
      }),
      diningRoomNpcB: new Person({
        x: utils.withGrid(24),
        y: utils.withGrid(9),
        src: "assets/images/characters/people/npcb.png",
        behaviorLoop: [
          { type: "stand", direction: "left", time: 1000, },
          
        ],
        talking: [
          {
            events: [
              { type: "textMessage", text: "Ey........", img:" "},
              { who: "hero", type: "walk",  direction: "down" },
              { who: "hero", type: "walk",  direction: "down" },
            ]
          },
        ]
      }),
      diningRoomNpcD: new Person({
        x: utils.withGrid(-3),
        y: utils.withGrid(39),
        src: "assets/images/characters/people/npcd.png",
        behaviorLoop: [
          { type: "stand", direction: "right", time: 1200, },
          { type: "stand", direction: "down", time: 900, },
          { type: "stand", direction: "left", time: 800, },
          { type: "stand", direction: "down", time: 700, },
          { type: "stand", direction: "right", time: 400, },
          { type: "stand", direction: "up", time: 800, },
        ],
        talking: [
          {
            events: [
              { type: "textMessage", text: "Te diriges hacia el pueblo?", faceHero: "diningRoomNpcD", img: "assets/images/characters/people/rostros/rostrodd.png"},
              { type: "textMessage", text: "Ahi podrás encontrar mas personas de las cuales aprenderás mucho", faceHero: "diningRoomNpcD", img: "assets/images/characters/people/rostros/rostrodd.png" },
              { type: "textMessage", text: "Recuerda la clave es platicar con todos así podrás aprender cosas nuevas", faceHero: "diningRoomNpcD", img: "assets/images/characters/people/rostros/rostrodd.png" },
            ]
          },
        ]
      }),
    },
    cutsceneSpaces: {
      [utils.asGridCoord(9,2)]: [
        {
          events: [
            {
              type: "changeMap",
              map: "Kitchen",
              x: utils.withGrid(14),
              y: utils.withGrid(38),
              direction: "up"
            }
          ]
        }
      ],
      [utils.asGridCoord(27,9)]: [
        {
          events: [
            { 
              type: "changeMap", 
              map: "Street",
              x: utils.withGrid(-6),
              y: utils.withGrid(36),
              direction: "right"
            }
          ]
        }
      ],


      [utils.asGridCoord(27,10)]: [
        {
          events: [
            {
              type: "changeMap",
              map: "Street",
              x: utils.withGrid(-6),
              y: utils.withGrid(37),
              direction: "right"
            }
          ]
        }
      ],
      [utils.asGridCoord(27,11)]: [
        {
          events: [
            {
              type: "changeMap",
              map: "Street",
              x: utils.withGrid(-6),
              y: utils.withGrid(38),
              direction: "right"
            }
          ]
        }
      ],
      [utils.asGridCoord(27,12)]: [
        {
          events: [
            {
              type: "changeMap",
              map: "Street",
              x: utils.withGrid(-6),
              y: utils.withGrid(39),
              direction: "right"
            }
          ]
        }
      ],
      [utils.asGridCoord(27,13)]: [
        {
          events: [
            {
              type: "changeMap",
              map: "Street",
              x: utils.withGrid(-6),
              y: utils.withGrid(40),
              direction: "right"
            }
          ]
        }
      ],
      [utils.asGridCoord(-6,42)]: [
        {
          events: [
            {
              type: "changeMap",
              map: "Shop",
              x: utils.withGrid(104),
              y: utils.withGrid(60),
              direction: "left"
            }
          ]
        }
      ],



      [utils.asGridCoord(-6,43)]: [
        {
          events: [
            {
              type: "changeMap",
              map: "Shop",
              x: utils.withGrid(104),
              y: utils.withGrid(61),
              direction: "left"
            }
          ]
        }
      ],
      [utils.asGridCoord(-6,44)]: [
        {
          events: [
            {
              type: "changeMap",
              map: "Shop",
              x: utils.withGrid(104),
              y: utils.withGrid(62),
              direction: "left"
            }
          ]
        }
      ],
      [utils.asGridCoord(-6,45)]: [
        {
          events: [
            {
              type: "changeMap",
              map: "Shop",
              x: utils.withGrid(104),
              y: utils.withGrid(63),
              direction: "left"
            }
          ]
        }
      ],
      [utils.asGridCoord(-6,46)]: [
        {
          events: [
            {
              type: "changeMap",
              map: "Shop",
              x: utils.withGrid(104),
              y: utils.withGrid(64),
              direction: "left"
            }
          ]
        }
      ],
    },
    walls: {
      [utils.asGridCoord(7,0)]: true,
      [utils.asGridCoord(7,1)]: true,
      [utils.asGridCoord(7,2)]: true,
      [utils.asGridCoord(7,3)]: true,
      [utils.asGridCoord(7,4)]: true,
      [utils.asGridCoord(7,5)]: true,
      [utils.asGridCoord(6,5)]: true,
      [utils.asGridCoord(5,5)]: true,
      [utils.asGridCoord(4,6)]: true,
      [utils.asGridCoord(4,7)]: true,
      [utils.asGridCoord(4,8)]: true,
      [utils.asGridCoord(4,9)]: true,
      [utils.asGridCoord(4,10)]: true,
      [utils.asGridCoord(4,11)]: true,
      [utils.asGridCoord(4,12)]: true,
      [utils.asGridCoord(4,13)]: true,
      [utils.asGridCoord(4,14)]: true,
      [utils.asGridCoord(4,15)]: true,
      [utils.asGridCoord(4,16)]: true,
      [utils.asGridCoord(4,17)]: true,
      [utils.asGridCoord(4,18)]: true,
      [utils.asGridCoord(4,19)]: true,
      [utils.asGridCoord(4,20)]: true,
      [utils.asGridCoord(3,20)]: true,
      [utils.asGridCoord(2,20)]: true,
      [utils.asGridCoord(1,20)]: true,
      [utils.asGridCoord(0,20)]: true,
      [utils.asGridCoord(-1,20)]: true,
      [utils.asGridCoord(-2,21)]: true,
      [utils.asGridCoord(-2,22)]: true,
      [utils.asGridCoord(-2,23)]: true,
      [utils.asGridCoord(-2,24)]: true,
      [utils.asGridCoord(-2,25)]: true,
      [utils.asGridCoord(-2,26)]: true,
      [utils.asGridCoord(-2,27)]: true,
      [utils.asGridCoord(-2,28)]: true,
      [utils.asGridCoord(-2,29)]: true,
      [utils.asGridCoord(-1,29)]: true,
      [utils.asGridCoord(0,29)]: true,
      [utils.asGridCoord(1,29)]: true,
      [utils.asGridCoord(1,30)]: true,
      [utils.asGridCoord(1,31)]: true,
      [utils.asGridCoord(1,32)]: true,
      [utils.asGridCoord(1,33)]: true,
      [utils.asGridCoord(1,34)]: true,
      [utils.asGridCoord(1,35)]: true,
      [utils.asGridCoord(1,36)]: true,
      [utils.asGridCoord(1,37)]: true,
      [utils.asGridCoord(1,38)]: true,
      [utils.asGridCoord(0,38)]: true,
      [utils.asGridCoord(-1,38)]: true,
      [utils.asGridCoord(-2,38)]: true,
      [utils.asGridCoord(-3,38)]: true,
      [utils.asGridCoord(-4,38)]: true,
      [utils.asGridCoord(-5,39)]: true,
      [utils.asGridCoord(-5,40)]: true,
      [utils.asGridCoord(-5,41)]: true,
      [utils.asGridCoord(-6,41)]: true,
      [utils.asGridCoord(-7,41)]: true,


      [utils.asGridCoord(-7,47)]: true,
      [utils.asGridCoord(-6,47)]: true,
      [utils.asGridCoord(-5,47)]: true,
      [utils.asGridCoord(-4,47)]: true,
      [utils.asGridCoord(-3,47)]: true,
      [utils.asGridCoord(-2,47)]: true,
      [utils.asGridCoord(-1,46)]: true,
      [utils.asGridCoord(-1,45)]: true,
      [utils.asGridCoord(-1,44)]: true,
      [utils.asGridCoord(0,44)]: true,
      [utils.asGridCoord(1,44)]: true,
      [utils.asGridCoord(2,43)]: true,
      [utils.asGridCoord(2,42)]: true,
      [utils.asGridCoord(2,41)]: true,
      [utils.asGridCoord(3,41)]: true,
      [utils.asGridCoord(4,41)]: true,
      [utils.asGridCoord(5,40)]: true,
      [utils.asGridCoord(5,39)]: true,
      [utils.asGridCoord(5,38)]: true,
      [utils.asGridCoord(5,37)]: true,
      [utils.asGridCoord(5,36)]: true,
      [utils.asGridCoord(5,35)]: true,
      [utils.asGridCoord(5,34)]: true,
      [utils.asGridCoord(5,33)]: true,
      [utils.asGridCoord(5,32)]: true,
      [utils.asGridCoord(5,31)]: true,
      [utils.asGridCoord(5,30)]: true,
      [utils.asGridCoord(5,29)]: true,
      [utils.asGridCoord(5,28)]: true,
      [utils.asGridCoord(5,27)]: true,
      [utils.asGridCoord(4,26)]: true,
      [utils.asGridCoord(3,26)]: true,
      [utils.asGridCoord(2,26)]: true,
      [utils.asGridCoord(2,25)]: true,
      [utils.asGridCoord(2,24)]: true,
      [utils.asGridCoord(2,23)]: true,
      [utils.asGridCoord(3,23)]: true,
      [utils.asGridCoord(4,23)]: true,
      [utils.asGridCoord(5,23)]: true,
      [utils.asGridCoord(6,23)]: true,
      [utils.asGridCoord(7,23)]: true,
      [utils.asGridCoord(8,22)]: true,
      [utils.asGridCoord(8,21)]: true,
      [utils.asGridCoord(8,20)]: true,
      [utils.asGridCoord(8,19)]: true,
      [utils.asGridCoord(8,18)]: true,
      [utils.asGridCoord(8,17)]: true,
      [utils.asGridCoord(8,16)]: true,
      [utils.asGridCoord(8,15)]: true,
      [utils.asGridCoord(8,14)]: true,
      [utils.asGridCoord(9,14)]: true,
      [utils.asGridCoord(10,14)]: true,
      [utils.asGridCoord(11,14)]: true,
      [utils.asGridCoord(12,14)]: true,
      [utils.asGridCoord(13,14)]: true,
      [utils.asGridCoord(14,14)]: true,
      [utils.asGridCoord(15,14)]: true,
      [utils.asGridCoord(16,14)]: true,
      [utils.asGridCoord(17,13)]: true,
      [utils.asGridCoord(17,12)]: true,
      [utils.asGridCoord(17,11)]: true,
      [utils.asGridCoord(18,11)]: true,
      [utils.asGridCoord(19,11)]: true,
      [utils.asGridCoord(20,14)]: true,
      [utils.asGridCoord(21,14)]: true,
      [utils.asGridCoord(22,14)]: true,
      [utils.asGridCoord(23,14)]: true,
      [utils.asGridCoord(24,14)]: true,
      [utils.asGridCoord(25,14)]: true,
      [utils.asGridCoord(26,14)]: true,
      [utils.asGridCoord(27,14)]: true,
      [utils.asGridCoord(28,14)]: true,
      [utils.asGridCoord(19,12)]: true,
      [utils.asGridCoord(19,13)]: true,
      [utils.asGridCoord(28,8)]: true,
      [utils.asGridCoord(27,8)]: true,
      [utils.asGridCoord(26,8)]: true,
      [utils.asGridCoord(25,8)]: true,
      [utils.asGridCoord(24,8)]: true,
      [utils.asGridCoord(23,8)]: true,
      [utils.asGridCoord(22,8)]: true,
      [utils.asGridCoord(21,8)]: true,
      [utils.asGridCoord(20,8)]: true,
      [utils.asGridCoord(19,8)]: true,
      [utils.asGridCoord(18,8)]: true,
      [utils.asGridCoord(17,8)]: true,
      [utils.asGridCoord(16,8)]: true,
      [utils.asGridCoord(15,8)]: true,
      [utils.asGridCoord(14,8)]: true,
      [utils.asGridCoord(13,9)]: true,
      [utils.asGridCoord(13,10)]: true,
      [utils.asGridCoord(13,11)]: true,
      [utils.asGridCoord(12,11)]: true,
      [utils.asGridCoord(11,11)]: true,
      [utils.asGridCoord(10,11)]: true,
      [utils.asGridCoord(9,11)]: true,
      [utils.asGridCoord(8,11)]: true,
      [utils.asGridCoord(8,10)]: true,
      [utils.asGridCoord(8,9)]: true,
      [utils.asGridCoord(8,8)]: true,
      [utils.asGridCoord(9,8)]: true,
      [utils.asGridCoord(10,8)]: true,
      [utils.asGridCoord(11,7)]: true,
      [utils.asGridCoord(11,6)]: true,
      [utils.asGridCoord(11,5)]: true,
      [utils.asGridCoord(11,4)]: true,
      [utils.asGridCoord(11,3)]: true,
      [utils.asGridCoord(11,2)]: true,
      [utils.asGridCoord(11,1)]: true,
      [utils.asGridCoord(11,0)]: true,
      [utils.asGridCoord(10,2)]: true,
      [utils.asGridCoord(8,2)]: true,
    }
  },
}