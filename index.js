//var DisplayW = window.innerWidth;
//var DisplayH = window.innerHeight;

//window.addEventListener("resize", myFunction);

var doc = document.documentElement;

doc.style.backgroundColor = "#000000";

var t0 = document.getElementById("Timer0");
var t1 = document.getElementById("Timer1");
let ti = [t0, t1];

var movcnt = document.getElementById("movcnt");







function strTime(time){
    if(time > 3600*1000*200) return "inf";
    if(time <= 1000) return Math.floor(time/10)/100;
    if(time <= 10000) return Math.floor(time/100)/10;
    if(time <= 60000) return Math.floor(time/1000);
    return (Math.floor(time/60000) + ":" + (Math.floor(time/1000)%60).toString().padStart(2, "0"));
}

function timertext(text, rot){
    return "<span style = 'transform: rotate("+rot+"deg)'>"+text+"</span>";
}





var ClockMode = {
    start: [3*60*1000, 3*60*1000],
    inc: [2*1000, 2*1000],

    startTime: function(index){
        if(this.start[index] <= 0) return this.inc[index];
        return this.start[index];
    },

    currentTimeMode: function(){
        if(start[0] == start[1] && inc[0] == inc[1]) return start[0]/(60*1000) + "+" + inc[0]/1000;
        return start[0]/(60*1000) + "+" + inc[0]/1000 + ";" + start[0]/(60*1000) + "+" + inc[0]/1000;
    }
};

function set(val, mode){
    ti[val].dataset.state = mode;
}



var textrot = 0;
function setTextRot(rot){
    textrot = rot;
}

var Timer = {//173
    dt: 100,
    paused: true,
    t: [-1, -1],
    tpos: -1,
    hlfmovcnt: 0,

    reset : function(){
        this.tpos = 2;//2 is start val
        this.paused = true;
        this.hlfmovcnt = 0;

        this.t[0] = ClockMode.startTime(0);
        this.t[1] = ClockMode.startTime(1);

        ti[0].dataset.state = "paused";
        ti[0].dataset.state = "paused";

        this.updateText();
    },

    updateText : function(){
        t0.innerHTML = timertext(strTime(this.t[0]), textrot);
        t1.innerHTML = timertext(strTime(this.t[1]), -textrot);
        movcnt.innerHTML = this.hlfmovcnt;
    },

    update : function(){
        this.t[Timer.tpos] -= this.dt;
        this.updateText();
    },

    start : function(){
        
        this.paused = false;
        ti[this.tpos].dataset.state = "play";
        this.Timer = setInterval(u, this.dt);
    },

    end : function(){

        clearInterval(this.Timer);
        ti[this.tpos].dataset.state = "pref";
        this.paused = true;

    },

    toggleplay: function(){
        if(this.tpos == 2) return false;

        if(this.paused) this.start();
        else this.end();

        return true;
    },

    switch: function(){
        this.hlfmovcnt += 1;

        this.t[this.tpos] += ClockMode.inc[this.tpos];

        ti[this.tpos].dataset.state = "paused";
        ti[1-this.tpos].dataset.state = "play";
        
        this.tpos = 1-this.tpos;//switch players
    },

    press : function(val){
        if(this.paused){
            if(this.tpos == 2){
                if(val == "space") return;
                this.tpos = 1-val;
            }

            this.start();

            return;
        }
        if(1-this.tpos == val) return;
        
        this.switch();
    }
};



function u(){
    Timer.update();
}



var rot = 0;
//setTimerRotation(0);

function rotate(){
    rot += 90;
    setTextRot(rot);
    Timer.updateText(Timer);
}


function f(param){/*kept in for onclick f(this)*/
    Timer.press(param.dataset.val);
}






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







function toggle(elem, values, success){
    if(success) elem.innerHTML = values[(values.indexOf(elem.innerHTML)+1)%values.length];
}



function togglemute(){
    return true;
}


function initCustomAni(){
    document.querySelectorAll(".customani").forEach(function(elem){//set data-anim = "[["trigger", "animstate", lengthoftime], [], []]"
        const arr = JSON.parse(elem.dataset.anim);
        arr.forEach(function(Ani){
            elem.addEventListener(Ani[0], function(){
                if(elem.dataset.animstate != "none" && elem.dataset.__anim != undefined) clearTimeout(elem.dataset.__anim);
                elem.dataset.animstate = Ani[1];
                elem.dataset.__anim = setTimeout(function(){
                    elem.dataset.animstate = "none";
                }, Ani[2]);
            });
        });
    });
}

initCustomAni();

var smenu = document.getElementById("settingsmenu");
function opensettings(){
    smenu.hidden = !smenu.hidden;
}