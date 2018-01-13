'use strict';

const treatmentHistoryLength = 10;
const vetMaximumStay = 5000;

const cats = [
    { name: 'Top', pic: 'i/1.png' },
    { name: 'Claude', pic: 'i/2.png' },
    { name: 'Ghengis', pic: 'i/3.png' },
    { name: 'Fluffy', pic: 'i/4.png' },
    { name: 'Colin', pic: 'i/5.png' },
    { name: 'Penny', pic: 'i/6.png' },
    { name: 'Roger', pic: 'i/7.png' },
    { name: 'Madge', pic: 'i/8.png' },
];

let catCount = 0;
let box = null;
let dragParent = null;

/**
 * @param {Event} e is a drag event
 */
function catDragStarted(e) {
    let sendThisWithTheDrag = e.target.dataset.cat;
    e.dataTransfer.setData('application/json', sendThisWithTheDrag);
    e.dataTransfer.setDragImage(box, 100, 40);
    e.dataTransfer.effectAllowed = 'move';
    dragParent = e.target.parentElement;
}

/**
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
    window.log.textContent = `The last ${treatmentHistoryLength} cats to be treated were: ${ treated.slice(-treatmentHistoryLength).join(', ')}`;
}

/**
 * @param {Event} e is a drag event fired when a cat is droppped on a UI element
 */
function catDropped(e) {
    let received = e.dataTransfer.getData('application/json');
    if (received) {
      e.preventDefault();
      let cat = JSON.parse(received);
      let elem = document.getElementById(cat.id);
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
 * Add a kitten to the DOM
 * @param {object} cat contains details on the cat to be added
 */
function addCat(cat) {
    const kitty = document.createElement('figure');
    const pic = document.createElement('img');
    const nom = document.createElement('figcaption');

    cat.id = `cat${++catCount}`;
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
 * the vet has been longer vetMaximumStay milliseconds.
 */
function checkOut() {
  const catsAtTheVet = window.vet.querySelectorAll('.cat');
  const now = Date.now();
  for (let cat of catsAtTheVet) {
    if (now - cat.dataset.checkInTime > vetMaximumStay) {
      window.clowder.appendChild(cat);
      cat.dataset.checkInTime = 0;
    }
  }
}

/**
 * Start up the app.
 */
function boot() {
    // inject kitten data into document as HTML
    cats.forEach(addCat);

    // prepare box image for use when dragging cats
    box = document.createElement('img');
    box.src = 'i/carrier.png';
    box.width = 10;

    window.vet.addEventListener('drop', catDropped);
    window.vet.addEventListener('dragover', dragHandler);
    window.clowder.addEventListener('drop', catDropped);
    window.clowder.addEventListener('dragover', dragHandler);
    window.playground.addEventListener('drop', catDropped);
    window.playground.addEventListener('dragover', dragHandler);

    window.setInterval(checkOut, 1000);
}

window.addEventListener('load', boot);
