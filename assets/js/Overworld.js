let position=0;
let count =0;
let mapAltura= 0;
let mapAncho = 0;
let direccion = '';
class Overworld {
 constructor(config) {
   this.element = config.element;
   this.canvas = this.element.querySelector(".game-canvas");
   this.ctx = this.canvas.getContext("2d");
   this.map = null;
   this.isCamaraActive=  false;
 }

 /*gameLoopStepWork(delta){
      //Clear off the canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      //Establish the camera person
      const cameraPerson = this.map.gameObjects.hero;

      //Update all objects
      Object.values(this.map.gameObjects).forEach(object => {
        object.update({
            delta,  
            arrow: this.directionInput.direction,
            map: this.map,
        }) 
     })
      

      //Draw Lower layer
      this.map.drawLowerImage(this.ctx, cameraPerson);

      //Draw Game Objects
      Object.values(this.map.gameObjects).sort((a,b) => {
        return a.y - b.y;
      }).forEach(object => {
        object.sprite.draw(this.ctx, cameraPerson);
      })

      //Draw Upper layer
      this.map.drawUpperImage(this.ctx, cameraPerson);
    }  */

    /*gameLoopStepWork(delta){
      //Clear off the canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  
      //Establish the camera person
      const cameraPerson = this.map.gameObjects.hero;
  
      //Update all objects
      Object.values(this.map.gameObjects).forEach(object => {
          object.update({
              delta,  
              arrow: this.directionInput.direction,
              map: this.map,
          }) 
      });
  
      //Draw Lower layer
      this.map.drawLowerImage(this.ctx, cameraPerson);
  
      //Draw Game Objects
      Object.values(this.map.gameObjects).sort((a,b) => {
          return a.y - b.y;
      }).forEach(object => {
          object.sprite.draw(this.ctx,cameraPerson);
      });
  
      //Draw Upper layer
      this.map.drawUpperImage(this.ctx,cameraPerson);
  }*/
  gameLoopStepWork(delta) {
    // Limpiar el lienzo
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Obtener el objeto del héroe
    const hero = this.map.gameObjects.hero;
    position = this.map.gameObjects.hero;

    // Actualizar todos los objetos
    Object.values(this.map.gameObjects).forEach(object => {
        object.update({
            delta,
            arrow: this.directionInput.direction,
            map: this.map,
        });
    });


     const distanceToLeftEdge = hero.x - utils.withGrid(10.5);
     const distanceToRightEdge = this.map.lowerImage.width - hero.x - this.canvas.width + utils.withGrid(10.5);
     const distanceToTopEdge = this.canvas.height - hero.y; // Distancia hacia arriba
     const distanceToBottomEdge = this.map.lowerImage.height - hero.y;
     
     //const distanceToBottomEdge2= this.map.lowerImage.height-distanceToTopEdge
    // console.log("x", position.x)
     //console.log("y", position.y)
     //console.log("rai",distanceToRightEdge)

     //console.log(this.canvas.width)
     //console.log(this.map.lowerImage.width)
     //console.log(mapAncho)
     mapAltura=this.map.lowerImage.height - this.canvas.height;
     mapAncho =this.map.lowerImage.width - this.canvas.width;
     // Realizar alguna acción basada en la distancia al borde superior
     //console.log(distanceToTopEdge);
    
    
    // console.log(distanceToBottomEdge)
     /*if (distanceToTopEdge < 148 && currentMapName!='' ||distanceToBottomEdge < 152 && currentMapName!='' ) {
         // El personaje está cerca del borde superior de la imagen del mapa
         // Puedes realizar alguna acción aquí
         this.isCamaraActive= false;
        count =1
       //  console.log("El personaje está cerca del borde superior.");
     }else if(distanceToTopEdge < 204 && currentMapName==='' ){
      this.isCamaraActive=false;
      count=1
   /* }else if(distanceToBottomEdge >222 && currentMapName!=''){
      this.isCamaraActive=true;
      console.log("holiiii")
      count=1

    }else if(distanceToBottomEdge < 150  && currentMapName===''){
      this.isCamaraActive=false;
      count=1*/
     /*}else{
      this.isCamaraActive=true;
      count=1
     }*/


     /*if(distanceToTopEdge < 148 && currentMapName!=''){
       if(distanceToBottomEdge < 150 && currentMapName!=''){ 
         this.isCamaraActive=true;
         direccion="bottom"
         count=1
         //console.log("hola pinche putita")
       }else{
         this.isCamaraActive=false;
         direccion="top"
         count=1
        // console.log("te pones bien cachonda")
       }

     }else{
      this.isCamaraActive=true;
      count=1
     }*/

     //console.log(currentMapName)
    /*if(currentMapName==="" || currentMapName==="DemoRoom"){
      this.isCamaraActive=true
      count=1*/

    if(distanceToLeftEdge < 0 && distanceToTopEdge > 148 ){ 
      this.isCamaraActive=true;
      direccion="corner1"
      count=3;
      //console.log("hola pinche putita")
    }else if(distanceToRightEdge < 0 && distanceToTopEdge > 148 ){ 
      this.isCamaraActive=true;
      direccion="corner2"
      count=3;
      //console.log("hola pinche putita")
    }else if(distanceToRightEdge < 0 && distanceToBottomEdge < 150 ){ 
      this.isCamaraActive=true;
      direccion="corner3"
      count=3;
      //console.log("hola pinche putita")
    }else if(distanceToLeftEdge < 0 && distanceToBottomEdge < 150){ 
      this.isCamaraActive=true;
      direccion="corner4"
      count=3;
      //console.log("hola pinche putita")  

    }else if(distanceToTopEdge > 148){
      this.isCamaraActive=true;
        direccion="top"
        count=1
       // console.log("te pones bien cachonda")
    }else if(distanceToBottomEdge < 150){ 
        this.isCamaraActive=true;
        direccion="bottom"
        count=1
        //console.log("hola pinche putita")
    }else if(distanceToLeftEdge < 0){
        this.isCamaraActive=true;
        direccion="left"
        count=2
     // console.log("te pones bien cachonda")
    }else if(distanceToRightEdge < 0 ){ 
      this.isCamaraActive=true;
      direccion="right"
      count=2
      //console.log("hola pinche putita")

    }else{
     this.isCamaraActive=false;
     //count=1
    }



    /*if(distanceToLeftEdge < 0 && currentMapName!=''){
      this.isCamaraActive=true;
        direccion="left"
        count=2
       // console.log("te pones bien cachonda")
    }else if(distanceToRightEdge < 0 && currentMapName!=''){ 
        this.isCamaraActive=true;
        direccion="right"
        count=2
        console.log("hola pinche putita")

    }else{
     this.isCamaraActive=false;
     //count=2
    }*/


     
     if ((this.isCamaraActive)) {
      this.map.drawLowerImage(this.ctx);
      Object.values(this.map.gameObjects).sort((a, b) => {
        return a.y - b.y;
      }).forEach(object => {
        object.sprite.draw(this.ctx); // No se pasa la cámara,
      });
      this.map.drawUpperImage(this.ctx);

    } else {
        // Dibujar la capa inferior del mapa
      this.map.drawLowerImage(this.ctx, hero);
      Object.values(this.map.gameObjects).sort((a, b) => {
        return a.y - b.y;
      }).forEach(object => {
        object.sprite.draw(this.ctx, hero); 
      });
      this.map.drawUpperImage(this.ctx, hero);
      }

}






