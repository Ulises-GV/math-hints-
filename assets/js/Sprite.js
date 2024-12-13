class Sprite {
  constructor(config) {

    //Set up the image
    this.image = new Image();
    this.image.src = config.src;
    this.image.onload = () => {
      this.isLoaded = true;
    }

    //Shadow
    this.shadow = new Image();
    this.useShadow = true; //config.useShadow || false
    if (this.useShadow) {
      this.shadow.src = "assets/images/characters/shadow.png";
    }
    this.shadow.onload = () => {
      this.isShadowLoaded = true;
    }

    //Configure Animation & Initial State
    this.animations = config.animations || {
      "idle-down" : [ [1,0] ],
      "idle-right": [ [1,2] ],
      "idle-up"   : [ [1,3] ],
      "idle-left" : [ [1,1] ],
      "walk-down" : [ [0,0],[1,0],[2,0],[1,0], ],
      "walk-right": [ [0,2],[1,2],[2,2],[1,2], ],
      "walk-up"   : [ [0,3],[1,3],[2,3],[1,3], ],
      "walk-left" : [ [0,1],[1,1],[2,1],[1,1], ],
    }
    this.currentAnimation = config.currentAnimation || "idle-down";
    this.currentAnimationFrame = 0;

    this.animationFrameLimit = config.animationFrameLimit || 10;
    this.animationFrameProgress = this.animationFrameLimit;
    

    //Reference the game object
    this.gameObject = config.gameObject;
    this.hero = config.gameObject.hero;
  }

  get frame() {
    return this.animations[this.currentAnimation][this.currentAnimationFrame]
  }

  setAnimation(key) {
    if (this.currentAnimation !== key) {
      this.currentAnimation = key;
      this.currentAnimationFrame = 0;
      this.animationFrameProgress = this.animationFrameLimit;
    }
  }

  updateAnimationProgress() {
    //Downtick frame progress
    if (this.animationFrameProgress > 0) {
      this.animationFrameProgress -= 1;
      return;
    }

    //Reset the counter
    this.animationFrameProgress = this.animationFrameLimit;
    this.currentAnimationFrame += 1;

    if (this.frame === undefined) {
      this.currentAnimationFrame = 0
    }


  }
  

  draw(ctx, hero) {
    let x, y;
    
    if (hero) {
        x = this.gameObject.x - 8 + utils.withGrid(21) - hero.x;
        y = this.gameObject.y - 18 + utils.withGrid(18) - hero.y;
    } else if(count===1){
      //console.log(position.y)
      /*if(currentMapName===""){
        x = this.gameObject.x - 8 + utils.withGrid(21)-position.x;
        y = this.gameObject.y - 18 + utils.withGrid(18)-utils.withGrid(12);
      }else{
        x = this.gameObject.x - 8 + utils.withGrid(21)-position.x;
        y = this.gameObject.y - 18 + utils.withGrid(18)-utils.withGrid(18.5);
      }*/
      //console.log(direccion)
     // if(currentMapName==="" || currentMapName==="DemoRoom" ){
     //   x = this.gameObject.x - 8 + utils.withGrid(21)-utils.withGrid(9);
     //   y = this.gameObject.y - 18 + utils.withGrid(18)-utils.withGrid(10);
     // }else{
        if(direccion === "bottom"){
          x = this.gameObject.x - 8 + utils.withGrid(21) - position.x;
          y = this.gameObject.y - 18 + utils.withGrid(18) - mapAltura - utils.withGrid(18.5);
        }else if(direccion === "top"){
          x = this.gameObject.x - 8 + utils.withGrid(21)-position.x;
          y = this.gameObject.y - 18 + utils.withGrid(18)- utils.withGrid(18.5);
        }
        //console.log("ora ora ", y);
      //}
    }else if(count===2){
      //if(currentMapName==="" || currentMapName==="DemoRoom"){
       // x = this.gameObject.x - 8 + utils.withGrid(12);
        //y = this.gameObject.y - 18 + utils.withGrid(8);
      //}else{
        if(direccion==="right"){
          x = this.gameObject.x - 8 + utils.withGrid(21)- mapAncho -utils.withGrid(10.5);
          y = this.gameObject.y - 18 + utils.withGrid(18) - position.y;
        }else if(direccion==="left"){
          x = this.gameObject.x - 8 + utils.withGrid(21) - utils.withGrid(10.5);
          y = this.gameObject.y - 18 + utils.withGrid(18) - position.y;
        }
      //}
    }else if(count ===3){
      //console.log("sapeeeeee")
      //if(currentMapName===""){
       // x = this.gameObject.x - 8 + utils.withGrid(12);
        //y = this.gameObject.y - 18 + utils.withGrid(8);
      //}else{
        if(direccion==="corner1"){
          x = this.gameObject.x - 8 + utils.withGrid(21) - utils.withGrid(10.5) ;
          y = this.gameObject.y - 18 -4;
        }else if(direccion==="corner2"){
          x = this.gameObject.x - 8 + utils.withGrid(21)- mapAncho -utils.withGrid(10.5);
          y = this.gameObject.y - 18 -4;
        
        }else if(direccion==="corner3"){
          x = this.gameObject.x - 8  + utils.withGrid(21)- mapAncho -utils.withGrid(10.5);
          y = this.gameObject.y - 18 + utils.withGrid(18) - mapAltura - utils.withGrid(18.5);
      
        }else if(direccion==="corner4"){
          x = this.gameObject.x - 8 + utils.withGrid(21) - utils.withGrid(10.5);
          y = this.gameObject.y - 18 + utils.withGrid(18) - mapAltura - utils.withGrid(18.5);
        }
      //}  
    }

    this.isShadowLoaded && ctx.drawImage(this.shadow, x, y);

    const [frameX, frameY] = this.frame;

    this.isLoaded && ctx.drawImage(this.image,
        frameX * 49, frameY * 49,
        49,49,
        x+3,y+2,
        28,28
    );

    this.updateAnimationProgress();
  }
}