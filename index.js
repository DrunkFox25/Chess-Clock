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
var cmode = document.getElementById("clockmode");







function Tstr(str){
    let arr = str.split('+');
    if(arr.length == 1) return [Number(arr[0])/(60*1000), 0];
    return [Number(arr[0])/(60*1000.0), Number(arr[1])/1000.0];
}

function Tget(start, inc){
    start /= 60*1000.0;
    inc /= 1000.0;
    if(inc == 0) return ""+start;
    return start+"+"+inc;
}

var ClockMode = {
    start: [3*60*1000, 3*60*1000],
    inc: [2*1000, 2*1000],
    lowtime: 10*1000,

    startTime: function(index){
        if(ClockMode.start[index] <= 0) return ClockMode.inc[index];
        return ClockMode.start[index];
    },

    currentTimeMode: function(){
        var str0 = Tget(ClockMode.start[0], ClockMode.inc[0]);
        var str1 = Tget(ClockMode.start[1], ClockMode.inc[1]);
        if(str0 == str1) return str0;
        return str0 + ";" + str1;
    },

    setTimeMode: function(str){
        var arr = [str.replaceAll(" ", "")];

        if(arr.length == 1) arr = arr[0].split(';');
        if(arr.length == 1) arr = arr[0].split(',');
        if(arr.length == 1) arr = arr[0].split('|');

        if(arr.length == 1) arr.push(arr[0]);

        for(var i = 0; i <= 2; i+=1){
            const TT = Tstr(arr[i]);
            start[i] = TT[0];
            inc[i] = TT[1];
        }
    },

    state: function(t){
        if(t <= 0) return "flag";
        if(t <= ClockMode.lowtime) return "lowtime";
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
    Timer: 0,



    updateText: function(i){
        ti[i].innerHTML = UI.timertext(Timer.t[i], Timer.showneg);
        ti[i].dataset.state = ClockMode.state(Timer.t[i]);
    },

    reload: function(){
        Timer.updateText(0);
        t0.dataset.paused = UI.strBool(Timer.paused);
        t0.dataset.active = UI.strBool(Timer.tpos == 0);

        Timer.updateText(1);
        t1.dataset.paused = UI.strBool(Timer.paused);
        t1.dataset.active = UI.strBool(Timer.tpos == 1);

        movcnt.innerHTML = Timer.hlfmovcnt;

        return;
    },

    mTime: function(){
        Timer.currt = performance.now();
    },
    setTime: function(){
        Timer.flagtime = Timer.t[Timer.tpos]+Timer.currt;
    },
    updateTime: function(){
        Timer.mTime();
        Timer.t[Timer.tpos] = Timer.flagtime-Timer.currt;
    },


    reset : function(){
        Timer.tpos = 2;
        Timer.paused = true;
        Timer.hlfmovcnt = 0;

        Timer.t[0] = ClockMode.startTime(0);
        Timer.t[1] = ClockMode.startTime(1);

        Timer.reload();

        return;
    },

    toggleplay: function(){
        if(Timer.tpos == 2) return false;

        if(Timer.paused){
            Timer.mTime();
            Timer.setTime();

            Timer.Timer = setInterval(function(){
                Timer.updateTime();
                Timer.updateText(Timer.tpos);
            }, Timer.dt);
        }
        else{clearInterval(Timer.Timer);}

        Timer.paused = !Timer.paused;

        Timer.reload();

        return true;
    },

    switch: function(){
        Timer.hlfmovcnt += 1;
        
        Timer.updateTime();

        Timer.t[Timer.tpos] += ClockMode.inc[Timer.tpos];
        
        Timer.tpos = 1-Timer.tpos;//switch players

        Timer.setTime();

        Timer.reload();

        return;
    },

    event : function(val){
        if(val == "space" && !Timer.spaceswitch) return;

        if(Timer.paused){
            if(Timer.tpos == 2){
                if(val == "space") return;
                if(val == Timer.tpos) return;
                Timer.tpos = 1-val;
            }

            Timer.toggleplay();

            return;
        }

        if(1-val == Timer.tpos) return;
        
        Timer.switch();

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
    if(param.id == "Timer0") Timer.event(0);
    if(param.id == "Timer1") Timer.event(1);
}//onclick f(Timer)




document.addEventListener('keyup',
    event => {
        if(event.code == 'Space') Timer.event("space");
        if(event.code == 'Enter' || event.key == 'Enter') ClockMode.setTimeMode(cmode.value);``
    }
);
/*
cmode.addEventListener('keyup',
    event => {
    }
);*/




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
            elem.dataset.event = "";
            setTimeout(function(){
                alert();
                elem.dataset.event = Ani;
            }, 10);
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
