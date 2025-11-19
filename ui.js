
function strTime(time){
    if(time <= 1000) return Math.floor(time/10)/100;
    if(time <= 10*1000) return Math.floor(time/100)/10;
    if(time <= 60*1000) return Math.floor(time/1000);
    if(time <= 3600*1000*200) return (Math.floor(time/60000) + ":" + (Math.floor(time/1000)%60).toString().padStart(2, "0"));
    return "inf";
}

function timertext(time, showneg){
    if(time < 0 && showneg) return "<span class = \"material-symbols-rounded\">flag</span>";
    return "<span>"+strTime(time)+"</span>";
}

function strBool(b){
    if(b) return "true";
    else return "false";
}



function toggle(elem, values, success){
    if(success) elem.innerHTML = values[(values.indexOf(elem.innerHTML)+1)%values.length];
}

export{
    timertext,
    strBool,
    toggle,
};