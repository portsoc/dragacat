'use strict';

/* global makeCat, cats, listCatsInPlayground, addCatToPlayground */


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
  if (localStorage.useCatCarrier) e.dataTransfer.setDragImage(catCarrierBox, 100, 10);
  e.dataTransfer.effectAllowed = 'move';
  dragParent = e.target.parentElement;
  e.target.classList.add('dragging');
}


/**
 * Ends the drag, the target of the event is the cat.
 * @param  {Event} e
 */
function catDragEnded(e) {
  if (e.target.parentElement === dragParent && e.dataTransfer.dropEffect != 'none') {
    // cat was dropped outside of our window, remove it here
    e.target.remove();
  } else {
    e.target.classList.remove('dragging');
  }
  dragParent = null;
}


/**
 * Drops a cat on a container (a pen), the currentTarget of the event is the container.
 * @param {Event} e is a drag event fired when a cat is droppped on a UI element
 */
function catDropped(e) {
  const received = e.dataTransfer.getData('application/json');
  if (received) {
    e.preventDefault();
    const cat = JSON.parse(received);
    addCatToPlayground(cat.index, listPens().indexOf(e.currentTarget));
    const elem = document.getElementById(cat.id) || makeCat(cat, catDragStarted);
    e.currentTarget.appendChild(elem);
  }

  e.currentTarget.classList.remove('currenttarget');
}


/**
 * Allows the drag if a cat is over a different container than where it started.
 * Drag is allowed only if the pen doesn't already have a cat.
 * Also highlights the container visually.
 * @param  {Event} e
 */
function dragHandler(e) {
  if (dragParent != e.currentTarget && !e.currentTarget.querySelector('.cat')) {
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
 * @return {Array}
 */
function listPens() {
  return [].slice.call(document.querySelectorAll('.playground > .pen'));
}


/**
 * Start up the app.
 */
function boot() {
  // inject kitten data into document as HTML
  const catsInPlayground = listCatsInPlayground();
  listPens().forEach((pen, penIndex) => {
    const cat = cats[catsInPlayground[penIndex]];
    if (cat) {
      const catEl = makeCat(cat, catDragStarted);
      pen.appendChild(catEl);
    }
  });

  // prepare box image for use when dragging cats
  catCarrierBox = document.createElement('img');
  catCarrierBox.src = 'i/carrier.png';

  for (const el of listPens()) {
    el.addEventListener('drop', catDropped);
    el.addEventListener('dragover', dragHandler);
    el.addEventListener('dragleave', dragLeave);
    el.addEventListener('dragend', catDragEnded);
  }
}

window.addEventListener('load', boot);
