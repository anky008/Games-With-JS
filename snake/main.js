let canvas = document.querySelector("canvas");
let ctx = canvas.getContext('2d');

let score_board=document.querySelector(".score");
let reset_btn=document.querySelector("button");

// initial variables
let snake_width = 8;
let snake_height = 8;
let first_time=true;
let food_x=-1;
let food_y=-1;
let score=0;

let dead=new Audio();
let down=new Audio();
let eat=new Audio();
let right=new Audio();
let up=new Audio();
let left=new Audio();

up.src="audio/up.mp3";
down.src="audio/down.mp3";
eat.src="audio/eat.mp3";
left.src="audio/left.mp3";
right.src="audio/right.mp3";
dead.src="audio/dead.mp3";


let img = new Image();
img.width="5";
img.height="5";
img.src = 'images/apple2.png';

ctx.fillStyle = 'black';

let snake = {
    snake_body: [],
    direction: "right"
}

function draw_snake() {

    // clear the whole canvas to redraw the snake
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if(first_time==true){
        first_time=false;
        generate_food_pos();
    }

    // draw the food
    draw_food();

    // in the begining fill in the complete snake
    if (snake.snake_body.length == 0) {


        let startx = 100;
        let starty = 20;

        for (let i = 0; i < 5; i++) {
            snake.snake_body.push([startx + i * snake_width+1, starty]);
        }
    }

    // draw the snake
    for (let i = 0; i < snake.snake_body.length; i++) {
        if (i == snake.snake_body.length - 1) {
            ctx.fillStyle = "Red";
            ctx.fillRect(snake.snake_body[i][0], snake.snake_body[i][1], snake_width - 1, snake_height - 1);
        }

        else{
            ctx.fillStyle = "Black";
            ctx.fillRect(snake.snake_body[i][0], snake.snake_body[i][1], snake_width - 1, snake_height - 1);
        }
    }
}

function draw_food(){
    ctx.drawImage(img, food_x, food_y,8,8);
}

function eaten_food(snake_x,snake_y,item_x,item_y){
    // collision with top wall of food
    if((snake_y + snake_height < item_y) || (snake_x + snake_width < item_x) || (snake_y > item_y + snake_height) ||  (snake_x > item_x + snake_width)){
        return false;
    }

    return true;
}

function outside_boundary(snake_x,snake_y){
    if(snake_x < 0 || snake_x >= canvas.width || snake_x + snake_width >= canvas.width ||  snake_y + snake_height >= canvas.height || snake_y < 0 || snake_y > canvas.height){
        return true;
    }

    return false;
}

function self_collison(snake_x,snake_y,item_x,item_y){
   if(snake_x==item_x && snake_y==item_y){
       return true;
   }   

    return false;
}

function self_bite(snake_x,snake_y){
    
    // not till end since head is the end itself
    for(let i=0;i<snake.snake_body.length-1;i++){
        if(self_collison(snake_x,snake_y,snake.snake_body[i][0],snake.snake_body[i][1])==true){
            return true;
        }
    }

    return false;
}

function update_snake() {

    //console.log("snake is updated!");

    let old_headx = snake.snake_body[snake.snake_body.length - 1][0];
    let old_heady = snake.snake_body[snake.snake_body.length - 1][1];

    //console.log("snake_head:",old_headx,old_heady,"food:",food_x,food_y);

    // collision btw food and snake
    if(eaten_food(old_headx,old_heady,food_x,food_y)==true){
        eat.play(); 
        generate_food_pos();
        console.log("collision!");       
        score+=1;
        score_board.innerText=score;        
    }

    else{
        // remove the rectangle from the left
        snake.snake_body.shift();
    }
    

    if(outside_boundary(old_headx,old_heady)==true){
        dead.play();
        alert("Game Over!");
        reset_game();
        return;
    }

    if(self_bite(old_headx,old_heady)==true){
        dead.play();
        alert("Game Over!");
        reset_game();
        return;
    }

    if (snake.direction == "Right") {
        // add a rectangle to the right
        snake.snake_body.push([old_headx + snake_width+1, old_heady]);
    }

    else if (snake.direction == "Up") {
        snake.snake_body.push([old_headx, old_heady - snake_height-1]);
    }

    else if (snake.direction == "Down") {
        snake.snake_body.push([old_headx, old_heady + snake_height+1]);
    }

    else {
        snake.snake_body.push([old_headx - snake_width-1, old_heady]);
    }

    // redraw the whole snake
    draw_snake();
}

function generate_food_pos() {
    food_x=Math.floor(Math.random() * (canvas.width - 20));
    food_y=Math.floor(Math.random() * (canvas.height - 20));
}

document.addEventListener('keydown', function (e) {

    //console.log(e.key);
    if (e.key == "ArrowLeft") {
        // if snake is not already going right
        if (snake.direction != "Right") {
            snake.direction = "Left";
            left.play();
        }
    }

    else if (e.key == "ArrowUp") {
        if (snake.direction != "Down") {
            snake.direction = "Up";
            up.play();
        }
    }

    else if (e.key == "ArrowRight") {
        if (snake.direction != "Left") {
            snake.direction = "Right";
            right.play();
        }
    }

    else if (e.key == "ArrowDown") {
        if (snake.direction != "Up") {
            snake.direction = "Down";
            down.play();
        }
    }

    update_snake();
});

function reset_game(){
    snake.snake_body=[];
    snake.direction="Right";
    score=0;
    first_time=true;
    score_board.innerText=score;
    draw_snake();
}

function game_loop(){
    draw_snake();
    update_snake();
}

let f=setInterval(game_loop,100);