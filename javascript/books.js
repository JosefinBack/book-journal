
let supabaseClient = window.supabase.createClient(
    "https://qciftuisfloydqxgrdrt.supabase.co",
    "sb_publishable_m1PZazpxmQepEPbktVMzZA_YusPeIWL"
);

// let currentUser = null;

let main = document.querySelector("main");
let bookshelfContent = document.getElementById("bookshelfContent");

let latestBookRead = document.getElementById("latestBook");

let buttonSideMenu = document.querySelectorAll(".menuButtonStyle");

for (let button of buttonSideMenu) {
    button.addEventListener("click", function () {
        for (let button of buttonSideMenu) {
            button.classList.remove("activeButton");
        }
        button.classList.add("activeButton");
    });
}


function makeBookCard(book) {
    let bookCard = document.createElement("div");

    let bookIMG = document.createElement("img");
    bookIMG.style.height = "160px";
    bookIMG.style.width = "130px";
    bookIMG.style.backgroundColor = "pink";

    let bookTitle = document.createElement("p");
    bookTitle.textContent = "Bokens titel";

    let ratingStars = document.createElement("div");
    ratingStars.style.display = "flex";

    for (let i = 1; i < 6; i++) {
        let star = document.createElement("p");
        star.innerHTML = "★";

        ratingStars.append(star);
    }

    bookCard.appendChild(bookIMG);
    bookCard.appendChild(bookTitle);
    bookCard.appendChild(ratingStars);

    book.appendChild(bookCard);
}

let books = document.querySelectorAll(".book");

for (let book of books) {
    makeBookCard(book);
}




async function latestBook() {
    const { data: userData } = await supabaseClient.auth.getUser();

    // if (!userData.user) {
    //     console.log("No user logged in");
    //     return null;
    // }
    let userId = userData.user.id;

    let { data: books, error } = await supabaseClient
        .from("books")
        .select("*")
        .eq("user_id", userId);

    if (error) {
        console.error(error);
        return null;
    }

    let finished = books.filter(function (book) {
        return book.finish;
    });

    finished.sort(function (a, b) {
        return new Date(b.finish) - new Date(a.finish);
    });

    let latestBook = finished[0];
    console.log(latestBook);

    //Skapa en div med info om boken som ska synas i topDIV

    let divBook = document.createElement("div");
    divBook.classList.add("divBook")
    let pTitle = document.createElement("h4");
    pTitle.textContent = latestBook.title;
    pTitle.style.fontSize = "20px";
    pTitle.style.margin = "0px";

    let pInfo = null;

    if (latestBook.seriesname) {
        pInfo = document.createElement("p");
        pInfo.style.margin = "0px";
        pInfo.textContent = `${latestBook.seriesname} (${latestBook.seriesnumber})`;
    }

    let pImg = document.createElement("img");
    pImg.src = latestBook.imgsrc;
    pImg.style.height = "150px";
    pImg.style.width = "100px";

    let pRating = document.createElement("p");
    pRating.style.margin = "0px";
    pRating.style.fontSize = "18px";
    pRating.style.fontWeight = "bold";
    let text = document.createElement("span");
    text.textContent = `${latestBook.ratings.book}/10 `;

    let star = document.createElement("span");
    star.textContent = "★";
    star.style.color = "gold";
    pRating.append(text, star);

    latestBookRead.innerHTML = "";
    divBook.innerHTML = "";
    divBook.append(pImg);
    divBook.append(pTitle);

    if (pInfo) {
        divBook.append(pInfo);
    }

    divBook.append(pRating);
    latestBookRead.append(divBook);

};
// latestBook();