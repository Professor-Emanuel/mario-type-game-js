//import platform from './images/platform.png'

const canvas = document.querySelector('canvas');

//access context
const ctx = canvas.getContext('2d');

//change canvas size, otherwise the square you want to draw is going to be a rectangle
canvas.width = window.innerWidth; //window not really necessary i.e. just = innerWidth or innerHeight is alright
canvas.height = window.innerHeight;

const gravity = 0.5;

class Player {
    //constructor for basic properties of the player
    constructor() {
        this.position = {
            x: 100,
            y: 10
        }
        this.width = 30;
        this.height = 30;
        this.velocity = {
            x: 0,
            y: 1
        }
    }

    //method to draw player on the screen
    draw() {
        ctx.fillStyle = 'blue';
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    //update player
    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if(this.position.y + this.height + this.velocity.y <= canvas.height){
            this.velocity.y += gravity;
        } else{
            this.velocity.y = 0;
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
    constructor({x, y}){
        this.position = {
            x:x,
            y:y
        }
        this.width = 200;
        this.height = 20;
    }

    draw(){
        ctx.fillStyle = 'red';
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

//create a player
const player = new Player();

//create a platform
//const platform = new Platform();
const platforms = [new Platform({x:200, y:100}), new Platform({x:500, y:200})];

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

//animation function
function animation() {
    window.requestAnimationFrame(animation);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.update();
    platforms.forEach( (platform) => {
        platform.draw();
    })

    //monitor if the player goes left or right based on the key pressed
    //if the player position is in the interval (100, 400) move the player
    //otherwise move the platforms at the same rate to make it seem that
    //the player is moving, when in fact we have stoped the player's movement
    if(keys.right.pressed && player.position.x < 400){
        player.velocity.x = 5;
    }else if(keys.left.pressed && player.position.x > 100){
        player.velocity.x = -5;
    }else{
        player.velocity.x = 0;

        if(keys.right.pressed){
            scrollOffset += 5;
            platforms.forEach( (platform) => {
                platform.position.x -=5;
            })
        } else if(keys.left.pressed){
            scrollOffset -= 5;
            platforms.forEach( (platform) => {
                platform.position.x += 5;
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

    if(scrollOffset > 2000){
        console.log("You Win!");
    }
}

//call the function otherwise nothing will appear on the screen, or move.
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
            player.velocity.y -= 20
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