import * as UI from "./ui.js";







//var DisplayW = window.innerWidth;
//var DisplayH = window.ninnerHeight;
//darker background when not in fullscreen menu





//window.addEventListener("resize", myFunction);

var r = document.querySelector(':root');
var doc = document.documentElement;

var t0 = document.getElementById("Timer0");
var t1 = document.getElementById("Timer1");
let ti = [t0, t1];


var pmenu = document.getElementById("playmenu");
var movcnt = document.getElementById("movcnt");


var smenu = document.getElementById("settingsmenu");








var ClockMode = {
    start: [3*60*1000, 3*60*1000],
    inc: [2*1000, 2*1000],
    lowtime: 10*1000,

    startTime: function(index){
        if(this.start[index] <= 0) return this.inc[index];
        return this.start[index];
    },

    currentTimeMode: function(){
        if(this.start[0] == this.start[1] && this.inc[0] == this.inc[1]) return (this.start[0]/(60*1000) + "+" + this.inc[0]/1000);
        return (this.start[0]/(60*1000) + "+" + this.inc[0]/1000 + ";" + this.start[0]/(60*1000) + "+" + this.inc[0]/1000);
    },

    state: function(t){
        if(t <= 0) return "flag";
        if(t <= this.lowtime) return "lowtime";
        return "normal";
    }
};









var Timer = {
    dt: 1,
    paused: true,
    t: [-1, -1],
    tpos: -1,
    hlfmovcnt: 0,
    showneg: false,//needs to toggle if clicks on button when
    flagtime: -1,
    spaceswitch: true,
    currt: 0,



    updateText: function(i){
        ti[i].innerHTML = UI.timertext(this.t[i], this.showneg);
        ti[i].dataset.state = ClockMode.state(this.t[i]);
    },

    reload: function(){
        this.updateText(0);
        t0.dataset.paused = UI.strBool(this.paused);
        t0.dataset.active = UI.strBool(this.tpos == 0);

        this.updateText(1);
        t1.dataset.paused = UI.strBool(this.paused);
        t1.dataset.active = UI.strBool(this.tpos == 1);

        movcnt.innerHTML = this.hlfmovcnt;

        return;
    },

    mTime: function(){
        this.currt = performance.now();
    },
    setTime: function(){
        this.flagtime = this.t[this.tpos]+this.currt;
    },
    updateTime: function(){
        this.mTime();
        this.t[this.tpos] = this.flagtime-this.currt;
    },


    reset : function(){
        this.tpos = 2;
        this.paused = true;
        this.hlfmovcnt = 0;

        this.t[0] = ClockMode.startTime(0);
        this.t[1] = ClockMode.startTime(1);

        this.reload();

        return;
    },

    toggleplay: function(){
        if(this.tpos == 2) return false;

        if(this.paused){
            this.mTime();
            this.setTime();

            this.Timer = setInterval(function(){
                this.updateTime();
                this.updateText(this.tpos);
            }, this.dt);
        }
        else{clearInterval(this.Timer);}

        this.paused = !this.paused;

        this.reload();

        return true;
    },

    switch: function(){
        this.hlfmovcnt += 1;
        
        this.updateTime();

        this.t[this.tpos] += ClockMode.inc[this.tpos];
        
        this.tpos = 1-this.tpos;//switch players

        this.setTime();

        this.reload();

        return;
    },

    event : function(val){
        if(val == "space" && !this.spaceswitch) return;

        if(this.paused){
            if(this.tpos == 2){
                if(val == "space") return;
                if(val == "Timer0" && this.tpos == 0) return;
                if(val == "Timer1" && this.tpos == 1) return;
            }

            this.toggleplay();

            return;
        }

        if(val == "Timer0" && this.tpos == 1) return;
        if(val == "Timer1" && this.tpos == 0) return;
        
        this.switch();

        return;
    }
};



var rot = 0;
function rotate(){
    rot += 90;
    setTextRot(t0, t1, rot);
    Timer.reload();
}




function f(param){
    Timer.event(param.id);
}//onclick f(this)




document.addEventListener('keyup',
    event => {
        if(event.code == 'Space') Timer.event("space");
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

        if(id == "playbutton") UI.toggle(elem, ['pause', 'play_arrow'], Timer.toggleplay());
        else if(id == "settingsbutton") opensettings();
        else if(id == "refreshbutton") Timer.reset();
        else if(id === "mutebutton") UI.toggle(elem, ['volume_up', 'volume_off'], togglemute());
    }
);



function opensettings(){
    if(smenu.hidden){
        smenu.hidden = true;
        if(!Timer.paused) Timer.toggleplay();
    }
    else smenu.hidden = true;
}




window.f = f;
window.rotate = rotate;

export {
    f,
    rotate,
}
