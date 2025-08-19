function showTime(totalSeconds){

    let hours = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor((totalSeconds % 3600) / 60);
    let seconds = totalSeconds % 60;

    const hh = String(hours).padStart(2,'0');
    const mm = String(minutes).padStart(2,'0');
    const ss = String(seconds).padStart(2,'0');

    console.log(`${hh}:${mm}:${ss}`);
}
showTime(9900);