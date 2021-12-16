let game_box=document.querySelector(".game-box");
let dino=document.querySelector(".dino");
let score_box=document.querySelector(".score-box");
let start_msg=document.querySelector(".start-msg");
let replay_btn=document.querySelector(".replay");

let score=0;
let vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
let vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)

let start_top_margin=430;
let top_margin=start_top_margin;
let is_jumping=false;
let game_over=false;
let game_start=false;


function key_control(e){  

    if(e.key && game_start==false){
        start_msg.style.display="none";
        game_start=true;
        init();
    }

    else if(e.key=="ArrowUp" && !is_jumping && !game_over){
        is_jumping=true;
        // jump the dino
        jump();
    }
}

// jumps the dino
function jump(){
    // we don't want the dino to teleport from A to B
    // instead move in small steps from A to B    
    let up_timer_id=setInterval(function(){
        top_margin-=10;
        
        if(start_top_margin - top_margin >= 200){
            // rex has jumped by 200 px so need to bring it down
            clearInterval(up_timer_id);

            let down_timer_id=setInterval(function(){
                top_margin+=10;
                dino.style.top=top_margin + "px";

                if(top_margin >= start_top_margin){
                    is_jumping=false;
                    clearInterval(down_timer_id);
                }

            },30);
        }

        dino.style.top=top_margin + "px";
    }, 30);
}

let cactus_ids=[];
let cactus_list=[];

function create_cactus(){

    if(game_over){
        handle_game_over();
        return;
    }

    // left margin of the cactus
    let cactus_left=vw - 50;

    let cactus=document.createElement("img");
    cactus.setAttribute("src","./images/cactus.png");
    cactus.style.left=cactus_left + "px";
    cactus.setAttribute("class","cactus");
    game_box.appendChild(cactus);

    cactus_list.push(cactus);

    // move the cactus left
    let cactus_move_id=setInterval(function(){
        
        cactus_ids.push(cactus_move_id);

        // collision logic
        if(cactus_left >= 20 && cactus_left <= 80 && Math.abs(start_top_margin - top_margin) <= 96){

            cactus.remove();
            handle_game_over();
            return;
        }

        else if(cactus_left <= 20){
            score+=1;
            score_box.innerText=score;
            
            cactus.remove();
            cactus_list.pop();
            
            clearInterval(cactus_move_id);
        }

        cactus_left=cactus_left-10;
        cactus.style.left=cactus_left + "px";
    },20);


    // will call the create_cactus function only once after 2000ms
    if(!game_over){
        setTimeout(create_cactus,2000);
    }
}

function run_dino(){
    
    let idx=0;

    let change_dino_interval=setInterval(function(){

        let path="images/dino";

        if(game_over){
            handle_game_over();
            return;
        }

        else if(is_jumping){
            path+="-stationary.png"; 
            dino.setAttribute("src",path);
        }

        else{
            console.log("Running again!");
            path+="-run-";
            path+=idx;
            path+=".png"
            dino.setAttribute("src",path);
            idx=1-idx;
        }    
    },100)
}

function init(){

    start_msg.style.display="none";
    replay_btn.style.display="none";
    dino.setAttribute("src","./images/dino-stationary.png");

    run_dino();
    create_cactus();
}

function handle_game_over(){

    dino.setAttribute("src","./images/dino-lose.png");
    game_over=true;
    start_msg.style.display="block";
    start_msg.innerText="Game Over!";
    replay_btn.style.display="block";

    for(let i=0;i<cactus_ids.length;i++){
        clearInterval(cactus_ids[i]);
    }

    console.log("cactus list after collision:", cactus_list);

    for(let i=0;i<cactus_list.length;i++){
        cactus_list[i].remove();
    }

    cactus_ids=[];
    cactus_list=[];
}

replay_btn.addEventListener("click",function(){
    
    console.log("replay button clicked!");
    console.log("Game Over:",game_over);
    if(game_over){
        score=0;
        is_jumping=false;
        game_over=false;
        game_start=true;

        top_margin=start_top_margin;
        init();
    }
})

document.addEventListener("keydown",key_control);
