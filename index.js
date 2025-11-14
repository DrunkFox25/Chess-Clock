//var DisplayW = window.innerWidth;
//var DisplayH = window.innerHeight;

//window.addEventListener("resize", myFunction);

var doc = document.documentElement;

doc.style.backgroundColor = "#000000";

let byId = document.getElementById;

var t0 = byId("Timer0");
var t1 = byId("Timer1");
let ti = [t0, t1];







function strTime(time){
    if(time > 3600*1000*200) return "inf";
    if(time <= 1000) return Math.floor(time/10)/100;
    if(time <= 10000) return Math.floor(time/100)/10;
    if(time <= 60000) return Math.floor(time/1000);
    return (Math.floor(time/60000) + ":" + (Math.floor(time/1000)%60).toString().padStart(2, "0"));
}

function timertext(text, rot){
    return "<span style = 'rotate("+rot+")'>"+text+"</span>";
}





const ClockMode = {
    start: [3*60*1000, 3*60*1000],
    inc: [2*1000, 2*1000],

    startTime: function(index){
        if(this.start[index] <= 0) return this.inc[index];
        return this.start[index];
    }
};

function set(val, mode){
    ti[val].dataset.state = mode;
}



var textrot = 0;
function setTextRot(rot){
    textrot = rot;
}
function update(T0, T1){
    t0.innerHTML = timertext(strTime(T0), textrot);
    t1.innerHTML = timertext(strTime(T1), textrot);
}







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

        update(t0, t1);
    },

    update : function(){
        if(!this.paused) this.t[this.tpos] -= this.dt;
        update(this.t[0], this.t[1]);
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
    setTextRot(rot);
    update();
}


function f(param){//kept in for onclick f(this)
    Timer.press(param.dataset.val);
}


function pause(){
    Timer.end();
}

function play(){
	Timer.start();
}

function reset(){
    Timer.reset(ClockMode.startTime(0), ClockMode.startTime(1));
}


reset();
