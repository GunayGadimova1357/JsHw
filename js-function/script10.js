function InSeconds(hours, minutes=0, seconds=0) {

    return hours*3600 + minutes*60 + seconds;
}

function showTime(totalSeconds){

    let hours = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor((totalSeconds % 3600) / 60);
    let seconds = totalSeconds % 60;

    const hh = String(hours).padStart(2,'0');
    const mm = String(minutes).padStart(2,'0');
    const ss = String(seconds).padStart(2,'0');

    console.log(`${hh}:${mm}:${ss}`);
}

function secondsDiff(hh1, mm1, ss1, hh2, mm2, ss2){
    let inSsFirst = InSeconds(hh1, mm1, ss1);
    let inSsSecond = InSeconds(hh2, mm2, ss2);

    let diff = Math.abs(inSsFirst - inSsSecond);

    return showTime(diff);
}

secondsDiff(1,23,0,3,45,2);