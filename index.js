//var DisplayW = window.innerWidth;
//var DisplayH = window.innerHeight;

//window.addEventListener("resize", myFunction);

const ClockMode = {
    start: [3*60*1000, 3*60*1000],
    inc: [2*1000, 2*1000],

    startTime: function(index){
        if(this.start[index] <= 0) return this.inc[index];
        return this.start[index];
    }
};


let byId = document.getElementById;



const tb = {
    ti: [byId("Timer0"), byId("Timer1")],

    set : function(val, mode){
        this.ti[val].dataset.state = mode;
    }
};

var doc = document.documentElement;

doc.style.backgroundColor = "#000000";




function strTime(time){
    if(time > 3600*1000*200) return "inf";
    if(time <= 1000) return Math.floor(time/10)/100;
    if(time <= 10000) return Math.floor(time/100)/10;
    if(time <= 60000) return Math.floor(time/1000);
    return (Math.floor(time/60000) + ":" + (Math.floor(time/1000)%60).toString().padStart(2, "0"));
}

function centeredRot(rot){
    return "translate(-50%, -50%) rotate("+rot+"deg)";
}


const TimerText = {
    tt0: byId("TimerText0"),
    tt1: byId("TimerText1"),

    update : function(t0, t1){
        tt0.innerHTML = strTime(t0);
        tt1.innerHTML = strTime(t1);
    },

    setRot : function(rot){
        tt0.style.transform = centeredRot(rot);
        tt1.style.transform = centeredRot(-rot);
    }
};







var Timer = {
    dt: 1,
    paused: true,
    t: [-1, -1],
    tpos: -1,

    reset : function(t0, t1){
        this.tpos = 2;//2 is start val
        this.paused = true;

        this.t[0] = t0;
        this.t[1] = t1;

        TimerText.update(t0, t1);
    },

    update : function(){
        if(!this.paused) this.t[this.tpos] -= this.dt;
        TimerText.update(this.t[0], this.t[1]);
    },

    start : function(){
    	if(!this.paused) return;
        
        this.paused = false;
    	tb.set(this.tpos, "play");
        this.Timer = setInterval(this.update, this.dt);
    },

    end : function(){
    	if(Timer.paused) return;
        
        clearInterval(this.Timer);
    	tb.set(this.tpos, "pref");
        this.paused = true;
    },

    press : function(val){
        if(this.tpos == 2){
            this.tpos = val;
            this.start();
        }
        if(this.paused) return;
        if(val != Timer.tpos) return;
        
        this.t[this.tpos] += this.inc[this.tpos];
        
        
        tb.set(this.tpos, "paused");
        tb.set(1-this.tpos, "play");
        
        this.tpos = 1-this.tpos;//switch players

        
    }
};





var rot = 0;
//setTimerRotation(0);

function rotate(){
    rot += 90;

    TimerText.setrot(rot);
}


function f(param){//kept in for onlclick f(this)
    var val = param.dataset.val;

    Timer.press(param.dataset.val);
}


function pause(){
    Timer.end();
}

function play(){
	Timer.start();
}

function reset(){
    Timer.reset();
}


Timer.reset();
