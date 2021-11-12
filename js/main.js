const $navs = document.querySelector('#navs');
$navs.addEventListener('click', function (event) {
  event.preventDefault();
  if (event.target.matches('.nav')) {
    data.entry = null;
    setView(event.target.getAttribute('data-view'));
  }

});

const $explore = document.querySelector('#explore');
$explore.addEventListener('click', function () {
  event.preventDefault();
  setView('characters');
});

// associates views with their respective loader functions
const viewLoader = {
  characters: loadAllCharacters,
  character: loadCharacter,
  enemies: loadAllEnemies,
  enemy: loadEnemy,
  weapons: loadAllWeapons,
  weapon: loadWeapon
};

const singularToPlural = {
  character: 'characters',
  enemy: 'enemies',
  weapon: 'weapons'
};

window.addEventListener('DOMContentLoaded', event => {
  viewLoader.characters();
  viewLoader.enemies();
  viewLoader.weapons();
  setView(data.view, data.entry);
});

function generateIcon(entry) {
  const $iconWrapper = document.createElement('div');
  $iconWrapper.classList.add('icon-wrapper');

  const $icon = document.createElement('div');
  $icon.classList.add('icon');
  $icon.style.background = `no-repeat url("../images/rarity/${entry.rarity ? entry.rarity : 1}.webp")`;
  $icon.style.backgroundSize = '100% 100%';
  const $img = document.createElement('img');
  $img.src = entry.iconURL ? entry.iconURL : entry.iconUrl;
  $img.style.width = '100%';

  const $entryName = document.createElement('p');
  $entryName.classList.add('entry-name');
  $entryName.textContent = entry.name;

  $icon.setAttribute('data-entry-name', entry.name);
  $icon.appendChild($img);
  $icon.appendChild($entryName);
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
    const $icons = document.querySelector('#character-icons');
    const charactersObj = {};
    for (let character of characters) {
      const $iconWrapper = generateIcon(character);
      charactersObj[character.name] = character;
      $icons.appendChild($iconWrapper);
    }
    $icons.addEventListener('click', function (event) {
      if (!event.target.matches('.icon')) {
        return;
      }
      const curChar = event.target.getAttribute('data-entry-name');
      data.entry = charactersObj[curChar];
      setView('character', charactersObj[curChar]);
    });
  });
}

function loadCharacter(character = null) {
  const $headline = document.querySelector('#character-name');
  $headline.textContent = character.name;

  const $element = document.querySelector('#element');
  $element.src = `../images/elements/${character.element}.webp`;

  if (!character.nation) {
    character.nation = 'Unknown';
  }
  const $characterPortraitBg = document.querySelector('#character-portrait-bg');
  $characterPortraitBg.style.backgroundImage = `url("../images/locations/${character.nation}.jpg")`;

  const $characterPortrait = document.querySelector('#character-portrait');
  $characterPortrait.src = character.portraitImageURL;

  const $rarity = document.querySelector('#character-rarity');
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
  $weapon.setAttribute('id', 'weapon');

  const $weaponImg = document.createElement('img');
  $weaponImg.setAttribute('id', 'weapon-img');

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
  $skillsHeadline.innerHTML = '<u>Skills</u>';
  $skills.appendChild($skillsHeadline);

  const iconPrefix = `https://res.cloudinary.com/dnoibyqq2/image/upload/v1617900084/genshin-app/characters/${character.name.toLowerCase()}/`;
  for (let i = 0; i < character.combatSkills.length; i++) {
    const $skill = document.createElement('div');
    $skill.classList.add('skill');

    const $skillImg = document.createElement('img');
    $skillImg.classList.add('skill-img');
    $skillImg.src = iconPrefix + character.combatSkills[i].iconUrl;
    $skill.appendChild($skillImg);

    const $skillDescription = document.createElement('p');
    if (!character.combatSkills[i].variants[0].description) {
      $skillDescription.textContent = character.combatSkills[i].variants[1].description;
    } else {
      $skillDescription.textContent = character.combatSkills[i].variants[0].description;
    }
    $skill.appendChild($skillDescription);

    const $skillGIF = document.createElement('img');
    $skillGIF.classList.add('skill-gif');
    if (!character.combatSkills[i].variants[0].gifUrl) {
      $skillGIF.src = character.combatSkills[i].variants[1].gifUrl;
    } else {
      $skillGIF.src = character.combatSkills[i].variants[0].gifUrl;
    }
    $skill.appendChild($skillGIF);
    $skills.appendChild($skill);
  }
}

