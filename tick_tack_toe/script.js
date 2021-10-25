let board=document.querySelector(".board");
let buttons=document.querySelectorAll(".board-cell");
let game_status=document.querySelector(".game-status");
let reset_btn=document.querySelector(".reset");
let player1_scorebox=document.querySelector(".player1-score-box");
let player2_scorebox=document.querySelector(".player2-score-box");
let reset_board_btn=document.querySelector(".reset-board");
let reset_game_btn=document.querySelector(".reset-game");

let x_turn=true;
let result=false;

let x_count=0;
let o_count=0;

if(localStorage.getItem("board")){
    let board=JSON.parse(localStorage.getItem("board"));
    for(let i=0;i<buttons.length;i++){
        buttons[i].innerText=board[i];
    }

    x_count=parseInt(localStorage.getItem("x_count"));
    o_count=parseInt(localStorage.getItem("o_count"));

    if(x_count==NaN){
        x_count=0;
    }

    if(o_count==NaN){
        o_count=0;
    }

    player1_scorebox.innerText=x_count;
    player2_scorebox.innerText=o_count;    
}

let default_color="#D6E0F0";
let dark_color="#8D93AB";

for(let i=0;i<buttons[i].length;i++){
    buttons[i].style.backgroundColor=default_color;
}
reset_board_btn.addEventListener("click",function(e){
    for(let i=0;i<buttons.length;i++){
        buttons[i].innerText="";        
    }

    game_status.innerText="Status: X's Turn";
    result=false;

    for(let i=0;i<buttons.length;i++){
        (buttons[i].style).backgroundColor=default_color;        
    }
});

reset_game_btn.addEventListener("click",function(e){
    for(let i=0;i<buttons.length;i++){
        buttons[i].innerText="";        
    }

    game_status.innerText="Status: X's Turn";
    result=false;

    for(let i=0;i<buttons.length;i++){
        (buttons[i].style).backgroundColor=default_color;        
    }

    localStorage.clear();
    x_count=0;
    o_count=0;

    player1_scorebox.innerText=x_count;
    player2_scorebox.innerText=o_count;  
});



for(let i=0;i<buttons.length;i++){
    buttons[i].addEventListener("click",function(e){
        
        let row=Math.floor(i/3);
        let col=i%3;
        let next_x_turn=!x_turn;

        if(buttons[i].innerText!=""){
            next_x_turn=x_turn;
        }

        // only change when empty at first
        if(x_turn==true && buttons[i].innerText=="" && result==false){
            buttons[i].innerText="X";
        }

        else if(x_turn==false && buttons[i].innerText=="" && result==false){
            buttons[i].innerText="O";
        }

        let board_status=[];
        for(let j=0;j<buttons.length;j++){
            board_status.push(buttons[j].innerText);
        }

        localStorage.setItem("board",JSON.stringify(board_status));        

        let won=check_win(row,col,buttons[i].innerText);
        
        // result hasn't come yet 
        if(won==true && result==false){
            if(x_turn==true){
                x_count++;
                player1_scorebox.innerText=x_count;
                game_status.innerText="Status: X won!!";
                console.log("X won!!");
            }

            else{
                o_count++;
                player2_scorebox.innerText=o_count;
                game_status.innerText="Status: O won!!";
                console.log("O won!!");
            }

            localStorage.setItem("x_count",JSON.stringify(x_count));
            localStorage.setItem("o_count",JSON.stringify(o_count));
            result=true;
        }

        else if(result==false){
            let tie=check_tie();
            if(tie){
                game_status.innerText="Status: Tie!!";
                console.log("Tie!!");
                result=true;
            }
        }

        x_turn=next_x_turn;
        
        if(result==false){
            if(x_turn==true){
                game_status.innerText="Status: X's Turn";
            }

            else{
                game_status.innerText="Status: O's Turn";
            }
        }
    });
}

function check_win(row,col,symbol){
    
    let row_wise=true;
    // check rowise
    for(let c=0;c<3;c++){
        let arr_idx=row*3+c;
        if(buttons[arr_idx].innerText!=symbol){
            row_wise=false;
            break;
        }
    }

    if(row_wise==true) {
        console.log("won rowise:");
        highlight_board(row,col,'r');
        return true;
    }

    let col_wise=true;
    // check colwise
    for(let r=0;r<3;r++){
        let arr_idx=r*3+col;
        if(buttons[arr_idx].innerText!=symbol){
            col_wise=false;
            break;
        }
    }

    if(col_wise==true){
        console.log("won colwise");
        highlight_board(row,col,'c');
        return true;
    }

    // current cell not along main or secondary diag
    if(row!=col && (row+col)!=2){
        return false;
    }

    if(row==col){
        let main_diag_wise=true;
        // check main diag
        for(let r=0,c=0;r<3 && c<3;r++,c++){
            let arr_idx=r*3+c;
            if(buttons[arr_idx].innerText!=symbol){
                main_diag_wise=false;
                break;
            }
        }

        if(main_diag_wise==true) {
            console.log("won main diagwise");        
            highlight_board(row,col,'md');
            return true;
        }
    }

    if(row+col==2){
        let second_diag_wise=true;
        // check secondary diag
        for(let r=0,c=2;r<3 && c>=0;r++,c--){
            let arr_idx=r*3+c;
            if(buttons[arr_idx].innerText!=symbol){
                second_diag_wise=false;
                break;
            }
        }

        if(second_diag_wise==true) {
            console.log("won secondary diagwise");
            highlight_board(row,col,'sd');
            return true;
        }
    }

    return false;
}

function check_tie(){

    let count=0;
    for(let i=0;i<buttons.length;i++){
        if(buttons[i].innerText!=""){
            count++;
        }
    }

    if(count==9){
        return true;
    }

    else{
        return false;
    }
}

// highlights the cells in dir direction
function highlight_board(row,col,dir){
    if(dir=='r'){
        for(let c=0;c<3;c++){
            let arr_idx=3*row+c;
            (buttons[arr_idx].style).backgroundColor=dark_color;
        }
    }

    if(dir=='c'){
        for(let r=0;r<3;r++){
            let arr_idx=3*r+col;
            (buttons[arr_idx].style).backgroundColor=dark_color;
        }
    }

    if(dir=='md'){
        // check main diag
        for(let r=0,c=0;r<3 && c<3;r++,c++){
            let arr_idx=r*3+c;
            (buttons[arr_idx].style).backgroundColor=dark_color;
        }
    }

    if(dir=='sd'){
        for(let r=0,c=2;r<3 && c>=0;r++,c--){
            let arr_idx=r*3+c;
            (buttons[arr_idx].style).backgroundColor=dark_color;
        }    
    }
}