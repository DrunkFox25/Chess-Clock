


//var DisplayW = window.innerWidth;
//var DisplayH = window.ninnerHeight;
//darker background when not in fullscreen menu





//window.addEventListener("resize", myFunction);

var r = document.querySelector(':root');
var doc = document.documentElement;

var t0 = document.getElementById("Timer0");
var t1 = document.getElementById("Timer1");



var movcnt = document.getElementById("movcnt");


var smenu = document.getElementById("settingsmenu");
var cmode = document.getElementById("clockmode");
var playbutton = document.getElementById("playbutton");

const audiomove = document.getElementById('Move');
const audiolowtime = document.getElementById('LowTime');
const audioflag = document.getElementById('GenericNotify');








function toggle(elem, values, success){
    if(success) elem.innerHTML = values[(values.indexOf(elem.innerHTML)+1)%values.length];
}









function Tget(start, inc){
    if(inc == 0) return ""+start;
    return start+"+"+inc;
}

var ClockMode = {
    start: [-1000, -1000],
    inc: [-1000, -1000],

    currentTimeMode: function(){
        const str0 = Tget(ClockMode.start[0]/(60*1000.0), ClockMode.inc[0]/1000.0);
        const str1 = Tget(ClockMode.start[1]/(60*1000.0), ClockMode.inc[1]/1000.0);
        if(str0 == str1) return str0;
        return str0 + "|" + str1;
    },

    setTimeMode: function(str){
        var arr = cmode.value.replaceAll(" ", "").split('|');

        if(arr.length == 1) arr.push(arr[0]);

        for(var i = 0; i <= 2; i+=1){
          const modestr = (arr[i]+"+0").split('+');
          ClockMode.start[i] = Math.max(Number(modestr[0])*60*1000, Number(modestr[1])*1000);
          ClockMode.inc[i] = Number(modestr[1])*1000;
        }
    }
};






function timertext(time, showneg){
    time /= 1000;
    if(time < 0){
        if(!showneg) return "<span class = \"material-symbols-rounded\">flag</span>";
        return "<span>"+time.toFixed(0)+"</span>";
    }
    if(time > 60) return "<span>" + Math.floor(time/60).toFixed(0) + ":" + String(Math.floor(time%60)).padStart(2, '0') + "</span>";
    return "<span>" + time.toPrecision(2) + "</span>";
}


