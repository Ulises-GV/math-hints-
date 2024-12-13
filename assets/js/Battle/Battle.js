class Battle {
  constructor({ enemy, onComplete, arena }) {

    this.enemy = enemy;
    this.onComplete = onComplete;
    this.arena = arena;

    this.combatants = {
    }

    this.activeCombatants = {
      player: null, //"player1",
      enemy: null, //"enemy1",
    }

    //Dynamically add the Player team
    window.playerState.lineup.forEach(id => {
      this.addCombatant(id, "player", window.playerState.personaje[id])
    });
    //Now the enemy team
    Object.keys(this.enemy.personaje).forEach(key => {
      this.addCombatant("e_"+key, "enemy", this.enemy.personaje[key])
    })


    //Start empty
    this.items = []

    //Add in player items
    window.playerState.items.forEach(item => {
      this.items.push({
        ...item,
        team: "player"
      })
    })

    this.usedInstanceIds = {};

  }

  addCombatant(id, team, config) {
      this.combatants[id] = new Combatant({
        ...Personaje[config.personajeId],
        ...config,
        team,
        isPlayerControlled: team === "player"
      }, this)

      //Populate first active pizza
      this.activeCombatants[team] = this.activeCombatants[team] || id
  }

  handleFinishBattleClick() {
    // Add logic here to handle the end of the battle
    // For example, triggering the onComplete callback
    //console.log("como ta muchacho")
    this.element.remove();
    this.onComplete();
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("Battle");

    // If provided, add a CSS class for setting the arena background
    if (this.arena) {
      this.element.classList.add(this.arena);
    }

    this.element.innerHTML = (`
    <div class="Battle_hero">
      <img src="${'assets/images/characters/people/npc0.png'}" alt="Hero" />
    </div>
    <div class="Battle_enemy">
      <img src=${this.enemy.src} alt=${this.enemy.name} />
    </div>
    <button class="finish-battle-btn">Salir</button>
    `)
  }

  getHeroImage() {
    return this.element.querySelector(".Battle_hero img");
  }

  getEnemyImage() {
    return this.element.querySelector(".Battle_enemy img");
  }

  init(container) {
    this.createElement();
    container.appendChild(this.element);

    const finishButton = this.element.querySelector('.finish-battle-btn');
    finishButton.addEventListener('click', () => {
      this.handleFinishBattleClick();
    });

    this.playerTeam = new Team("player", "Hero");
    this.enemyTeam = new Team("enemy", "Bully");

    Object.keys(this.combatants).forEach(key => {
      let combatant = this.combatants[key];
      combatant.id = key;
      combatant.init(this.element)
      
      //Add to correct team
      if (combatant.team === "player") {
        this.playerTeam.combatants.push(combatant);
      } else if (combatant.team === "enemy") {
        this.enemyTeam.combatants.push(combatant);
      }
    })

    this.playerTeam.init(this.element);
    this.enemyTeam.init(this.element);

    this.turnCycle = new TurnCycle({
      battle: this,
      onNewEvent: event => {
        return new Promise(resolve => {
          const battleEvent = new BattleEvent(event, this)
          battleEvent.init(resolve);
        })
      },
      onWinner: winner => {

        if (winner === "player") {
          const playerState = window.playerState;
          Object.keys(playerState.personaje).forEach(id => {
            const playerStatePersonaje = playerState.personaje[id];
            const combatant = this.combatants[id];
            if (combatant) {
              playerStatePersonaje.hp = combatant.hp;
              playerStatePersonaje.xp = combatant.xp;
              playerStatePersonaje.maxXp = combatant.maxXp;
              playerStatePersonaje.level = combatant.level;
            }
          })

          //Get rid of player used items
          playerState.items = playerState.items.filter(item => {
            return !this.usedInstanceIds[item.instanceId]
          })

          //Send signal to update
          utils.emitEvent("PlayerStateUpdated");
        }

        this.element.remove();
        this.onComplete(winner === "player");
      }
    })
    this.turnCycle.init();


  }

}