  // Draw Lower layer
  /*gameLoopStepWork(delta) {
    // Clear off the canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  
    // Establish the camera person
    const cameraPerson = this.map.gameObjects.hero;
    const mapOffsetX = Math.max(utils.withGrid(10.5) - cameraPerson.x, 0);
    const mapOffsetY = Math.max(utils.withGrid(14) - cameraPerson.y, 0);
  
    // Check if the map edge collides with the canvas edge
    const mapEdgeCollidesWithCanvasEdge =
      (this.map.lowerImage.width - mapOffsetX <= this.canvas.width) ||
      (this.map.lowerImage.height - mapOffsetY <= this.canvas.height);
  
    // Draw Lower layer
    if (mapEdgeCollidesWithCanvasEdge) {
      this.map.drawLowerImage(this.ctx, cameraPerson);
    } else {
      this.map.drawLowerImage(this.ctx);
    }
  
    // Draw Game Objects
    Object.values(this.map.gameObjects).sort((a, b) => {
      return a.y - b.y;
    }).forEach(object => {
      if (mapEdgeCollidesWithCanvasEdge) {
        object.sprite.draw(this.ctx,cameraPerson);
      } else {
        object.sprite.draw(this.ctx);
      }
    });
  
    // Draw Upper layer
    if (mapEdgeCollidesWithCanvasEdge) {
      this.map.drawUpperImage(this.ctx,cameraPerson);
    } else {
      this.map.drawUpperImage(this.ctx);
    }
  }*/