var Timer = {
    dt: 1,
    t: [-1, -1],
    tpos: -1,
    hlfmovcnt: 0,
    showneg: true,
    flagtime: -1,
    spaceswitch: true,
    currt: 0,
    Timer: 0,//paused iff this is 0
    lowtime: 10*1000,
    soundtime: 15*1000,
    canmakesound: [false, false],
    canmakesoundflag: [true, true],
    muted: false,

    getState: function(index){
      if(Timer.t[index] <= 0){
        if(!Timer.muted && Timer.canmakesoundflag[index]){
          audioflag.play();
          //console.log(audioflag.play());
          Timer.canmakesoundflag[index] = false;
        }
        return "flag";
      }
      if(Timer.t[index] <= Timer.lowtime){
        if(Timer.canmakesound[index]){
          Timer.canmakesound[index] = false;
          if(!Timer.muted) audiolowtime.play();
        }
        return "lowtime";
      }
      if(Timer.t[index] <= Timer.soundtime){
        Timer.canmakesound[index] = true;
      }

      return "normal";
    },

    reload : function(){
        t0.innerHTML = timertext(Timer.t[0], Timer.showneg);
        t0.dataset.state = Timer.getState(0);

        t1.innerHTML = timertext(Timer.t[1], Timer.showneg);
        t1.dataset.state = Timer.getState(1);

        t0.dataset.paused = String(Timer.Timer == 0);
        t0.dataset.active = String(Timer.tpos == 0);

        t1.dataset.paused = String(Timer.Timer == 0);
        t1.dataset.active = String(Timer.tpos == 1);

        movcnt.innerHTML = Timer.hlfmovcnt;
        playbutton.innerHTML = (Timer.Timer == 0 ? "play_arrow" : "pause");
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
        Timer.pause();
        Timer.tpos = 2;
        Timer.hlfmovcnt = 0;

        Timer.canmakesound = [false, false];
        Timer.canmakesoundflag = [true, true];
        Timer.Timer = 0;

        Timer.t[0] = ClockMode.start[0];
        Timer.t[1] = ClockMode.start[1];

        Timer.reload();

        return;
    },

    unpause: function(){
      if(Timer.Timer != 0) return false;
      if(Timer.tpos == 2) return false;

      Timer.mTime();
      Timer.setTime();

      Timer.Timer = setInterval(function(){
        Timer.updateTime();
          Timer.reload();
      }, Timer.dt);

      Timer.updateTime();
      Timer.reload();

      return true;
    },

    pause: function(){
      if(Timer.Timer == 0) return false;
      
      clearInterval(Timer.Timer);
      Timer.Timer = 0;

      Timer.reload();

      return true;
    },

    switchplayers: function(){
        Timer.hlfmovcnt += 1;
        
        Timer.updateTime();

        Timer.t[Timer.tpos] += ClockMode.inc[Timer.tpos];
        
        Timer.tpos = 1-Timer.tpos;//switch players

        Timer.setTime();

        Timer.reload();

        if(!Timer.muted) audiomove.play();


        return;
    },

    space: function(){
      if(!Timer.spaceswitch) return;

      if(Timer.Timer == 0) Timer.unpause();
      else Timer.switchplayers();
    },

    click : function(val){
      if(Timer.Timer == 0){
        Timer.tpos = val;
        Timer.unpause();
      }
      
      if(Timer.tpos == val) Timer.switchplayers();

      return;
    }
};


var rot = 0;
function rotate(){
    rot += 90;
    t0.style.setProperty('--textrot', rot+"deg");
    t1.style.setProperty('--textrot', -rot+"deg");
    Timer.reload();
}

window.addEventListener('keydown', (event) => {
  if (event.code === 'Space') {
    audioflag.play();
    Timer.space();
  }
});








ClockMode.setTimeMode();
Timer.reset();




document.querySelectorAll("[data-anim]").forEach(function(elem){//set data-anim = "trigger1 trigger2"
    elem.dataset.anim.split(" ").forEach(function(Ani){
        elem.addEventListener(Ani, function(){
            elem.dataset.event = "";
            setTimeout(function(){elem.dataset.event = Ani;}, 10);
        });
    });
});





async function togglefullscreen(){
  if (!document.fullscreenElement) {
    try{await document.documentElement.requestFullscreen();}
    catch{return false;}
  }
  else document.exitFullscreen();
  return true;
}

function addtime(index){
  Timer.t[index] += 10*1000;
  if(Timer.tpos == index) Timer.flagtime += 10*1000;
  Timer.reload();
}

function togglemute(){
  Timer.muted = !Timer.muted;
  return true;
}

function setuseflag(val){
  Timer.showneg = !val;
}

let confirmreset = false;
function setconfirmreset(val){
  confirmreset = val;
}

function treset(){
  if(confirmreset){
    if(!confirm("Are you sure you want to reset?")) return;
  }
  Timer.reset();
}





function setdeaf(state){
  t0.dataset.deafmode = String(state);
  t1.dataset.deafmode = String(state);
}

function toggleplay(){
    if(Timer.Timer == 0){
      return Timer.unpause();
    }
    else{
      return Timer.pause();
    }
}

function clicktimer(val){Timer.click(val);}
function settime(str){ClockMode.setTimeMode(str);}


Object.assign(window, {treset, toggleplay, toggle, togglemute, togglefullscreen, clicktimer, settime, addtime, rotate, setuseflag, setconfirmreset, setdeaf});


/*
<style>
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input { 
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #2196F3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

</style>

<label class="switch">
  <input type="checkbox" checked>
  <span class="slider"></span>
</label>
*/
