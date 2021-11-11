const $navs = document.querySelector('#navs');
$navs.addEventListener('click', function (event) {
  event.preventDefault();
  if (event.target.matches('.nav')) {
    setView(event.target.getAttribute('data-view'), data);
  }

});

// associates views with their respective loader functions
const viewLoader = {
  characters: loadAllCharacters,
  character: loadCharacter
};

window.addEventListener('DOMContentLoaded', event => {
  viewLoader[data.view]();
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

  $icon.setAttribute('data-character-name', character.name);
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
    const charactersObj = {};
    for (let character of characters) {
      const $iconWrapper = generateIcon(character);
      saveCharacter(character, charactersObj);
      $icons.appendChild($iconWrapper);
    }
    $icons.addEventListener('click', function (event) {
      if (!event.target.matches('.icon')) {
        return;
      }
      const curChar = event.target.getAttribute('data-character-name');
      setView('character', data, charactersObj[curChar]);
    });
  });
}

function saveCharacter(character, charactersObj) {
  charactersObj[character.name] = character;
}

function loadCharacter(character) {
  const $headline = document.querySelector('#character-name');
  $headline.textContent = character.name;

  const $element = document.querySelector('#element');
  $element.src = `../images/elements/${character.element}.webp`;

  if (!character.nation) {
    character.nation = 'Unknown';
  }
  const $characterPortraitBg = document.querySelector('#character-portrait-bg');
  $characterPortraitBg.style.backgroundImage = `url(../images/locations/${character.nation}.jpg)`;

  const $characterPortrait = document.querySelector('#character-portrait');
  $characterPortrait.src = character.portraitImageURL;

  const $rarity = document.querySelector('#rarity');
  for (let i = 0; i < character.rarity; i++) {
    const $star = document.createElement('i');
    $star.classList.add('fas');
    $star.classList.add('fa-star');
    $rarity.appendChild($star);
  }

  const $characterDescription = document.querySelector('#character-description');
  $characterDescription.textContent = character.description;

  const $additionalInfos = document.querySelector('#character-additional-infos');

  let $additionalInfo = document.createElement('div');
  $additionalInfo.classList.add('additional-info');

  const $vision = document.createElement('p');
  $vision.setAttribute('id', 'vision');

  const $visionImg = document.createElement('img');
  $visionImg.setAttribute('id', 'vision-img');

  $visionImg.src = `../images/elements/${character.element}.webp`;
  $vision.innerHTML += '<strong>Vision: </strong>' + character.element;
  $additionalInfo.appendChild($vision);
  $additionalInfo.appendChild($visionImg);
  $additionalInfos.appendChild($additionalInfo);

  $additionalInfo = document.createElement('div');
  $additionalInfo.classList.add('additional-info');
  const $weapon = document.createElement('p');
  $vision.setAttribute('id', 'weapon');

  const $weaponImg = document.createElement('img');
  $visionImg.setAttribute('id', 'weapon-img');

  $weaponImg.src = `../images/weapons/${character.weaponType}.png`;
  $weapon.innerHTML += '<strong>Weapon: </strong>' + character.weaponType;
  $additionalInfo.appendChild($weapon);
  $additionalInfo.appendChild($weaponImg);
  $additionalInfos.appendChild($additionalInfo);

  $additionalInfo = document.createElement('div');
  $additionalInfo.classList.add('additional-info');

  const $nation = document.createElement('p');
  $nation.setAttribute('id', 'nation');

  const $nationImg = document.createElement('img');
  $nationImg.setAttribute('id', 'nation-img');

  $nationImg.src = `../images/nation-symbols/${character.nation}.webp`;
  $nation.innerHTML += '<strong>Nation: </strong>' + character.nation;
  $additionalInfo.appendChild($nation);
  $additionalInfo.appendChild($nationImg);
  $additionalInfos.appendChild($additionalInfo);

  const $skills = document.querySelector('#skills');
  const $skillsHeadline = document.createElement('p');
  $skillsHeadline.innerHTML = '<u>Skills<u>';
  $skills.appendChild($skillsHeadline);

  const iconPrefix = `https://res.cloudinary.com/dnoibyqq2/image/upload/v1617900084/genshin-app/characters/${character.name.toLowerCase()}/`;
  for (let i = 0; i < character.combatSkills.length; i++) {
    const $skill = document.createElement('div');
    $skill.classList.add('skill');

    const $skillImg = document.createElement('img');
    $skillImg.src = iconPrefix + character.combatSkills[i].iconUrl;
    $skillImg.style.width = '3rem';
    $skillImg.style.height = '3rem';
    $skill.appendChild($skillImg);

    const $skillDescription = document.createElement('p');
    if (!character.combatSkills[i].variants[0].description) {
      $skillDescription.textContent = character.combatSkills[i].variants[1].description;
    } else {
      $skillDescription.textContent = character.combatSkills[i].variants[0].description;
    }
    $skill.appendChild($skillDescription);

    const $skillGIF = document.createElement('img');
    if (!character.combatSkills[i].variants[0].gifUrl) {
      $skillGIF.src = character.combatSkills[i].variants[1].gifUrl;
    } else {
      $skillGIF.src = character.combatSkills[i].variants[0].gifUrl;
    }
    $skillGIF.style.width = 'calc(100% / 3)';
    $skillGIF.style.borderRadius = '0.5rem';
    $skillGIF.style.border = '1px solid rgba(255,255,255,0.3)';
    $skill.appendChild($skillGIF);

    $skills.appendChild($skill);
  }
}

function setView(newView, data, entry = null) {
  const $views = document.querySelectorAll('.view');
  for (let view of $views) {
    if (newView === view.getAttribute('data-view')) {
      data.view = newView;
      view.classList.remove('hidden');
    } else {
      view.classList.add('hidden');
    }
  }
  cleanUp();
  if (entry) {
    viewLoader[newView](entry);
  }
}

function cleanUp() {
  cleanUpCharacter();
}
function cleanUpCharacter() {
  const $additionalInfos = document.querySelector('#character-additional-infos');
  $additionalInfos.innerHTML = '';

  const $skills = document.querySelector('#skills');
  $skills.innerHTML = '';

  const $rarity = document.querySelector('#rarity');
  $rarity.innerHTML = '';
}
