function time(hours, minutes=0, seconds=0){
    
    if (![hours, minutes, seconds].every(Number.isInteger)) {
        return "only integer";
    }
    if (hours < 0) {
        return "invalid input";
    }
    if (minutes < 0 || minutes > 59) {
        return "invalid input";
    }
    if (seconds < 0  || seconds > 59) {
        return "invalid input";
    }
    
    const hh = String(hours).padStart(2,'0');
    const mm = String(minutes).padStart(2,'0');
    const ss = String(seconds).padStart(2,'0');

    console.log(`${hh}:${mm}:${ss}`);
}
time(1,50);
time(3,49,2);
time(9);