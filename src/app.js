'use strict';

const treatmentHistoryLength = 10;
const vetMaximumStay = 5000;

const cats = [
    { id: 'k1', name: 'Top', pic: 'i/1.png' },
    { id: 'k2', name: 'Claude', pic: 'i/2.png' },
    { id: 'k3', name: 'Ghengis', pic: 'i/3.png' },
    { id: 'k4', name: 'Fluffy', pic: 'i/4.png' },
    { id: 'k5', name: 'Colin', pic: 'i/5.png' },
    { id: 'k6', name: 'Penny', pic: 'i/6.png' },
    { id: 'k7', name: 'Roger', pic: 'i/7.png' },
    { id: 'k8', name: 'Madge', pic: 'i/8.png' },
];

let box = null;


/**
 * @param {Event} e is a drag event
 */
function catDragStarted(e) {
    let sendThisWithTheDrag = e.target.dataset.cat;
    e.dataTransfer.setData('application/json', sendThisWithTheDrag);
    e.dataTransfer.setDragImage(box, 100, 40);
    e.dataTransfer.effectAllowed = 'move';
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
    window.log.innerHTML = `The last ${treatmentHistoryLength} cats to be treated were: ${ treated.slice(-treatmentHistoryLength).join(', ')}`;
}

/**
 * @param {Event} e is a drag event fired when a cat is droppped on a UI element
 */
function catDropped(e) {
    e.preventDefault();
    let received = e.dataTransfer.getData('application/json');
    if (received) {
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
    e.preventDefault();
}


/**
 * Add a kitten to the DOM
 * @param {object} cat contains details on the cat to be added
 */
function addCat(cat) {
    const kitty = document.createElement('figure');
    const pic = document.createElement('img');
    const nom = document.createElement('figcaption');

    kitty.appendChild(pic);
    kitty.appendChild(nom);
    kitty.setAttribute('id', cat.id);
    kitty.setAttribute('draggable', true);
    kitty.setAttribute('class', 'cat');
    kitty.setAttribute('data-cat', JSON.stringify(cat));
    kitty.addEventListener('dragstart', catDragStarted);

    nom.innerText = cat.name;

    pic.setAttribute('src', cat.pic);
    pic.setAttribute('alt', 'a kitten, just because');
    pic.setAttribute('draggable', false);

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
