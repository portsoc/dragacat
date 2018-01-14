'use strict';

/* exported makeCat, cats */

const cats = [
  { name: 'Claude', pic: 'i/1.png' },
  { name: 'Colin', pic: 'i/2.png' },
  { name: 'Fluffy', pic: 'i/3.png' },
  { name: 'Ghengis', pic: 'i/4.png' },
  { name: 'Madge', pic: 'i/5.png' },
  { name: 'Penny', pic: 'i/6.png' },
  { name: 'Roger', pic: 'i/7.png' },
  { name: 'Top', pic: 'i/8.png' },
];

// give every cat an index that reflects its position in the array
cats.forEach((c, idx) => c.index = idx);


/**
 * Makes a kitten element.
 * @param {object} cat contains details on the cat to be added
 * @param {function} dragStartHandler what to call when dragging starts
 * @return {Element}
 */
function makeCat(cat, dragStartHandler) {
  const kitty = document.createElement('figure');
  const pic = document.createElement('img');
  const nom = document.createElement('figcaption');

  cat.id = `cat${cat.index}`;
  kitty.id = cat.id;
  kitty.className = 'cat';
  kitty.draggable = true;
  kitty.dataset.cat = JSON.stringify(cat);
  kitty.addEventListener('dragstart', dragStartHandler);

  nom.textContent = cat.name;

  pic.src = cat.pic;
  pic.alt = 'A cat';
  pic.draggable = false; // images are by default draggable, but we want to drag the whole kitty figure

  kitty.appendChild(pic);
  kitty.appendChild(nom);
  return kitty;
}

