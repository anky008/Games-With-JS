let platform_cont = document.querySelector(".platform-cont");
let grid = document.querySelector(".grid");
let doodler = -1;
let game_over_flag = false;
let platform_count = 5;
let platforms = [];
let jump_up_id = -1;
let jump_down_id = -1;
let moving_platforms_id = -1;
let doodler_width = 160;
let doodler_height = 160;
let platform_width = 180;
let platform_height = 40;
let doodler_leftspace = -1;

// to avoid double jumps
let jumping = true;

let going_left = false;
let go_left_id = -1;


let going_right = false;
let go_right_id = -1;

// gap btw two platforms
let plat_gap = (grid.clientHeight) / platform_count;

function get_bottom(elem) {
    return Number(elem.style.bottom.split("p")[0]);
}

function get_left(elem) {
    return Number(elem.style.left.split("p")[0]);
}


function create_doodler() {
    doodler = document.createElement("div");
    doodler.setAttribute("class", "doodler");

    let bottom = get_bottom(platforms[0]);
    let left = get_left(platforms[0]);

    doodler_leftspace = left;

    doodler.style.bottom = bottom + "px";
    doodler.style.left = left + "px";

    grid.appendChild(doodler);
}

// creates a single platform
function create_platform(bottom, left_start) {
    let platform = document.createElement("div");
    platform.setAttribute("class", "platform");
    platform.style.bottom = bottom + "px";
    platform.style.left = left_start + "px";
    platform_cont.appendChild(platform);
    platforms.push(platform);
}

// creates multiple platforms
function create_platforms() {
    for (let i = 0; i < platform_count; i++) {
        let bottom = 80 + i * plat_gap;
        let left_start = Math.random() * (grid.clientWidth - 160);
        create_platform(bottom, left_start);
    }
}

function move_platforms() {
    // idea -> keep pushing the platforms down
    // once someone is out of box remove it and
    // add new one

    let doodler_bottom = get_bottom(doodler);
    //console.log("Doodler bottom:",doodler_bottom);

    for (let i = 0; i < platforms.length; i++) {
        let previous_bottom = get_bottom(platforms[i]);
        let new_bottom = previous_bottom - 2;
        platforms[i].style.bottom = new_bottom + "px"; 
    }


    update_platforms();
}

function update_platforms() {

    if (game_over_flag) return;

    let bottom = get_bottom(platforms[0]);

    if (bottom <= 0) {
        let new_bottom = 80 + (platforms.length - 1) * plat_gap;
        let new_left_start = Math.random() * (grid.clientWidth - 160);
        platforms[0].classList.remove("platform");
        platform_cont.removeChild(platforms[0]);
        platforms.shift();

        create_platform(new_bottom, new_left_start);
    }
}

function game_over() {
    clearInterval(jump_up_id);
    clearInterval(jump_down_id);
    clearInterval(go_left_id);
    clearInterval(go_right_id);
    clearInterval(moving_platforms_id)
    going_right = false;
    going_left = false;
    game_over_flag = true;
    console.log("Game Over!");
}

function go_left() {

    if (game_over_flag) {
        return;
    }

    if (going_right) {
        clearInterval(go_right_id);
        going_right = false;
    }

    going_left = true;
    go_left_id = setInterval(function () {
        if (doodler_leftspace >= 0) {
            doodler_leftspace -= 5;
            doodler.style.left = doodler_leftspace + "px";
        }

        else {
            go_right();
        }
    }, 30);
}

function go_right() {

    if (game_over_flag) {
        return;
    }
    // 500px -> width of grid
    // 160px -> width of doodler

    if (going_left) {
        clearInterval(go_left_id);
        going_left = false;
    }

    going_right = true;

    go_right_id = setInterval(function () {
        if (doodler_leftspace <= 340) {
            doodler_leftspace += 5;
            doodler.style.left = doodler_leftspace + "px";
        }

        else {
            go_left();
        }
    }, 30);
}

function go_straight() {

    if (going_left) {
        going_left = false;
        clearInterval(go_left_id);
    }

    if (going_right) {
        going_right = false;
        clearInterval(go_right_id);
    }
}

function key_control(e) {
    if (e.key == "ArrowLeft") {
        go_left();
    }

    else if (e.key == "ArrowRight") {
        go_right();
    }

    else if (e.key == "ArrowUp") {
        go_straight();
    }
}

function sit_doodler() {

    if (game_over_flag) return;

    for (let i = 0; i < platforms.length; i++) {
        let platform_bottom = get_bottom(platforms[i]);
        let doodler_bottom = get_bottom(doodler);
        let platform_left = get_left(platforms[i]);
        let doodler_left = get_left(doodler);

        if ((doodler_bottom >= platform_bottom) && 
            (doodler_bottom <= platform_bottom + platform_height) &&
            (doodler_leftspace + doodler_width >= platform_left) &&
            (doodler_leftspace <= platform_left + platform_width) && 
            !jumping) {
            console.log("Touching:", i, " th plank");
            jump_doodler();
        }
    }
}

function go_down() {

    if(jumping){
        jumping = false;
        // stop going up
        clearInterval(jump_up_id);
    }

    jump_down_id = setInterval(function () {
        let bottom = get_bottom(doodler);
        bottom -= 4;
        doodler.style.bottom = bottom + "px";
        // touching the bottom then game over
        if (bottom <= 0) {
            game_over();
        }
        sit_doodler();
    }, 30);
}

function jump_up() {

    jumping = true;

    // stop going down
    clearInterval(jump_down_id);

    let bottom_start = -1;

    jump_up_id = setInterval(function () {

        let bottom = get_bottom(doodler);
        if (bottom_start == -1) {
            bottom_start = bottom;
        }

        bottom += 4;
        doodler.style.bottom = bottom + "px";

        // to avoid going out of grid
        // height of grid is 700 and height of doodler is 100
        // so if bottom of doodler >= 600 means it is touching the top so come down
        if ((bottom - bottom_start) > 180 || bottom > 600) {
            go_down();
        }
    }, 30);
}

function jump_doodler() {
    // jump up the doodler
    jump_up();
}

function init() {
    create_platforms();
    create_doodler();
    moving_platforms_id = setInterval(move_platforms, 30);
    jump_doodler();
    document.addEventListener("keydown", key_control);
}


init();