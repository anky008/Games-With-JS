let greenBtn = document.querySelector('.green');
let redBtn = document.querySelector('.red');
let yellowBtn = document.querySelector('.yellow');
let blueBtn = document.querySelector('.blue');
let levelHeader=document.querySelector('.level-header');

let ids = ["00", "01", "10", "11"];
let classes = ["green", "red", "yellow", "blue"];
let userIp = [];
let pattern = [];
let level = 1;
let selfClick = 0;
let gameStart=false;

// depending on the current level
// will generate a pattern 
function generatePattern() {

    levelHeader.innerText=`Level ${level}`;

    pattern = [];
    userIp=[];

    for (let i = 0; i < level; i++) {
        let idx = Math.floor((ids.length) * Math.random());
        console.log(idx);
        pattern.push(ids[idx]);
    }

    console.log(pattern);
    // from the generated pattern glow the div's in that order
    glow(0, pattern);
}

function glow(idx, pattern) {

    //let x=Date();
    //console.log("Time now:",x);

    if (idx == pattern.length) {
        return;
    }

    let div = document.getElementById(pattern[idx]);
    div.click();
    setTimeout(glow, 1000, idx + 1, pattern);

}

redBtn.addEventListener("click", function (e) {

    if (userIp.length >= level || gameStart==false) {
        return;
    }

    console.log("Red clicked!");
    if(selfClick==level){
        userIp.push(redBtn.id);
    }

    else{
        selfClick++;
    }

    fadeInOutAnimation(redBtn);
})


greenBtn.addEventListener("click", function (e) {

    if (userIp.length >= level || gameStart==false) {
        return;
    }

    console.log("Green clicked!");

    // this is a user input
    if (selfClick == level) {
        userIp.push(greenBtn.id);
    }

    else {
        selfClick++;
    }

    fadeInOutAnimation(greenBtn);
})


blueBtn.addEventListener("click", function (e) {

    if (userIp.length >= level || gameStart==false) {
        return;
    }

    console.log("Blue clicked!");

    if (selfClick == level) {
        userIp.push(blueBtn.id);
    }

    else {
        selfClick++;
    }

    fadeInOutAnimation(blueBtn);
})


yellowBtn.addEventListener("click", function (e) {

    if (userIp.length >= level || gameStart==false) {
        return;
    }

    console.log("Yellow clicked!");

    if (selfClick == level) {
        userIp.push(yellowBtn.id);
    }

    else {
        selfClick++;
    }

    fadeInOutAnimation(yellowBtn);
})


function fadeInOutAnimation(div) {
    
    let color=div.classList[1];
    
    let audio=new Audio(`./sounds/${color}.mp3`);
    audio.play();

    let opacity = 1;
    let fadeOutId = setInterval(function () {
        if (opacity > 0) {
            opacity -= 0.1;
            div.style.opacity = opacity;
        }

        else {
            clearInterval(fadeOutId);
        }
    }, 100);

    opacity = 0;

    let fadeInId = setInterval(function () {
        if (opacity < 1) {
            opacity += 0.1;
            div.style.opacity = opacity;
        }

        else {
            clearInterval(fadeInId);
        }
    }, 100);


    setTimeout(function () {
        if (userIp.length >= level) {
            matchSequences();
        }
    }, 200);
}

let matching = false;
function matchSequences() {

    if (userIp.length < level) {
        return;
    }

    if (matching) {
        return;
    }

    console.log(userIp);

    selfClick = 0;
    matching = true;

    console.log("level:", level);
    console.log("pattern:", pattern);
    console.log("user input:", userIp);


    let areEqual = true;
    for (let i = 0; i < level; i++) {
        if (userIp[i] != pattern[i]) {
            areEqual = false;
            break;
        }
    }


    if (areEqual) {
        console.log("Congrats!");
        level++;
        matching = false;
        userIp=[];
        pattern=[];
        setTimeout(generatePattern,1000);
    }

    else{
        let audio=new Audio(`./sounds/wrong.mp3`);
        audio.play();

        gameStart=false;
        levelHeader.innerText="Game Over! Press Any Key To Restart!";
    }
}

document.addEventListener('keydown', function(event){
    if(event.key && gameStart==false){
        gameStart=true;
        level=1;
        userIp=[];
        pattern=[];
        matching=false;
        setTimeout(generatePattern,1000);
    }
});
