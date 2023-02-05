//LOG


let songCount = 1;
let battleSongCount = 1;
let stg = 1;

// Selectors and variables
const game = document.querySelector('#game');
game.width = 800;
game.height = 497;
const ctx = game.getContext('2d'); //2d canvas
const movement = document.querySelector('#movement');



//=============================    computedStyles   ================================//
game.setAttribute('height', getComputedStyle(game)['height']);
game.setAttribute('width', getComputedStyle(game)['width']);


//=============================   HERO  ================================//
class Hero {
    constructor(x, y) {
        this.x = 30;
        this.y = 200;
        this.width = 22;
        this.height = 28;
        this.frameX = 1;
        this.frameY = 1;
        this.moving = true;
        this.alive = true;
        this.speed = 5;
        this.maxFrame = 3;
        this.minFrame = 0;
        this.battleGround = false;
        this.turn = false;
        this.heal = true;
        this.target = '';
        //==================STATS
        this.maxHp = 300;
        this.hp = 300;
        this.str = 9;
        this.att = 11;
        this.def = 9;
        this.lv = 1;
        this.xp = 0
        this.tp = 0
        this.nextLv = 100
        this.image = "";

        this.drawSprite = function (img, sX, sY, sW, sH, dX, dY, dW, dH) {
            ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);
        }

        this.render = function () {
            // ctx.strokeStyle = 'white'
            // ctx.strokeRect(hero.x, hero.y, this.width, this.height);
            this.drawSprite(this.image, this.width * this.frameX, this.height * this.frameY, this.width, this.height, this.x, this.y, this.width, this.height);

        }
        this.renderBattle = function () {
            //ctx.drawImage(battleSpriteHero, 280, 250);
            let battleWidth = 85
            let battleHeight = 110

            ctx.strokeStyle = 'white'
            ctx.strokeRect(280, 250, battleWidth, battleHeight);
            this.drawSprite(battleSpriteHero, battleWidth * 0, battleHeight * 0, battleWidth, battleHeight, 280, 250, battleWidth, battleHeight);

        }
        this.attack = function () {
            if (hero.battleGround && hero.turn) {
                hero.frameX += 1;
                // crit = random from 1 to 10
                let crit = Math.floor(Math.random() * 15)
                //dmg = the att plus the str minus target's def plus crit - same formula for mobs
                let dmg = (this.att + this.str) - (this.target.def);
                dmg += crit
                this.target.hp -= dmg;
                playerLog(`You deal ${dmg} damage.`);
                hero.turn = false;
                hero.tp += 14;
                hero.target.tp += 7;
                menuDiv.style.color = 'gray';
                hero.frameX -= 1;
                setTimeout(turnBased, 3000);
            }
        }
        this.TPmove = function () {
            if (this.tp >= 100 && hero.battleGround) {
                playerLog(`You use "Heavy Metal"`);
                playerLog('Your power grows!');
                this.att = this.att * 2;
                this.attack();
                this.tp = 0;
                setTimeout(() => { this.att = this.att / 2 }, 3000);
                setTimeout(playerLog('Heavy Metal fades...'), 3000);
            }
        }
        // =================================== LV up test ================================//
        this.levelUp = function () {
            if (this.xp > this.nextLv) {
                this.lv += 1
                playerLog(`Level up! LV:${this.lv}`);
                // MAX HP
                this.maxHp += (this.maxHp + this.lv) / 3;
                this.maxHp = Math.round(this.maxHp);
                this.hp = this.maxHp;
                //playerLog(`Max HP: ${this.maxHp}`);

                //ATT
                this.att += (this.att + this.lv) / 3;
                this.att = Math.round(this.att);
                //playerLog(`Attack: ${this.att}`);
                //DEF
                this.def += (this.def + this.lv) / 3;
                this.def = Math.round(this.def);
                //playerLog(`Defense: ${this.def}`);
                //str
                this.str += (this.str + this.lv) / 3;
                this.str = Math.round(this.str);
                //playerLog(`Streght: ${this.str}`);
                //for next level
                this.nextLv += (this.nextLv + (this.lv * 10)) / 2;
                this.nextLv = Math.round(this.nextLv);
                //reset xp
                this.xp = 0;
            }
        }


    }
}

// ================================================================== ENEMIES


