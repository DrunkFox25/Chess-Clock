//var DisplayW = window.innerWidth;
//var DisplayH = window.innerHeight;

//window.addEventListener("resize", myFunction);

var doc = document.documentElement;

doc.style.backgroundColor = "#000000";

var t0 = document.getElementById("Timer0");
var t1 = document.getElementById("Timer1");
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







var Timer = {//line 182
    dt: 100,
    paused: true,
    t: [-1, -1],
    tpos: -1,

    reset : function(){
        this.tpos = 2;//2 is start val
        this.paused = true;

        this.t[0] = ClockMode.startTime(0);
        this.t[1] = ClockMode.startTime(1);

        update(this.t[0], this.t[1]);
    },

    update : function(Tis){//fuck tis shit
        if(!Tis.paused) Tis.t[Tis.tpos] -= Tis.dt;
        update(Tis.t[0], Tis.t[1]);
    },

    start : function(){
    	if(!this.paused) return;
        if(this.tpos == 2) return;
        
        this.paused = false;
        set(this.tpos, "play");
        this.Timer = setInterval((this.update), this.dt, this);
    },

    end : function(){
    	if(this.paused) return;
      
        clearInterval(this.Timer);
        set(this.tpos, "pref");
        this.paused = true;
    },

    press : function(val){
        if(this.tpos == 2){
            this.tpos = val;
            this.start();
        }
        if(this.paused) return;
        if(val != Timer.tpos) return;
        
        this.t[this.tpos] += ClockMode.inc[this.tpos];
        
        
        set(this.tpos, "paused");
        set(1-this.tpos, "play");
        
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


function f(param){//kept in for onclick f(this)\
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


reset();
