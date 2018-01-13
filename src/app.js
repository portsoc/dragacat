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

// give every cat an index that reflects its position in the array
cats.forEach((c, idx) => c.index = idx);


/**
 * Makes a kitten element.
 * @param {object} cat contains details on the cat to be added
 * @return {Element}
 */
function makeCat(cat) {
  const kitty = document.createElement('figure');
  const pic = document.createElement('img');
  const nom = document.createElement('figcaption');

  cat.id = `cat${cat.index}`;
  kitty.id = cat.id;
  kitty.className = 'cat';
  kitty.draggable = true;
  kitty.dataset.cat = JSON.stringify(cat);
  kitty.addEventListener('dragstart', catDragStarted);

  nom.textContent = cat.name;

  pic.src = cat.pic;
  pic.alt = 'A cat';
  pic.draggable = false; // images are by default draggable, but we want to drag the whole kitty figure

  kitty.appendChild(pic);
  kitty.appendChild(nom);
  return kitty;
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
 * @param  {object} cat is an object describing a cat entering the vet (if any)
 */
function updateTreatmentHistory(cat) {
  let treated = [];
  if (localStorage.treated) {
    treated = JSON.parse(localStorage.treated);
  }
  if (cat) {
    // keep only treatmentHistoryLength entries in the history
    treated.splice(0, treated.length - treatmentHistoryLength + 1);
    treated.push(cat.name);
  }
  localStorage.treated = JSON.stringify(treated);
  if (treated.length) {
    window.log.textContent = `The last ${treatmentHistoryLength} cats to be treated were: ${ treated.join(', ')}`;
  }
}


// variables for dragging
let catCarrierBox = null;
let dragParent = null;

/**
 * Starts a drag.
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
  e.dataTransfer.setDragImage(catCarrierBox, 100, 10);
  e.dataTransfer.effectAllowed = 'move';
  dragParent = e.target.parentElement;
  e.target.classList.add('dragging');
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
    e.currentTarget.appendChild(elem);

    if (e.currentTarget === window.vet) {
      elem.dataset.checkInTime = Date.now();
      updateTreatmentHistory(cat);
    }
  }
}

/**
 * Allows the drag if a cat is over a different container than where it started.
 * @param  {Event} e
 */
function dragHandler(e) {
  if (dragParent != e.currentTarget) {
    e.preventDefault();
    clearDragTargets();
    e.currentTarget.classList.add('currenttarget');
  }
}


/**
 * Removes the highlight of the target container.
 */
function clearDragTargets() {
  for (const el of document.querySelectorAll('.currenttarget')) {
    el.classList.remove('currenttarget');
  }
}

/**
 * Ends the drag.
 * @param  {Event} e
 */
function dragEnded(e) {
  clearDragTargets();
  for (const el of document.querySelectorAll('.dragging')) {
    el.classList.remove('dragging');
  }
}


/**
 * Start up the app.
 */
function boot() {
  // inject kitten data into document as HTML
  cats.forEach((cat) => {
      const catEl = makeCat(cat);
      window.clowder.appendChild(catEl);
  });

  // show which cats have been treated
  updateTreatmentHistory();

  // prepare box image for use when dragging cats
  catCarrierBox = document.createElement('img');
  catCarrierBox.src = 'i/carrier.png';

  window.vet.addEventListener('drop', catDropped);
  window.clowder.addEventListener('drop', catDropped);
  window.vet.addEventListener('dragover', dragHandler);
  window.clowder.addEventListener('dragover', dragHandler);
  window.vet.addEventListener('dragleave', clearDragTargets);
  window.clowder.addEventListener('dragleave', clearDragTargets);
  window.vet.addEventListener('dragend', dragEnded);
  window.clowder.addEventListener('dragend', dragEnded);

  window.setInterval(checkOut, 1000);
}

window.addEventListener('load', boot);
