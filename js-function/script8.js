function InSeconds(hours, minutes=0, seconds=0) {
    
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

    return hours*3600 + minutes*60 + seconds;
}

console.log(InSeconds(2, 45, 0))