class Mob {
    constructor(x, y, walk) {
        this.x = x
        this.y = y
        this.width = 16
        this.height = 32
        this.frameX = 0
        this.frameY = 0
        this.maxFrame = 3
        this.minFrame = 0
        this.speed = 6
        this.walk = walk
        this.drawSprite = function (img, sX, sY, sW, sH, dX, dY, dW, dH) {
            ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);
        }
        this.draw = function () {
            // ctx.strokeStyle = 'white'
            // ctx.strokeRect(this.x, this.y, this.width, this.height);
            this.drawSprite(this.image, this.width * this.frameX, this.height * this.frameY, this.width, this.height, this.x, this.y, this.width, this.height);


        }
        this.renderBattle = function () {
            //ctx.drawImage(battleSpriteHero, 280, 250);
            let battleWidth = 55
            let battleHeight = 110

            ctx.strokeStyle = 'white'
            ctx.strokeRect(290, 70, battleWidth, battleHeight);
            this.drawSprite(dalAttack, battleWidth * 0, battleHeight * 0, battleWidth, battleHeight, 290, 70, battleWidth, battleHeight);

        }
        //============================================ Make npc move -( moving works, sprite doesn't).
        this.roamWE = function () {
            if (this.walk === 'left') {
                //move the character around
                let walkLeft = setInterval(() => { this.x -= 2 }, 800);
                walkLeft;
                // animate sprite
                this.frameY = 0

                setTimeout(() => { clearInterval(walkLeft) }, 15000);
                setTimeout(() => { this.walk = 'right' }, 16000);

            } else if (this.walk === 'right') {
                let walkRight = setInterval(() => { this.x += 2 }, 800);
                walkRight;
                this.frameY = 1;

                setTimeout(() => { clearInterval(walkRight) }, 15000)
                setTimeout(() => { this.walk = 'left' }, 16000);


            }
        }
        this.roamNS = function () {
            if (this.walk === 'up') {

                let walkUp = setInterval(() => { this.y -= 2 }, 800);
                walkUp;

                setTimeout(() => { clearInterval(walkUp) }, 15000);
                setTimeout(() => { this.walk = 'down' }, 16000);

            } else if (this.walk === 'down') {
                let walkDown = setInterval(() => { this.y += 2 }, 800);
                walkDown;

                setTimeout(() => { clearInterval(walkDown) }, 15000)
                setTimeout(() => { this.walk = 'up' }, 16000);

            }
        }

        //=======================================stats ==========================//
        this.alive = true
        this.hp = 40
        this.att = 7
        this.def = 7
        this.str = 3
        this.lv = 1
        this.tp = 0
        this.xp = 100
        this.attack = function () {
            if (hero.battleGround && this.alive) {
                let crit = Math.floor(Math.random() * 10)

                let dmg = hero.target.att + hero.target.str - hero.def;

                dmg += crit;

                let totalDmg = Math.round(dmg);

                hero.hp -= totalDmg;
                hero.tp += 5;
                this.tp += 14;

                mobLog(`Slash!  You take ${totalDmg} damage.`)

            }
        }
        this.TPmove = function () {
            if (this.tp >= 100 && hero.battleGround) {
                this.att = this.att * 2;
                this.attack();
                this.tp = 0;
                mobLog(`CRITICAL HIT!`)
                setTimeout(() => { this.att = this.att / 2 }, 3000);
            }
        }
        //================= level UP
        this.levelUp = function () {
            if (this.xp > this.nextLv) {
                this.lv += 1
                // HP
                this.hp += (this.hp + this.lv) / 3;
                this.hp = Math.round(this.hp);
                //ATT
                this.att += (this.att + this.lv) / 3;
                this.att = Math.round(this.att);
                //DEF
                this.def += (this.def + this.lv) / 3;
                this.def = Math.round(this.def);
                //str
                this.str += (this.str + this.lv) / 3;
                this.str = Math.round(this.str);
                //XP
                this.xp += (this.xp + this.lv) / 2;
                this.xp = Math.round(this.xp);
            }
        }


    }
}
//function to spawn
let spawnMob = function () {
    if (dalton.alive) {
        dalton.draw();
    }
}
//================================ CHESTS

class Loot {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.width = 31
        this.height = 21
        this.frameX = 0
        this.frameY = 0
        this.maxFrame = 1
        this.minFrame = 0
        this.image = chestSprite
        this.switch = function () {
            if (this.open) {
                this.frameX = 1;
            } else {
                this.frameX = 0;
            }
        }
        this.drawSprite = function (img, sX, sY, sW, sH, dX, dY, dW, dH) {
            ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);
        }
        this.put = function () {
            // ctx.strokeStyle = 'white'
            // ctx.strokeRect(this.x, this.y, this.width, this.height);
            this.drawSprite(this.image, this.width * this.frameX, this.height * this.frameY, this.width, this.height, this.x, this.y, this.width, this.height);


        }
        //stats
        this.open = false

    }
}
//================================ SPRITES ====================================//




