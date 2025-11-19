
function strTime(time){
    if(time <= 1000) return Math.floor(time/10)/100;
    if(time <= 10*1000) return Math.floor(time/100)/10;
    if(time <= 60*1000) return Math.floor(time/1000);
    if(time <= 3600*1000*200) return (Math.floor(time/60000) + ":" + (Math.floor(time/1000)%60).toString().padStart(2, "0"));
    return "inf";
}

function timertext(time){
    if(time == "flag") return "<span class = \"material-symbols-rounded\">flag</span>";
    return "<span>"+strTime(time)+"</span>";
}

function strBool(b){
    if(b) return "true";
    else return "false";
}



function updateTimerElem(elem, time, mode, paused, active){
    elem.innerHTML = timertext(time);
    elem.dataset.state = mode;
    elem.dataset.paused = paused;
    elem.dataset.active = active;
}

function updateMovCnt(elem, cnt){
    elem.innerHTML = cnt;
}

function toggle(elem, values, success){
    if(success) elem.innerHTML = values[(values.indexOf(elem.innerHTML)+1)%values.length];
}

export{
    timertext,
    strBool,
    toggle,
    updateMovCnt,
    updateTimerElem
};