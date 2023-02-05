
// Selectors and variables
const game = document.querySelector('#game');
game.width = 800;
game.height = 497;
const ctx = game.getContext('2d'); //2d canvas
const movement = document.querySelector('#movement');
const info = document.querySelector('#innerinfo');
const info2 = document.querySelector('#innerinfo2');
const tpReady = document.querySelector('#tpReady');
const line1 = document.querySelector('#line1');
const line2 = document.querySelector('#line2');
const line3 = document.querySelector('#line3');

const log1 = document.querySelector('#log1');
const log2 = document.querySelector('#log2');
const log3 = document.querySelector('#log3');


const bg = new Image();
bg.src = './assets/map2.bmp'
//=============================    computedStyles   ================================//
game.setAttribute('height', getComputedStyle(game)['height']);
game.setAttribute('width', getComputedStyle(game)['width']);

let hero;
let hero2;
//================================Character Classes==================================================

class Human {
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
        this.mp = 50;
        this.str = 9;
        this.att = 11;
        this.def = 9;
        this.lv = 1;
        this.xp = 0
        this.tp = 0
        this.nextLv = 100
        this.maxLv = 50
        this.image = "";

        this.drawSprite = function (img, sX, sY, sW, sH, dX, dY, dW, dH) {
            ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);
        }

        this.render = function () {
            ctx.strokeStyle = 'black'
            ctx.strokeRect(hero.x, hero.y, this.width, this.height);
            // this.drawSprite(this.image, this.width * this.frameX, this.height * this.frameY, this.width, this.height, this.x, this.y, this.width, this.height);

        }
        // =================================== LV up test ================================//
        this.levelUp = function () {
            if (this.xp > this.nextLv && this.lv < this.maxLv) {
                this.lv += 1
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

class Berzerker extends Human {
    constructor(x, y, hp, mp, maxHp, str){
    super(hp, mp, maxHp, str);
        this.hp += Math.floor(this.hp * 0.10);
        this.maxHp += Math.floor(this.hp * 0.10);
        this.mp -= Math.floor(this.mp * 0.65);
        this.str += 6;
        this.passives = [];
    }
}





//================================ START GAME ============================//
//Event listener
window.addEventListener('DOMContentLoaded', function () {
    
   
    //create hero
    hero = new Berzerker(30, 200);
    
    
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
                hero.y - hero.speed >= 0 ? (hero.y -= hero.speed) : (hero.y += 10);
            hero.frameY = 1;
            if (hero.frameX < hero.maxFrame) {
                hero.frameX++;
            } else { hero.frameX = hero.minFrame }
            break;
        case 'a':
            if (hero.moving)
                hero.x - hero.speed >= 0 ? (hero.x -= hero.speed) : (hero.x += 10);
            hero.frameY = 2;
            if (hero.frameX < hero.maxFrame) {
                hero.frameX++;
            } else { hero.frameX = hero.minFrame }
            break;
        case 's':
            if (hero.moving)
                hero.y + hero.speed <= game.height ? (hero.y += hero.speed) : (hero.y -= 10);
            hero.frameY = 0;
            if (hero.frameX < hero.maxFrame) {
                hero.frameX++;
            } else { hero.frameX = hero.minFrame }
            break;
        case 'd':
            if (hero.moving)
                hero.x + hero.speed <= game.width ? (hero.x += hero.speed) : (hero.x -= 10);
            hero.frameY = 3;
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
    //display x and y for hero
        movement.textContent = `x:${hero.x}\ny:${hero.y}`;
        info.textContent = `Hp: ${hero.hp} Att: ${hero.att}`;
        info2.textContent = `Lv: ${hero.lv} Xp: ${hero.xp}`;
        hero.render();

};