function loadAllEnemies() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.genshin.dev/enemies/');
  xhr.responseType = 'json';
  xhr.send();
  xhr.addEventListener('load', function () {
    const enemies = this.response;
    const $icons = document.querySelector('#enemy-icons');
    const enemiesObj = {};
    for (let i = 0; i < enemies.length; i++) {
      let enemy = enemies[i];
      let xhr2 = new XMLHttpRequest();
      xhr2.open('GET', 'https://api.genshin.dev/enemies/' + enemy);
      xhr2.responseType = 'json';
      xhr2.send();
      xhr2.addEventListener('load', function () {
        enemy = this.response;
        enemy.iconUrl = `https://api.genshin.dev/enemies/${enemy.id}/icon`;
        if (!enemy.name) {
          enemy.name = enemy.id[0].toUpperCase() + enemy.id.slice(1);
        }
        const $iconWrapper = generateIcon(enemy);
        enemiesObj[enemy.name] = enemy;
        $icons.appendChild($iconWrapper);
      });
    }
    $icons.addEventListener('click', function (event) {
      if (!event.target.matches('.icon')) {
        return;
      }
      const curEnemy = event.target.getAttribute('data-entry-name');
      data.entry = enemiesObj[curEnemy];
      setView('enemy', enemiesObj[curEnemy]);
    });
  });
}

function loadEnemy(enemy = null) {
  const $headline = document.querySelector('#enemy-name');
  $headline.textContent = enemy.name;

  const $enemyPortraitBg = document.querySelector('#enemy-portrait-bg');
  $enemyPortraitBg.style.backgroundImage = 'url("../images/locations/enemies.jpg")';

  const $enemyPortrait = document.querySelector('#enemy-portrait');
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `https://api.genshin.dev/enemies/${enemy.id}/portrait`);
  xhr.responseType = 'blob';
  xhr.send();
  xhr.addEventListener('load', function () {
    if (this.response.type === 'image/webp') {
      $enemyPortrait.src = `https://api.genshin.dev/enemies/${enemy.id}/portrait`;
    } else {
      $enemyPortrait.src = `https://api.genshin.dev/enemies/${enemy.id}/icon`;
    }
  });

  const $enemyDescription = document.querySelector('#enemy-description');
  if (enemy.description) {
    $enemyDescription.textContent = enemy.description;
  } else if (enemy['elemental-descriptions']) {
    $enemyDescription.textContent = enemy['elemental-descriptions'][0].description;
  } else {
    $enemyDescription.textContent = enemy.descriptions[0].description;
  }

  let global = ['Mondstadt', 'Liyue', 'Inazuma', 'Dragonspine'];
  if (enemy.region === 'Monstadt') {
    enemy.region = 'Mondstadt';
  }
  const $regionBG = document.querySelectorAll('.region-bg');
  if (enemy.region === 'Global' || enemy.region === 'Multiple' || !global.includes(enemy.region)) {
    for (let region of $regionBG) {
      region.classList.remove('hidden');
    }
  } else {
    for (let region of $regionBG) {
      if (region.getAttribute('data-spawn') === enemy.region) {
        region.classList.remove('hidden');
        break;
      }
    }
  }

}

