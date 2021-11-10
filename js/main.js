
window.addEventListener('DOMContentLoaded', event => {
  loadAllCharacters();
});

function generateIcon(character) {
  const $iconWrapper = document.createElement('div');
  $iconWrapper.classList.add('icon-wrapper');

  const $icon = document.createElement('div');
  $icon.classList.add('icon');
  $icon.style.background = `no-repeat url("images/rarity/${character.rarity}.webp")`;
  $icon.style.backgroundSize = '100% 100%';
  const $img = document.createElement('img');
  $img.src = character.iconURL;
  $img.style.width = '100%';

  const $charName = document.createElement('p');
  $charName.classList.add('character-name');
  $charName.textContent = character.name;

  $icon.appendChild($img);
  $icon.appendChild($charName);
  $iconWrapper.appendChild($icon);
  return $iconWrapper;

  // icon template
  /*
  <div class="icon-wrapper">
    <div class="icon">
      <img src="https://res.cloudinary.com/dnoibyqq2/image/upload/v1622044760/genshin-app/characters/albedo/icon.png" alt="">
      <p class="character-name">Albedo</p>
    </div>
  </div>
  */
}

function loadAllCharacters() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://genshin-app-api.herokuapp.com/api/characters?infoDataSize=all');
  xhr.responseType = 'json';
  xhr.send();
  xhr.addEventListener('load', function () {
    const characters = this.response.payload.characters;
    const $icons = document.querySelector('#icons');
    for (let character of characters) {
      const $iconWrapper = generateIcon(character);
      $icons.appendChild($iconWrapper);
    }

  });
}
