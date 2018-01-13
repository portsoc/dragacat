'use strict';

const treatmentHistoryLength = 10;
const vetMaximumStay = 5000;

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

/**
 * Adds a kitten to the DOM.
 * @param {object} cat contains details on the cat to be added
 * @param {number} catIdx unique number of the cat
 */
function addCat(cat, catIdx) {
  const kitty = document.createElement('figure');
  const pic = document.createElement('img');
  const nom = document.createElement('figcaption');

  cat.id = `cat${catIdx}`;
  kitty.id = cat.id;
  kitty.className = 'cat';
  kitty.draggable = true;
  kitty.dataset.cat = JSON.stringify(cat);
  kitty.addEventListener('dragstart', catDragStarted);

  nom.textContent = cat.name;

  pic.src = cat.pic;
  pic.alt = 'A cat';
  pic.draggable = false;

  kitty.appendChild(pic);
  kitty.appendChild(nom);
  window.clowder.appendChild(kitty);
}


/**
 * Runs every second and check out cats whose stay at
 * the vet has exceeded vetMaximumStay milliseconds.
 */
function checkOut() {
  const catsAtTheVet = window.vet.querySelectorAll('.cat');
  const now = Date.now();
  for (const cat of catsAtTheVet) {
    if (now - cat.dataset.checkInTime > vetMaximumStay) {
      window.clowder.appendChild(cat);
      cat.dataset.checkInTime = 0;
    }
  }
}


/**
 * Updates treatment history, shows it in the page.
 * @param  {object} cat is an object describing a dragged cat
 */
function updateTreatmentHistory(cat) {
  let treated = [];
  if (localStorage.treated) {
    treated = JSON.parse(localStorage.treated);
  }
  if (cat) {
    treated.push(cat.name);
  }
  localStorage.treated = JSON.stringify(treated);
  if (treated.length) {
    window.log.textContent = `The last ${treatmentHistoryLength} cats to be treated were: ${ treated.slice(-treatmentHistoryLength).join(', ')}`;
  }
}


// variables for dragging
let catCarrierBox = null;
let dragParent = null;

/**
 * @param {Event} e is a drag event
 */
function catDragStarted(e) {
  const sendThisWithTheDrag = e.target.dataset.cat;
  if (!sendThisWithTheDrag) {
    // stop the drag if we're not dragging just the cat
    e.preventDefault();
    return;
  }
  e.dataTransfer.setData('application/json', sendThisWithTheDrag);
  e.dataTransfer.setDragImage(catCarrierBox, 100, 40);
  e.dataTransfer.effectAllowed = 'move';
  dragParent = e.target.parentElement;
}

/**
 * @param {Event} e is a drag event fired when a cat is droppped on a UI element
 */
function catDropped(e) {
  const received = e.dataTransfer.getData('application/json');
  if (received) {
    e.preventDefault();
    const cat = JSON.parse(received);
    const elem = document.getElementById(cat.id);
    elem.dataset.checkInTime = Date.now();
    e.currentTarget.appendChild(elem);

    if (e.currentTarget === window.vet) {
      updateTreatmentHistory(cat);
    }
  }
}

/**
 * @param  {Event} e
 */
function dragHandler(e) {
  if (dragParent != e.currentTarget) {
    e.preventDefault();
  }
}


/**
 * Start up the app.
 */
function boot() {
  // inject kitten data into document as HTML
  cats.forEach(addCat);

  // show which cats have been treated
  updateTreatmentHistory();

  // prepare box image for use when dragging cats
  catCarrierBox = document.createElement('img');
  catCarrierBox.src = 'i/carrier.png';

  window.vet.addEventListener('drop', catDropped);
  window.vet.addEventListener('dragover', dragHandler);
  window.clowder.addEventListener('drop', catDropped);
  window.clowder.addEventListener('dragover', dragHandler);

  window.setInterval(checkOut, 1000);
}

window.addEventListener('load', boot);
