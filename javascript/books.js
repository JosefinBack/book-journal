
let supabaseClient = window.supabase.createClient(
    "https://qciftuisfloydqxgrdrt.supabase.co",
    "sb_publishable_m1PZazpxmQepEPbktVMzZA_YusPeIWL"
);

// let currentUser = null;

let main = document.querySelector("main");
let bookshelfContent = document.getElementById("bookshelfContent");

let latestBookRead = document.getElementById("latestRead");

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

    let bookSerie = document.createElement("p");
    bookSerie.textContent = "Bokseriens namn här"

    let ratingStars = document.createElement("div");
    ratingStars.style.display = "flex";
    ratingStars.style.justifyContent = "center";

    for (let i = 1; i < 6; i++) {
        let star = document.createElement("p");
        star.innerHTML = "★";

        ratingStars.append(star);
    }

    bookCard.appendChild(bookIMG);
    bookCard.appendChild(bookTitle);
    bookCard.appendChild(bookSerie)
    bookCard.appendChild(ratingStars);

    book.appendChild(bookCard);
}

let books = document.querySelectorAll(".book");

for (let book of books) {
    makeBookCard(book);
}




async function latestBook() {
    let { data: books, error } = await supabaseClient
        .from("books")
        .select("*")

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
    let pTitle = document.createElement("h4");
    pTitle.textContent = latestBook.title;
    pTitle.style.fontSize = "18px";
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

    let pRating = document.createElement("p");
    pRating.style.marginTop = "15px";
    pRating.style.fontSize = "14px";
    pRating.style.fontWeight = "bold";
    let text = document.createElement("span");
    text.textContent = `${latestBook.ratings.book}/10 `;

    let star = document.createElement("span");
    star.textContent = "★";
    star.style.color = "gold";
    pRating.append(text, star);

    latestBookRead.innerHTML = "";
    divBook.innerHTML = "";


    let bookInfoDiv = document.createElement("div");
    bookInfoDiv.classList.add("bookInfoDiv");
    bookInfoDiv.append(pTitle);

    if (pInfo) {
        bookInfoDiv.append(pInfo);
    }

    bookInfoDiv.append(pRating)
    latestBookRead.append(pImg, bookInfoDiv);

};
latestBook();



async function allBooksByYear() {
    let books = await supabaseClient
        .from("books")
        .select("*")

    books = books.data || [];
    // Bara böcker som är avslutade
    const finishedBooks = books.filter(book => book.finish);

    // Totalt antal lästa böcker
    const totalBooks = finishedBooks.length;

    // Räkna per år
    const booksPerYear = {};

    for (let book of finishedBooks) {
        const year = book.finish.slice(0, 4);
        if (!booksPerYear[year]) {
            booksPerYear[year] = 0;
        }
        booksPerYear[year]++;
    }

    let showBookNumber = document.getElementById("booksRead");

    let BookShlefCount = document.createElement("p");
    BookShlefCount.classList.add("bookshelfCount")
    BookShlefCount.innerHTML = `
       My bookshelf contains <strong>${totalBooks}</strong> books 
       <br><br>
   `;

    let pBooksYear = document.createElement("p");
    pBooksYear.classList.add("booksCountYear");
    let html = "";

    for (let year in booksPerYear) {
        html += `<strong>${year}: </strong> ${booksPerYear[year]} books<br>`;
    }
    pBooksYear.innerHTML = html;

    showBookNumber.append(BookShlefCount, pBooksYear);
};

allBooksByYear();