const lights = document.querySelectorAll('.light');
const btn = document.getElementById('nextBtn');

let index = 0; // 0 - красный, 1 - жёлтый, 2 - зелёный

function showLight() {
  lights.forEach((el, i) => {
    el.classList.toggle('active', i === index);
  });
}

btn.addEventListener('click', () => {
  index = (index + 1) % lights.length; 
  showLight();
});

showLight();