const dalAttack = new Image();
dalAttack.src = './assets/dalton-attack.png';

const bad0 = new Image();
const bad1 = new Image();
const bad2 = new Image();
const bad3 = new Image();
const bad4 = new Image();
const bad5 = new Image();
const bad6 = new Image();
const bad7 = new Image();
const bad8 = new Image();
const bad9 = new Image();
const bad10 = new Image();
const bad11 = new Image();
const bad12 = new Image();
const bad13 = new Image();


bad0.src = './assets/bad-guys/leo-sprite.png';
bad1.src = './assets/bad-guys/devouerer.png';
bad2.src = './assets/bad-guys/spirit-best.png';
bad3.src = './assets/bad-guys/kerka-sprite.png';
bad4.src = './assets/bad-guys/npc.png';
bad5.src = './assets/bad-guys/scorpion.png';
bad6.src = './assets/bad-guys/sploomy-sprite.png';
bad7.src = './assets/bad-guys/tucan-sprite.png';
bad8.src = './assets/bad-guys/twig.png';
bad9.src = './assets/bad-guys/mario.png';
bad10.src = './assets/bad-guys/ct-bad1.png';
bad11.src = './assets/bad-guys/ct-bad2.png';
bad12.src = './assets/bad-guys/ct-bad3.png';
bad13.src = './assets/bad-guys/npc.png';
//=============================================================================//

const cronoSprite = new Image();
cronoSprite.src = './assets/mat.png';

const battleSpriteHero = new Image();
battleSpriteHero.src = './assets/mat-attack.png';

const chestSprite = new Image();
chestSprite.src = './assets/chest.png';

//=========================== DOORS =====================================//
//door sprite
const doorSprite = new Image();
//change the src
doorSprite.src = './assets/tele.png'



class Door {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.width = 85
        this.height = 85
        this.frameX = 0
        this.frameY = 0
        this.maxFrame = 3
        this.image = doorSprite

        this.drawSprite = function (img, sX, sY, sW, sH, dX, dY, dW, dH) {
            ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);
        }
        this.put = function () {
            // ctx.strokeStyle = 'white'
            // ctx.strokeRect(this.x, this.y, this.width, this.height);
            this.drawSprite(this.image, this.width * this.frameX, this.height * this.frameY, this.width, this.height, this.x, this.y, this.width, this.height);


        }
        //stats
        this.open = false

    }
}
// make a door.
let door = new Door(680, 399);


//================================ START GAME ============================//
//Event listener
window.addEventListener('DOMContentLoaded', function () {
    
   
    //create hero
    hero = new Hero(30, 200);
    
    const runGame = this.setInterval(gameLoop, 60);
})

document.addEventListener('keydown', moveChar);

