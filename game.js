let movement = 2.5,
  grativy = 0.5;
let alien = document.querySelector('.alien');
let img = document.getElementById('alien-1');

let alien_ride = alien.getBoundingClientRect();
let background = document.querySelector('.background').getBoundingClientRect();

let message = document.querySelector('.message');
let score_value = document.querySelector('.score_value');
let score_title = document.querySelector('.score_title');
let highscore_value = document.querySelector('.highscore_value');
let highscore_title = document.querySelector('.highscore_title');

let sound_jump = new Audio('sounds/jump.mp3');
let sound_fall = new Audio('sounds/fall.mp3');

let game_status = 'Start';
img.style.display = 'none';
message.classList.add('message_style');

document.addEventListener('keydown', (e) => {
  if (e.code == 'Space' && game_status != 'Play') {
    document.querySelectorAll('.space_items').forEach((e) => {
      e.remove();
    });
    img.style.display = 'block';
    alien.style.top = '40vh';
    game_status = 'Play';
    message.innerHTML = '';
    score_title.innerHTML = 'Score : ';
    score_value.innerHTML = '0';
    highscore_title.innerHTML = 'High Score : ';
    highscore_value.innerHTML = localStorage.getItem('highScore') || '0';
    message.classList.remove('message_style');
    play();
  }
});

function addHighScore(score) {
  if (score > localStorage.getItem('highScore')) {
    localStorage.setItem('highScore', score);
  }
}

function play() {
  function move() {
    if (game_status != 'Play') return;

    let space_items = document.querySelectorAll('.space_items');
    space_items.forEach((element) => {
      let space_items_features = element.getBoundingClientRect();
      alien_ride = alien.getBoundingClientRect();

      if (space_items_features.right <= 0) {
        element.remove();
      } else {
        if (
          alien_ride.left < space_items_features.right &&
          alien_ride.right > space_items_features.left &&
          alien_ride.top < space_items_features.bottom &&
          alien_ride.bottom > space_items_features.top
        ) {
          game_status = 'End';
          addHighScore(parseInt(score_value.innerHTML));
          message.innerHTML =
            `<span style="color: red">Game Over</span><br>Press <span style="color: lightgreen">Space </span>To Restart`;
          message.classList.add('message_style');
          img.style.display = 'none';
          removeAll();
          sound_fall.play();
          
          return;
        } else {
          if (
            space_items_features.right < alien_ride.left &&
            space_items_features.right + movement >= alien_ride.left &&
            element.increase_score == '1'
          ) {
            score_value.innerHTML = +score_value.innerHTML + 1;
            sound_jump.play();
          }
          element.style.left = space_items_features.left - movement + 'px';
        }
      }
    });

    function removeAll() {
       document.querySelectorAll('.space_items').forEach((e) => {
      e.remove();
    });
    }
    requestAnimationFrame(move);
  }
  requestAnimationFrame(move);

  let alien_y = 0;
  function apply_gravity() {
    if (game_status != 'Play') return;
    alien_y = alien_y + grativy;
    document.addEventListener('keydown', (e) => {
      if (e.key == 'ArrowUp' || e.key == ' ') {
        img.src = 'images/Alien-1.png';
        alien_y = -7.5;
      }
    });

    document.addEventListener('keyup', (e) => {
      if (e.key == 'ArrowUp' || e.key == ' ') {
        img.src = 'images/Alien.png';
      }
    });

    if (alien_ride.top <= 0 || alien_ride.bottom >= background.bottom) {
      message.style.left = '28vw';
      game_status = 'End';
      addHighScore(parseInt(score_value.innerHTML));
      window.location.reload();
      message.classList.remove('message_style');
      return;
    }
   
    alien.style.top = alien_ride.top + alien_y + 'px';
    alien_ride = alien.getBoundingClientRect();
    requestAnimationFrame(apply_gravity);
  }
  requestAnimationFrame(apply_gravity);

  let space_item_seperation = 0;

  let space_item_gap = 35;

  function create_space_item() {
    if (game_status != 'Play') return;

    if (space_item_seperation > 120) {
      space_item_seperation = 0;

      let space_item_posi = Math.floor(Math.random() * 40) + 10;
      let space_items_inv = document.createElement('div');
      space_items_inv.className = 'space_items';
      space_items_inv.style.top = space_item_posi - 70 + 'vh';
      space_items_inv.style.left = '100vw';

      document.body.appendChild(space_items_inv);
      let space_items = document.createElement('div');
      space_items.className = 'space_items';
      space_items.style.top = space_item_posi + space_item_gap + 'vh';
      space_items.style.left = '100vw';
      space_items.increase_score = '1';

      document.body.appendChild(space_items);
    }
    space_item_seperation++;
    requestAnimationFrame(create_space_item);
  }
  requestAnimationFrame(create_space_item);
}
