const GAP = 8; 
let currentTip = null;
const btns = document.getElementsByClassName("btn");

for (let i = 0; i < btns.length; i++) {
  const btn = btns[i];

  btn.onmouseenter = function () {
    currentTip = document.createElement("div");
    currentTip.className = "tooltip";
    currentTip.textContent = btn.dataset.tip || ("Tool tip " + (i + 1));
    document.body.appendChild(currentTip);

    const r = btn.getBoundingClientRect();
    const tipW = currentTip.offsetWidth;
    const tipH = currentTip.offsetHeight;

    const left = r.left + r.width / 2 - tipW / 2 + window.scrollX;
    currentTip.style.left = left + "px";

    let top = r.top - tipH - GAP + window.scrollY;
    let place = "top";

    if (top < window.scrollY) {
      top = r.bottom + GAP + window.scrollY;
      place = "bottom";
    }

    currentTip.style.top = top + "px";
    currentTip.classList.add(place, "show");
  };

  btn.onmouseleave = function () {
    if (currentTip) {
      currentTip.remove();
      currentTip = null;
    }
  };
}