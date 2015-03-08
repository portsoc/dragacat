(function () {
    "use strict";
    var box,
        vet = document.getElementById("vet"),
        clowder = document.getElementById("clowder"),
        kittens  = [
            { id: "kittenone", name: "Top", pic: "http://placekitten.com/g/125/120" },
            { id: "kittentwo", name: "Claude", pic: "http://placekitten.com/g/120/121" },
            { id: "kittenthree", name: "Ghengis", pic: "http://placekitten.com/g/120/122" },
            { id: "kittenfour", name: "Fluffy", pic: "http://placekitten.com/g/120/133" },
            { id: "kittenfive", name: "Colin", pic: "http://placekitten.com/g/120/124" },
            { id: "pen", name: "Penny", pic: "http://placekitten.com/g/130/135" },
            { id: "rodge", name: "Roger", pic: "http://placekitten.com/g/135/130" },
            { id: "madge", name: "Madge", pic: "http://placekitten.com/g/145/125" }
        ],

        treated = [],

        catDragStarted = function (e) {
            var sendThisWithTheDrag = e.target.dataset.cat;
            e.dataTransfer.setData("application/json", sendThisWithTheDrag);
            e.dataTransfer.setDragImage(box, 100, 40);
            event.dataTransfer.effectAllowed = "move";
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
                    document.getElementById("log").innerHTML = "Treatment history: " + treated.join(", ");
                }
            }
        },

        dragHandler = function (e) {
            e.preventDefault();
        },

        addKitten = function (cat) {
            var kitty = document.createElement("div"),
                pic = document.createElement("img"),
                nom = document.createElement("p");

            kitty.setAttribute("id", cat.id);
            kitty.setAttribute("draggable", true);
            kitty.setAttribute("class", "cat");
            kitty.addEventListener("dragstart", catDragStarted);
            clowder.appendChild(kitty);

            nom.innerText = cat.name;
            kitty.appendChild(nom);

            pic.setAttribute("src", cat.pic);
            pic.setAttribute("alt", "a kitten, just because");
            pic.setAttribute("draggable", false);
            kitty.appendChild(pic);

            kitty.setAttribute("data-cat", JSON.stringify(cat));
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
