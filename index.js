//var DisplayW = window.innerWidth;
//var DisplayH = window.innerHeight;

//window.addEventListener("resize", myFunction);



var r = document.querySelector(':root');
var doc = document.documentElement;

var t0 = document.getElementById("Timer0");
var t1 = document.getElementById("Timer1");
let ti = [t0, t1];

var movcnt = document.getElementById("movcnt");



import {toggle, updateMovCnt, updateTimerElem} from 'ui.js';





var ClockMode = {
    start: [3*60*1000, 3*60*1000],
    inc: [2*1000, 2*1000],
    lowtime: 10*1000,

    startTime: function(index){
        if(this.start[index] <= 0) return this.inc[index];
        return this.start[index];
    },

    currentTimeMode: function(){
        if(start[0] == start[1] && inc[0] == inc[1]) return start[0]/(60*1000) + "+" + inc[0]/1000;
        return start[0]/(60*1000) + "+" + inc[0]/1000 + ";" + start[0]/(60*1000) + "+" + inc[0]/1000;
    },

    state: function(t){
        if(t <= 0) return "flag";
        if(t <= lowtime) return "lowtime";
        return "normal";
    },

    bound: function(t){
        return (t == 0)||(t == lowtime);//checks if ti[tpos].dataset.state needs to update
    }
};









var Timer = {//fix states, do it, idk
    dt: 1,
    paused: true,
    t: [-1, -1],
    tpos: -1,
    hlfmovcnt: 0,
    showneg: false,//needs to toggle if clicks on button when
    flagtime: -1,

    

    reload: function(){
        updateTimerElem(t0, this.t[0], this.paused, (this.tpos == 0), this.showneg);
        updateTimerElem(t1, this.t[1], this.paused, (this.tpos == 1), this.showneg);
        updateMovCnt(movcnt, hlfmovcnt);
    },

    setTime: function(currt){flagtime = this.t[this.tpos]+currt;},
    updateTime: function(currt){this.t[this.tpos] = flagtime-currt;},


    reset : function(){
        this.tpos = 2;//2 is start val
        this.paused = true;
        this.hlfmovcnt = 0;

        this.t[0] = ClockMode.startTime(0);
        this.t[1] = ClockMode.startTime(1);

        this.reload();
    },

    toggleplay: function(){
        if(this.tpos == 2) return false;

        if(this.paused){
            this.setTime();
                this.Timer = setInterval(function(){
                this.updateTime(performance.now());
                updateTimerElem(ti[this.tpos], this.t[this.tpos], false, true, this.showneg);
            }, this.dt);
        }
        else clearInterval(this.Timer);

        this.paused = !this.paused;

        this.reload();

        return true;
    },

    switch: function(){
        this.hlfmovcnt += 1;

        this.t[this.tpos] += ClockMode.inc[this.tpos];

        var Now = performance.now();
        
        this.updateTime(Now);

        this.tpos = 1-this.tpos;//switch players

        this.setTime(Now);

        this.reload();
    },

    press : function(val){
        if(this.paused){
            if(this.tpos == 2){
                if(val == "space") return;
                if(val == "Timer0") this.tpos = 1;
                if(val == "Timer1") this.tpos = 0;
            }

            toggleplay();

            return;
        }

        if(val == "Timer0" && this.tpos == 1) return;
        if(val == "Timer1" && this.tpos == 0) return;
        
        this.switch();
    }
};






var rot = 0;
//setTimerRotation(0);

function rotate(){
    rot += 90;
    setTextRot(t0, t1, rot);
    Timer.reload();
}


function f(param){Timer.press(param.id);/*onclick = f(this)*/}






var Slisten = 0;
function spaceon(){
    if(Slisten != 0) return;
    Slisten = document.addEventListener('keyup',
        event => {
            if (event.code === 'Space') {
                Timer.press("space");
            }
        }
    );
}

function spaceoff(){
    document.removeEventListener(Slisten);
    Slisten = 0;
}



Timer.reset();
spaceon();

/*
document.querySelectorAll("[data-anim]").forEach(function(elem){//set data-anim = "trigger1 trigger2"
    const arr = elem.dataset.anim.split(" ");
    arr.forEach(function(Ani){
        elem.addEventListener(Ani, function(){
            elem.dataset.event = undefined;
            requestAnimationFrame(function(t){
                elem.dataset.event = Ani;
            });
        });
    });
});*/

document.querySelectorAll("[data-anim]").forEach(function(elem){//set data-anim = "trigger1 trigger2"
    elem.dataset.anim.split(" ").forEach(function(Ani){
        elem.addEventListener(Ani, function(){
            elem.dataset.event = undefined;
            requestAnimationFrame(function(t){
                elem.dataset.event = Ani;
            });
        });
    });
});










function togglemute(){
    return true;
}





var smenu = document.getElementById("settingsmenu");
function opensettings(){
    smenu.hidden = !smenu.hidden;
}