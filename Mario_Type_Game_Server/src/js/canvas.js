import platform from '../images/platform.png'
import hills from '../images/hills.png'
import background from '../images/background.png'
import platformSmallTall from '../images/platformSmallTall.png'

import spriteRunLeft from '../images/spriteRunLeft.png'
import spriteRunRight from '../images/spriteRunRight.png'
import spriteStandLeft from '../images/spriteStandLeft.png'
import spriteStandRight from '../images/spriteStandRight.png'
//import { init } from 'browser-sync';

const canvas = document.querySelector('canvas');

//access context
const ctx = canvas.getContext('2d');

//change canvas size, otherwise the square you want to draw is going to be a rectangle
canvas.width = 1024 //window.innerWidth; //window not really necessary i.e. just = innerWidth or innerHeight is alright
canvas.height = 576 //window.innerHeight;

const gravity = 0.5;

class Player {
    //constructor for basic properties of the player
    constructor() {
        this.speed = 10;
        this.position = {
            x: 100,
            y: 10
        }
        this.width = 66;
        this.height = 150;
        this.velocity = {
            x: 0,
            y: 1
        }
        this.image = createImage(spriteStandRight);
    }

    //method to draw player on the screen
    draw() {
        //ctx.fillStyle = 'blue';
        //ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        // 177 and 400 are values based on the dimensions of just one character on the sprite
        ctx.drawImage(this.image, 0, 0, 177, 400 ,this.position.x, this.position.y, this.width, this.height);
    }

    //update player
    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if(this.position.y + this.height + this.velocity.y <= canvas.height){
            this.velocity.y += gravity;
        } else{
            //this.velocity.y = 0;
        }
        
    }
}

//since the constructor has an object passed to it (i.e. the { }), object
//for which we specify a x and a y
//we can write equivalently
/* this.position = {
    x,
    y
}
*/
class Platform{
    constructor({x, y, image}){
        this.position = {
            x:x,
            y:y
        }
        
        this.image = image;
        this.width = image.width;
        this.height = image.height;
    }

    draw(){
      ctx.drawImage(this.image, this.position.x, this.position.y);
        /*ctx.fillStyle = 'red';
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);*/
    }
}

class GenericObject{
    constructor({x, y, image}){
        this.position = {
            x:x,
            y:y
        }
        
        this.image = image;
        this.width = image.width;
        this.height = image.height;
    }

    draw(){
      ctx.drawImage(this.image, this.position.x, this.position.y);
        /*ctx.fillStyle = 'red';
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);*/
    }
}

function createImage(imageSrc){
    const image = new Image()
    image.src = imageSrc
    return image
}

//initial start of the game code/variables:
let platformImage = createImage(platform);
let platformSmallTallImage = createImage(platformSmallTall);

//create a player
let player = new Player();

//create a platform
//const platform = new Platform();
let platforms = [];

//create generic decoretions
let genericObjects = [];

//create a new object
const keys = {
    right:{
        pressed: false
    },
    left:{
        pressed: false
    }
}

let scrollOffset = 0;

//function used to restart the entire game
//everything we had so far we wrapped it inside it
function init(){
    //copy and paste the entire content of this funtion right before its body
    //so the game can start the first time
    platformImage = createImage(platform);

    //create a player
    player = new Player();

    //create a platform
    //const platform = new Platform();
    platforms = [
    new Platform({
        x:platformImage.width * 4 + 300 - 2 + platformImage.width - platformSmallTallImage.width, 
        y:270,
        image:createImage(platformSmallTall)
        }),
    new Platform({
        x:-1, 
        y:470,
        image:platformImage
    }), 
    new Platform({
        x:platformImage.width - 3, 
        y:470,
        image:platformImage
    }),
    new Platform({
        x:platformImage.width * 2 + 100, 
        y:470,
        image:platformImage
    }),
    new Platform({
        x:platformImage.width * 3 + 300, 
        y:470,
        image:platformImage
      }),
    new Platform({
        x:platformImage.width * 4 + 300 - 2, 
        y:470,
        image:platformImage
      }),
    new Platform({
        x:platformImage.width * 5 + 700 - 2, 
        y:470,
        image:platformImage
      })
    ];

    //create generic decoretions
    genericObjects = [
        new GenericObject({
            x:-1,
            y:-1,
            image:createImage(background)
        }),
        new GenericObject({
            x:-1,
            y:-1,
            image:createImage(hills)
        })
    ];

    scrollOffset = 0;
}

//animation function
function animation() {
    window.requestAnimationFrame(animation);

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    //ctx.clearRect(0, 0, canvas.width, canvas.height);

    genericObjects.forEach( (genericObject) => {
        genericObject.draw();
    })

    platforms.forEach( (platform) => {
        platform.draw();
    })
    player.update();

    //monitor if the player goes left or right based on the key pressed
    //if the player position is in the interval (100, 400) move the player
    //otherwise move the platforms at the same rate to make it seem that
    //the player is moving, when in fact we have stoped the player's movement
    if(keys.right.pressed && player.position.x < 400){
        player.velocity.x = player.speed;
    }else if( (keys.left.pressed && player.position.x > 100) ||
               (keys.left.pressed && scrollOffset === 0 && player.position.x > 0) ){
        player.velocity.x = -player.speed;
    }else{
        player.velocity.x = 0;

        if(keys.right.pressed){
            scrollOffset += player.speed;
            platforms.forEach( (platform) => {
                platform.position.x -= player.speed;
            })
            genericObjects.forEach( (genericObject) =>{
                genericObject.position.x -= player.speed * 0.66;
            })
        } else if(keys.left.pressed && scrollOffset > 0){
            scrollOffset -= player.speed;
            platforms.forEach( (platform) => {
                platform.position.x += player.speed;
            })
            genericObjects.forEach( (genericObject) =>{
                genericObject.position.x += player.speed * 0.66;
            })
        }
    }

    //platform collision detection
    platforms.forEach( (platform) => {
        if(player.position.y + player.height <= platform.position.y
            && 
            player.position.y + player.height + player.velocity.y >= platform.position.y
            && 
            player.position.x + player.width >= platform.position.x
            &&
            player.position.x <= platform.position.x + platform.width
            ){
            player.velocity.y = 0;
        }
    })

    //win condition
    if(scrollOffset > platformImage.width * 5 + 300 - 2){
        console.log("You Win!");
    }
    //lose condition
    if(player.position.y > canvas.height){
        //console.log("You lose");
        init();
    }
}

//call the function otherwise nothing will appear on the screen, or move.
//initial load
init();
animation(); 

//event listeners
// window.addEventListener() == addEventListener(), no need to use window keyword
// window.addEventListener() has an event attached to it, you can console.log(event)
// see all the event properties and in the () => arrow function, instead of
// referencing the entire event just reference the property you need.
window.addEventListener('keydown', ( {keyCode} ) => {
    switch(keyCode){
        case 65:
            console.log('left');
            keys.left.pressed = true;
            break;
        
        case 83:
            console.log('down');
            break;

        case 68:
            console.log('right');
            keys.right.pressed = true;
            break;

        case 87:
            console.log('up');
            player.velocity.y -= 15;
            break;
    }
    console.log(keys.right.pressed);
})

window.addEventListener('keyup', ( {keyCode} ) => {
    switch(keyCode){
        case 65:
            console.log('left');
            keys.left.pressed = false;
            break;
        
        case 83:
            console.log('down');
            break;

        case 68:
            console.log('right');
            keys.right.pressed = false;
            break;

        case 87:
            console.log('up');
            //player.velocity.y -= 20
            break;
    }
    console.log(keys.right.pressed);
})