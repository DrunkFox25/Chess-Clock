//var DisplayW = window.innerWidth;
//var DisplayH = window.innerHeight;

//window.addEventListener("resize", myFunction);

let start = [3*60*1000, 3*60*1000];
let inc = [2*1000, 2*1000];

function starttime(a, b){
    if(a == 0) return b;
    return a;
}

let t = [starttime(start[0],inc[0]), starttime(start[0],inc[0])];
var tpos = 2;//2 is start val
var paused = true;

var T0 = document.getElementById("TimerText0");
var T1 = document.getElementById("TimerText1");
var tb0 = document.getElementById("Timer0");
var tb1 = document.getElementById("Timer1");
var doc = document.documentElement;

doc.style.backgroundColor = "#000000";

let TimerText = [T0, T1];
let tb = [tb0, tb1];


function strTime(time){
    if(time > 3600*1000*200) return "inf";
    if(time <= 1000) return Math.floor(time/10)/100;
    if(time <= 10000) return Math.floor(time/100)/10;
    if(time <= 60000) return Math.floor(time/1000);
    return (Math.floor(time/60000) + ":" + (Math.floor(time/1000)%60).toString().padStart(2, "0"));
}


var Timer;

function updateTimer(deltatime){
    if(!paused) t[tpos] -= deltatime;
    TimerText[tpos].innerHTML = strTime(t[tpos]);
}


function startTimer(){
    paused = false;
    Timer = setInterval(updateTimer, 10, 10);
}

function endTimer(){
    paused = true;
    clearInterval(Timer);
}

T0.innerHTML = strTime(t[0]);
T1.innerHTML = strTime(t[1]);

function centeredRot(rot){
    return "translate(-50%, -50%) rotate("+rot+"deg)";
}

function setTimerRotation(rot){
    T0.style.transform = centeredRot(rot);
    T1.style.transform = centeredRot(-rot);
}

var rot = 0;
setTimerRotation(0);

function rotate(){
    rot += 90;

    setTimerRotation(rot);
}


function f(param){
    var val = param.dataset.val;
    if(tpos == 2){
        tpos = val;
        startTimer();
    }
    if(paused) return;
    if(val != tpos) return;
    
    t[tpos] += inc[tpos];
    
    
    tb[tpos].dataset.state = "paused";
    tb[1-tpos].dataset.state = "play";
    
    tpos = 1-tpos;//switch players

    return;
}

function pause(){
    endTimer();
    
    tb[tpos].dataset.state = "pref";
}

function play(){
    tb[tpos].dataset.state = "play";
    
    startTimer();
}

function reset(){
    t[0]--;
    t[1]--;
}