//========================================= MOVEMENTS AND INPUTS ======================//
function moveChar(e) {


    switch (e.key) {

        //===================================Arrow cases for debugging purposes, no boundaries.
        // case 'ArrowUp':
        //     hero.y - 20 >= 0 ? (hero.y -= 20) : null;
        //     hero.frameY = 1;
        //     if (hero.frameX < hero.maxFrame) {
        //         hero.frameX++;
        //     } else { hero.frameX = hero.minFrame }
        //     break;
        // case 'ArrowLeft':
        //     hero.x - 20 >= 0 ? (hero.x -= 20) : null;
        //     hero.frameY = 2;
        //     if (hero.frameX < hero.maxFrame) {
        //         hero.frameX++;
        //     } else { hero.frameX = hero.minFrame }
        //     break;
        // case 'ArrowDown':
        //     hero.y + 20 <= game.height ? (hero.y += 20) : null;
        //     hero.frameY = 0;
        //     if (hero.frameX < hero.maxFrame) {
        //         hero.frameX++;
        //     } else { hero.frameX = hero.minFrame }
        //     break;
        // case 'ArrowRight':
        //     hero.x + 20 <= game.width ? (hero.x += 20) : null;
        //     hero.frameY = 3;
        //     if (hero.frameX < hero.maxFrame) {
        //         hero.frameX++;

        //     } else { hero.frameX = hero.minFrame }
        //     break;

        // WASD Keybindings

        case 'w':
            //can I stop all cases with one "if" conditional? ===== nope, one per case.
            if (hero.moving)
                hero.y - hero.speed >= 0 && outBound() == false ? (hero.y -= hero.speed) : (hero.y += 10);
            hero.frameY = 1;
            playMusic()
            if (hero.frameX < hero.maxFrame) {
                hero.frameX++;
            } else { hero.frameX = hero.minFrame }
            break;
        case 'a':
            if (hero.moving)
                hero.x - hero.speed >= 0 && outBound() == false ? (hero.x -= hero.speed) : (hero.x += 10);
            hero.frameY = 2;
            playMusic()
            if (hero.frameX < hero.maxFrame) {
                hero.frameX++;
            } else { hero.frameX = hero.minFrame }
            break;
        case 's':
            if (hero.moving)
                hero.y + hero.speed <= game.height && outBound() == false ? (hero.y += hero.speed) : (hero.y -= 10);
            hero.frameY = 0;
            playMusic()
            if (hero.frameX < hero.maxFrame) {
                hero.frameX++;
            } else { hero.frameX = hero.minFrame }
            break;
        case 'd':
            if (hero.moving)
                hero.x + hero.speed <= game.width && outBound() == false ? (hero.x += hero.speed) : (hero.x -= 10);
            hero.frameY = 3;
            playMusic();
            if (hero.frameX < hero.maxFrame) {
                hero.frameX++;
            } else { hero.frameX = hero.minFrame }
            break;
        //ADDITIONAL CONTROLS
        case 'e':
            openBox();
            break;
    }
}



//============================ GAME LOOP ===============================//
//======================================================================//
//======================================================================//

function gameLoop() {

    //clear canvas first
    ctx.clearRect(0, 0, game.width, game.height);


    if (hero.battleGround && stg === 1) {
        battle1();
        gameOver();
        stopMusic(stageMusic);
        //===================================Battleground switch =================================//
    } else if(stg === 1){
        stage1();
        stopMusic(battleMusic);

    }else if (hero.battleGround && stg === 2) {
        battle2();
    }else if(stg === 2){
        stage2();
    }
};

//==================================COLLISIONS TESTING =======================//
function detechHit(obj1, obj2) {
    let hitBox =
        obj1.y + obj1.height > obj2.y &&
        obj1.y < obj2.y + obj2.height &&
        obj1.x + obj1.width > obj2.x &&
        obj1.x < obj2.x + obj2.width;

    if (hitBox) {
        return true;
    } else {
        return false;
    }
}
// =====   2 functions for a IF statement boundaries collisions
function outBound() {
    let output = false;
    if (stg === 1) {
        boundaries.forEach(element => {

            if (detechHit(hero, element)) {
                output = true
            }
        })
    } else if (stg === 2) {
        let output = false;
        boundariesMap2.forEach(element => {

            if (detechHit(hero, element)) {
                output = true
            }
        });
        return output;
    };
    return output;
}



///=============FOR E   works perfect ===move it somewhere better and delete this
let openBox = function () {
    for (let i = 0; i < chestArray.length; i++) {
        //if theres a collision between hero and the chest and the chests is closed, open it.
        if (detechHit(hero, chestArray[i]) && chestArray[i].open === false) {

            chestArray[i].open = true
            looting();


        }
    }
}


//==================LOOTING ===============//

// function for looting tests  ===  works as intended
function looting() {
    //picks a rasndom string out of the chestLoot array
    let rnd = Math.floor(Math.random() * chestLoot.length);
    chestLoot[rnd]();
    hero.heal = true;

}



//============================CONSOLE LOG ========================//
function mobLog(string) {

    line3.textContent = line2.textContent;
    line2.textContent = line1.textContent;
    line1.textContent = string;
}

function playerLog(string) {

    log3.textContent = log2.textContent;
    log2.textContent = log1.textContent;
    log1.textContent = string;
}
setInterval(() => {
    mobLog('');
}, 13000);

setInterval(() => {
    playerLog('');
}, 13000);

// ==================== A little visual trick for TP moves
function tpColor() {
    if (hero.tp >= 100 && hero.battleGround && tpReady.style.backgroundColor != 'red') {
        tpReady.style.backgroundColor = 'red';
    } else if (hero.tp >= 100 && hero.battleGround && tpReady.style.backgroundColor === 'red') {
        tpReady.style.backgroundColor = 'green';
    } else if (hero.tp < 100) {
        tpReady.style.backgroundColor = 'inherit';
    }
}
//=========================
