const field = document.getElementById('field');
const ball  = document.getElementById('ball');

const BALL_SIZE = 100;

function centerBall() {
  const r = field.getBoundingClientRect();
  ball.style.left = (r.width  - BALL_SIZE) / 2 + 'px';
  ball.style.top  = (r.height - BALL_SIZE) / 2 + 'px';
}

function moveBall(e) {
  const r = field.getBoundingClientRect();

  let x = e.clientX - r.left - BALL_SIZE / 2;
  let y = e.clientY - r.top  - BALL_SIZE / 2;

  const maxX = r.width  - BALL_SIZE;
  const maxY = r.height - BALL_SIZE;

  if (x < 0) x = 0;
  if (y < 0) y = 0;
  if (x > maxX) x = maxX;
  if (y > maxY) y = maxY;

  ball.style.left = x + 'px';
  ball.style.top  = y + 'px';
}

window.addEventListener('load', centerBall);
window.addEventListener('resize', centerBall);
field.addEventListener('click', moveBall);