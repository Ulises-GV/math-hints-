let currentMapName = '';
let musica= null;
let cancion=null;


class OverworldEvent {
  constructor({ map, event}) {
    this.map = map;
    this.event = event;
  }

  stand(resolve) {
    const who = this.map.gameObjects[ this.event.who ];
    who.startBehavior({
      map: this.map
    }, {
      type: "stand",
      direction: this.event.direction,
      time: this.event.time
    })
    
    //Set up a handler to complete when correct person is done walking, then resolve the event
    const completeHandler = e => {
      if (e.detail.whoId === this.event.who) {
        document.removeEventListener("PersonStandComplete", completeHandler);
        resolve();
      }
    }
    document.addEventListener("PersonStandComplete", completeHandler)
  }

  walk(resolve) {
    const who = this.map.gameObjects[ this.event.who ];
    who.startBehavior({
      map: this.map
    }, {
      type: "walk",
      direction: this.event.direction,
      retry: true
    })

    //Set up a handler to complete when correct person is done walking, then resolve the event
    const completeHandler = e => {
      if (e.detail.whoId === this.event.who) {
        document.removeEventListener("PersonWalkingComplete", completeHandler);
        resolve();
      }
    }
    document.addEventListener("PersonWalkingComplete", completeHandler)
  }

  textMessage(resolve) {

    if (this.event.faceHero) {
      const obj = this.map.gameObjects[this.event.faceHero];
      obj.direction = utils.oppositeDirection(this.map.gameObjects["hero"].direction);
    }

    var messageData = new MessageData();
    const message = new TextMessage({
      text: this.event.text,
      img: this.event.img,
      messageData: messageData,
      onComplete: () => resolve()
    })
    message.init( document.querySelector(".game-container") )
  }


  changeMap(resolve) {

    //desactivar los objetos viejos
    Object.values(this.map.gameObjects).forEach(obj => {
      obj.isMounted = false;
      //console.log("nel perro")
    })  


  /*const newMapConfig = window.OverworldMaps[this.event.map];
   // Detener el audio si el próximo mapa no tiene el evento audioMap definido
   const velda = cancion!=newMapConfig.backgroundMusic
   if (musica && newMapConfig.backgroundMusic) {
    console.log(newMapConfig.backgroundMusic)
    musica.play();
    this.map.backgroundMusic = null
  }else if(musica){
    musica.pause();
  }*/

    currentMapName=this.event.map;


    //console.log((this.event.map))
    const sceneTransition = new SceneTransition();
    sceneTransition.init(document.querySelector(".game-container"), () => {
      this.map.overworld.startMap( window.OverworldMaps[this.event.map], {
        x: this.event.x,
        y: this.event.y,
        direction: this.event.direction,
      });

     /* if (newMapConfig.backgroundMusic ) {
        const audioElement = new Audio(newMapConfig.backgroundMusic);
        audioElement.loop = true;
        audioElement.play();
        console.log(cancion)
        console.log(newMapConfig.backgroundMusic)
        musica = audioElement;
        cancion = newMapConfig.backgroundMusic
      }*/

      resolve();
      sceneTransition.fadeOut();
      
    })
  }

  battle(resolve) {
    const battle = new Battle({
      enemy: Enemies[this.event.enemyId],
      arena: this.event.arena || null,
      onComplete: (didWin) => {
        resolve(didWin ? "WON_BATTLE" : "LOST_BATTLE");
      }
    })
    battle.init(document.querySelector(".game-container"));

  }

  pause(resolve) {
    this.map.isPaused = true;
    const menu = new PauseMenu({
      progress: this.map.overworld.progress,
      onComplete: () => {
        resolve();
        this.map.isPaused = false;
        this.map.overworld.startGameLoop();
      }
    });
    menu.init(document.querySelector(".game-container"));
  }

  addStoryFlag(resolve) {
    window.playerState.storyFlags[this.event.flag] = true;
    resolve();
  }

  craftingMenu(resolve) {
    const menu = new CraftingMenu({
      personaje: this.event.personaje,
      onComplete: () => {
        resolve();
      }
    })
    menu.init(document.querySelector(".game-container"))
  }
  giveXp(resolve) {
    let amount = this.event.xp;
    const {combatant} = this.event;
    const step = () => {
      if (amount > 0) {
        amount -= 1;
        combatant.xp += 1;

        //Check if we've hit level up point
        if (combatant.xp === combatant.maxXp) {
          combatant.xp = 0;
          combatant.maxXp = 100;
          combatant.level += 1;
        }

        combatant.update();
        requestAnimationFrame(step);
        return;
      }
      resolve();
    }
    requestAnimationFrame(step);
  }

  init() {
    return new Promise(resolve => {
      this[this.event.type](resolve)      
    })
  }

}