function loadAllWeapons() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://genshin-app-api.herokuapp.com/api/weapons?infoDataSize=all');
  xhr.responseType = 'json';
  xhr.send();
  xhr.addEventListener('load', function () {
    const weapons = this.response.payload.weapons;
    const $icons = document.querySelector('#weapon-icons');
    const weaponsObj = {};
    for (let weapon of weapons) {
      if (!weapon.isReleased) {
        continue;
      }
      if (weapon.name === 'Freedom Sworn') {
        continue;
      }
      weapon.iconUrl = `https://paimon.moe/images/weapons/${weapon.name.toLowerCase().split("'").join('').split(' ').join('_')}.png`;
      const $iconWrapper = generateIcon(weapon);
      weaponsObj[weapon.name] = weapon;
      $icons.appendChild($iconWrapper);
    }
    $icons.addEventListener('click', function (event) {
      if (!event.target.matches('.icon')) {
        return;
      }
      const curWeap = event.target.getAttribute('data-entry-name');
      data.entry = weaponsObj[curWeap];
      setView('weapon', weaponsObj[curWeap]);
    });
  });
}

function loadWeapon(weapon = null) {
  const $headline = document.querySelector('#weapon-name');
  $headline.textContent = weapon.name;

  const $weaponPortraitBg = document.querySelector('#weapon-portrait-bg');
  $weaponPortraitBg.style.backgroundImage = 'url("../images/locations/weapons.jpg")';

  const $weaponPortrait = document.querySelector('#weapon-portrait');
  $weaponPortrait.src = weapon.iconUrl;

  const $rarity = document.querySelector('#weapon-rarity');
  for (let i = 0; i < weapon.rarity; i++) {
    const $star = document.createElement('i');
    $star.classList.add('fas');
    $star.classList.add('fa-star');
    $rarity.appendChild($star);
  }

  const $weaponDescription = document.querySelector('#weapon-description');
  $weaponDescription.textContent = weapon.description;

  const $additionalInfos = document.querySelector('#weapon-additional-infos');

  let $additionalInfo = document.createElement('div');
  $additionalInfo.classList.add('additional-info');

  const $weaponType = document.createElement('p');
  $weaponType.setAttribute('id', 'weapon-type');

  const $weaponTypeImg = document.createElement('img');
  $weaponTypeImg.setAttribute('id', 'weapon-type-img');

  $weaponTypeImg.src = `../images/weapons/${weapon.weaponType}.png`;
  $weaponType.innerHTML += '<strong>Weapon Type: </strong>' + weapon.weaponType;
  $additionalInfo.appendChild($weaponType);
  $additionalInfo.appendChild($weaponTypeImg);
  $additionalInfos.appendChild($additionalInfo);

  $additionalInfo = document.createElement('div');
  $additionalInfo.classList.add('additional-info');
  const $source = document.createElement('p');
  $source.setAttribute('id', 'source');

  const $sourceImgAcquiant = document.createElement('img');
  $sourceImgAcquiant.setAttribute('id', 'source-acquaint-img');

  const $sourceImgIntertwined = document.createElement('img');
  $sourceImgIntertwined.setAttribute('id', 'source-intertwined-img');

  $sourceImgAcquiant.src = '../images/fates/acquaint.webp';
  $sourceImgIntertwined.src = '../images/fates/intertwined.webp';
  switch (weapon.rarity) {
    case 3:
      $source.innerHTML += '<strong>Source: </strong>' + 'Standard and Limited';
      $additionalInfo.appendChild($source);
      $additionalInfo.appendChild($sourceImgAcquiant);
      $additionalInfo.appendChild($sourceImgIntertwined);
      break;
    case 4:
      $source.innerHTML += '<strong>Source: </strong>' + 'Standard and Limited';
      $additionalInfo.appendChild($source);
      $additionalInfo.appendChild($sourceImgAcquiant);
      $additionalInfo.appendChild($sourceImgIntertwined);
      break;
    case 5:
      $source.innerHTML += '<strong>Source: </strong>' + 'Limited';
      $additionalInfo.appendChild($source);
      $additionalInfo.appendChild($sourceImgIntertwined);
  }
  $additionalInfos.appendChild($additionalInfo);

  const xhr = new XMLHttpRequest();
  xhr.open('GET', `https://genshin-app-api.herokuapp.com/api/weapons/info/${weapon.name === 'Freedom-Sworn' ? 'Freedom Sworn' : weapon.name}?infoDataSize=all`);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    const weapon = this.response.payload.weapon;

    const $ascensionMaterials = document.querySelector('#ascension-materials');
    const $ascensionMaterialsHeadline = document.createElement('p');
    $ascensionMaterialsHeadline.innerHTML = '<u>Ascension Materials</u>';
    $ascensionMaterials.appendChild($ascensionMaterialsHeadline);

    // first mat
    const $materials = document.createElement('div');
    $materials.classList.add('materials');

    let $material = document.createElement('div');
    $material.classList.add('material');

    let $materialImg = document.createElement('img');
    $materialImg.classList.add('material-img');
    let i = weapon.ascensionEnemyDrops.length - 2;
    $materialImg.src = weapon.ascensionEnemyDrops[i].iconUrl;

    let $materialName = document.createElement('p');
    $materialName.textContent = weapon.ascensionEnemyDrops[i].name;

    // second mat
    $material.appendChild($materialImg);
    $material.appendChild($materialName);
    $materials.appendChild($material);

    $material = document.createElement('div');
    $material.classList.add('material');

    $materialImg = document.createElement('img');
    $materialImg.classList.add('material-img');
    i = weapon.ascensionEnemyDrops.length - 1;
    $materialImg.src = weapon.ascensionEnemyDrops[i].iconUrl;

    $materialName = document.createElement('p');
    $materialName.textContent = weapon.ascensionEnemyDrops[i].name;

    $material.appendChild($materialImg);
    $material.appendChild($materialName);
    $materials.appendChild($material);

    // third mat
    $material.appendChild($materialImg);
    $material.appendChild($materialName);
    $materials.appendChild($material);

    $material = document.createElement('div');
    $material.classList.add('material');

    $materialImg = document.createElement('img');
    $materialImg.classList.add('material-img');
    i = weapon.ascensionMaterials.length - 1;
    $materialImg.src = weapon.ascensionMaterials[i].iconUrl;

    $materialName = document.createElement('p');
    $materialName.textContent = weapon.ascensionMaterials[i].name;

    $material.appendChild($materialImg);
    $material.appendChild($materialName);
    $materials.appendChild($material);

    $ascensionMaterials.appendChild($materials);
  });

  xhr.send();
}

