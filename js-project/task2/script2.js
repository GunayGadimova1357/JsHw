const modal = document.getElementById("myModal");
const openbtn = document.getElementById("openBtn");
const closebtn = document.getElementById("closeBtn");

openbtn.onclick = function(){
    modal.style.display="flex";
}

closebtn.onclick = function(){
    modal.style.display="none";
}

window.onclick = function(event){
    if(event.target === modal){
        modal.style.display="none";
    }
}