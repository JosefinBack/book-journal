
let main = document.querySelector("main");
let bookshelfContent = document.getElementById("bookshelfContent");

let buttonSideMenu = document.querySelectorAll(".menuButtonStyle");

for (let button of buttonSideMenu) {

    button.addEventListener("click", function () {

        for (let button of buttonSideMenu) {
            button.classList.remove("activeButton");
        }
        button.classList.add("activeButton");
    });
}