function setView(newView, entry = null) {
  const $views = document.querySelectorAll('.view');
  for (let view of $views) {
    if (newView === view.getAttribute('data-view')) {
      data.view = newView;
      view.classList.remove('hidden');
    } else {
      view.classList.add('hidden');
    }
  }
  const $header = document.querySelector('header');
  if (newView === 'home') {
    $header.classList.remove('dark-nav');
  } else {
    $header.classList.add('dark-nav');
  }
  const $navs = document.querySelectorAll('.nav');
  for (let nav of $navs) {
    if (newView === nav.getAttribute('data-view') || singularToPlural[newView] === nav.getAttribute('data-view')) {
      nav.classList.add('active');
    } else {
      nav.classList.remove('active');

    }
  }
  cleanUp();
  if (entry) {
    viewLoader[newView](entry);
  }
}

function cleanUp() {
  cleanUpCharacter();
  cleanUpEnemy();
  cleanUpWeapon();
}

function cleanUpCharacter() {
  const $additionalInfos = document.querySelector('#character-additional-infos');
  $additionalInfos.innerHTML = '';

  const $skills = document.querySelector('#skills');
  $skills.innerHTML = '';

  const $rarity = document.querySelector('#character-rarity');
  $rarity.innerHTML = '';
}

function cleanUpEnemy() {
  const $regionBG = document.querySelectorAll('.region-bg');
  for (let region of $regionBG) {
    region.classList.add('hidden');
  }
  const $enemyPortrait = document.querySelector('#enemy-portrait');
  $enemyPortrait.src = '';
}

function cleanUpWeapon() {
  const $additionalInfos = document.querySelector('#weapon-additional-infos');
  $additionalInfos.innerHTML = '';

  const $ascensionMaterials = document.querySelector('#ascension-materials');
  $ascensionMaterials.innerHTML = '';

  const $rarity = document.querySelector('#weapon-rarity');
  $rarity.innerHTML = '';
}
