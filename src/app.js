(function () {
    "use strict";
    var box,
        vet = document.getElementById("vet"),
        clowder = document.getElementById("clowder"),
        kittens  = [
            { name: "Top", pic: "http://placekitten.com/g/125/120" },
            { name: "Claude", pic: "http://placekitten.com/g/120/121" },
            { name: "Ghengis", pic: "http://placekitten.com/g/120/122" },
            { name: "Fluffy", pic: "http://placekitten.com/g/120/133" },
            { name: "Colin", pic: "http://placekitten.com/g/120/124" },
            { name: "Penny", pic: "http://placekitten.com/g/130/135" },
            { name: "Roger", pic: "http://placekitten.com/g/135/130" },
            { name: "Madge", pic: "http://placekitten.com/g/145/125" }
        ],

        treated = [],

        catDragStarted = function (e) {
            var sendThisWithTheDrag = e.target.dataset.cat;
            e.dataTransfer.setData("application/json", sendThisWithTheDrag);
            e.dataTransfer.setDragImage(box, 100, 40);
            e.dataTransfer.effectAllowed = "move";
        },

        catDropped = function (e) {
            e.preventDefault();
            var cat,
                received = e.dataTransfer.getData("application/json");
            if (received) {
                cat = JSON.parse(received);
                e.currentTarget.appendChild(document.getElementById(cat.id));

                if (e.currentTarget === vet) {
                    treated.push(cat.name);
                    document.getElementById("log").textContent = "Treatment history: " + treated.join(", ");
                }
            }
        },

        dragHandler = function (e) {
            e.preventDefault();
        },

        kittenCount = 0,

        addKitten = function (cat) {
            var kitty = document.createElement("div"),
                pic = document.createElement("img"),
                nom = document.createElement("p");

            kitty.id = cat.id = 'cat' + (kittenCount += 1);
            kitty.draggable = true;
            kitty.className = "cat";
            kitty.addEventListener("dragstart", catDragStarted);
            clowder.appendChild(kitty);

            nom.textContent = cat.name;
            kitty.appendChild(nom);

            pic.src = cat.pic;
            pic.alt = "a kitten, just because";
            pic.draggable = false;
            kitty.appendChild(pic);

            kitty.dataset.cat = JSON.stringify(cat);
        };

    box = document.createElement('img');
    box.src = 'carrier.png';
    box.width = 10;

    vet.addEventListener("drop", catDropped);
    vet.addEventListener("dragover", dragHandler);
    clowder.addEventListener("drop", catDropped);
    clowder.addEventListener("dragover", dragHandler);

    kittens.forEach(addKitten);
}());
