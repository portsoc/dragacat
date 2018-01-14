'use strict';

/* global makeCat, cats */

const treatmentHistoryLength = 10;
const vetMaximumStay = 5000;

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
 * Starts a drag, the target of the event is the cat.
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
 * Ends the drag, the target of the event is the cat.
 * @param  {Event} e
 */
function catDragEnded(e) {
  e.target.classList.remove('dragging');
  dragParent = null;
}


/**
 * Drops a cat on a container (clowder or vet), the currentTarget of the event is the container.
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

  e.currentTarget.classList.remove('currenttarget');
}


/**
 * Allows the drag if a cat is over a different container than where it started.
 * Also highlights the container visually.
 * @param  {Event} e
 */
function dragHandler(e) {
  if (dragParent != e.currentTarget) {
    e.preventDefault();
    e.currentTarget.classList.add('currenttarget');
    e.dataTransfer.dropEffect = 'move';
  }
}


/**
 * Removes the highlight of the target container.
 * @param  {Event} e
 */
function dragLeave(e) {
  e.currentTarget.classList.remove('currenttarget');
}


/**
 * Start up the app.
 */
function boot() {
  // inject kitten data into document as HTML
  cats.forEach((cat) => {
    const catEl = makeCat(cat, catDragStarted);
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
  window.vet.addEventListener('dragleave', dragLeave);
  window.clowder.addEventListener('dragleave', dragLeave);
  window.vet.addEventListener('dragend', catDragEnded);
  window.clowder.addEventListener('dragend', catDragEnded);

  window.setInterval(checkOut, 1000);
}

window.addEventListener('load', boot);
