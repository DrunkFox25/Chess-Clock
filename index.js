//var DisplayW = window.innerWidth;
//var DisplayH = window.innerHeight;

import * as UI from "./ui";

//window.addEventListener("resize", myFunction);




var r = document.querySelector(':root');
var doc = document.documentElement;

var t0 = document.getElementById("Timer0");
var t1 = document.getElementById("Timer1");
var pmenu = document.getElementById("playmenu");
let ti = [t0, t1];

var movcnt = document.getElementById("movcnt");









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
    spaceswitch: true,

    

    reload: function(){
        UI.updateTimerElem(t0, this.t[0], this.paused, (this.tpos == 0), this.showneg);
        UI.updateTimerElem(t1, this.t[1], this.paused, (this.tpos == 1), this.showneg);
        UI.updateMovCnt(movcnt, this.hlfmovcnt);
    },

    setTime: function(currt){this.flagtime = this.t[this.tpos]+currt;},
    updateTime: function(currt){this.t[this.tpos] = this.flagtime-currt;},


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
                UI.updateTimerElem(ti[this.tpos], this.t[this.tpos], false, true, this.showneg);
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

        this.updateTime(performance.now());

        this.reload();
    },

    event : function(val){
        if(val === "space" && !this.spaceswitch) return;

        if(this.paused){
            if(this.tpos == 2){
                if(val === "space") return;
                if(val === "Timer0") this.tpos = 1;
                if(val === "Timer1") this.tpos = 0;
            }

            this.toggleplay();

            return;
        }

        if(val === "Timer0" && this.tpos == 1) return;
        if(val === "Timer1" && this.tpos == 0) return;
        
        this.switch();
    }
};






var rot = 0;
//setTimerRotation(0);

function rotate(){
    rot += 90;
    UI.setTextRot(t0, t1, rot);
    Timer.reload();
}


function f(param){Timer.event(param.id);/*onclick = f(this)*/}





document.addEventListener('keyup',
    event => {
        if (event.code === 'Space') Timer.event("space");
    }
);




Timer.reset();

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





pmenu.addEventListener('click',
    event => {
        var elem = event.target;
        var id = elem.id;

        if(id == "playbutton") toggle(elem, ['pause', 'play_arrow'], Timer.toggleplay());
        else if(id == "settingsbutton") opensettings('propably need to pause automaticly for this');
        else if(id == "refreshbutton") Timer.reset();
        else if(id === "mutebutton") toggle(elem, ['volume_up', 'volume_off'], togglemute());
    }
);



var smenu = document.getElementById("settingsmenu");
function opensettings(){
    smenu.hidden = !smenu.hidden;
}


UI.a('x');