 startGameLoop() {

  let previousMS;
  const step = 1/100;
  
  const stepFn = (timestampMs) => {

    if (this.map.isPaused) {
        return;
      }
  
      if(previousMS === undefined){
          previousMS = timestampMs;
      }
      let delta = (timestampMs-previousMS)/1000;
      while(delta >= step){
          this.gameLoopStepWork(delta);
          delta -= step; 
      }
      previousMS = timestampMs-delta*1000;
    
      requestAnimationFrame(stepFn)
  }
  requestAnimationFrame(stepFn)
  }
  

 bindActionInput() {
   new KeyPressListener("Enter", () => {
     //Is there a person here to talk to?
     this.map.checkForActionCutscene()
   })
   new KeyPressListener("Escape", () => {
     if (!this.map.isCutscenePlaying) {
      this.map.startCutscene([
        { type: "pause" }
      ])
     }
   })
  document.getElementById("enterButton").addEventListener("click", () => {
    // Llama a this.map.checkForActionCutscene() cuando se hace clic en el botón
    this.map.checkForActionCutscene();
  });
  document.getElementById("pausaButton").addEventListener("click", () => {
    // Llama a this.map.checkForActionCutscene() cuando se hace clic en el botón
    if (!this.map.isCutscenePlaying) {
      this.map.startCutscene([
        { type: "pause" }
      ])
     }
  });
 }

 bindHeroPositionCheck() {
   document.addEventListener("PersonWalkingComplete", e => {
     if (e.detail.whoId === "hero") {
       //Hero's position has changed
       this.map.checkForFootstepCutscene()
     }
   })
 }

 startMap(mapConfig, heroInitialState=null) {
  this.map = new OverworldMap(mapConfig);
  this.map.overworld = this;
  this.map.mountObjects();

  if (heroInitialState) {
    const {hero} = this.map.gameObjects;
    this.map.removeWall(hero.x, hero.y);
    hero.x = heroInitialState.x;
    hero.y = heroInitialState.y;
    hero.direction = heroInitialState.direction;
    this.map.addWall(hero.x, hero.y);
  }

  this.progress.mapId = mapConfig.id;
  this.progress.startingHeroX = this.map.gameObjects.hero.x;
  this.progress.startingHeroY = this.map.gameObjects.hero.y;
  this.progress.startingHeroDirection = this.map.gameObjects.hero.direction;

 }

 async init() {

  const container = document.querySelector(".game-container");

  //Create a new Progress tracker
  this.progress = new Progress();

  //Show the title screen
  this.titleScreen = new TitleScreen({
    progress: this.progress
  })
  const useSaveFile = await this.titleScreen.init(container);

  //Potentially load saved data
  let initialHeroState = null;
  if (useSaveFile) {
    this.progress.load();
    initialHeroState = {
      x: this.progress.startingHeroX,
      y: this.progress.startingHeroY,
      direction: this.progress.startingHeroDirection,
    }
  }

  //Load the HUD
  this.hud = new Hud();
  this.hud.init(container);

  //Start the first map
  this.startMap(window.OverworldMaps[this.progress.mapId], initialHeroState );

  //Create controls
  this.bindActionInput();
  this.bindHeroPositionCheck();

  this.directionInput = new DirectionInput();
  this.directionInput.init();

  
  this.startGameLoop();


   this.map.startCutscene([
  
   
    
        { type: "textMessage", text: "¡Bienvenido a una nueva aventura!", img: " "},
        { type: "textMessage", text: "Todos los personajes tienen algo que enseñarte, acércate a ellos y presiona ENTER para hablar", img: " "},
      
    
   
  ])


 }
}