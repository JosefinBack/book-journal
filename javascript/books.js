let supabaseClient = window.supabase.createClient(
    "https://qciftuisfloydqxgrdrt.supabase.co",
    "sb_publishable_m1PZazpxmQepEPbktVMzZA_YusPeIWL"
);

let main = document.querySelector("main");
let bookshelfContent = document.getElementById("bookshelfContent");
let latestBookRead = document.getElementById("latestRead");
let rowShelf = document.querySelector(".rowShelf");


//Functions
let buttonSideMenu = document.querySelectorAll(".menuButtonStyle");

for (let button of buttonSideMenu) {
    button.addEventListener("click", function () {
        for (let button of buttonSideMenu) {
            button.classList.remove("activeButton");
        }
        button.classList.add("activeButton");
    });
}


// function makeBookCard(book) {
//     let bookCard = document.createElement("div");
//     bookCard.classList.add("book");

//     let div1 = document.createElement("div");
//     div1.classList.add("divsInBookCard");
//     div1.style.gap = "4px";

//     let div2 = document.createElement("div");
//     div2.classList.add("divsInBookCard");

//     bookCard.appendChild(div1);
//     bookCard.appendChild(div2);

//     let bookImgDIV = document.createElement("div");
//     bookImgDIV.classList.add("bookImgDIV");
//     let bookIMG = document.createElement("img");
//     bookIMG.classList.add("imgBookCard");
//     bookIMG.src = book.imgsrc;
//     bookImgDIV.appendChild(bookIMG);

//     let bookTitle = document.createElement("p");
//     bookTitle.textContent = book.title;
//     bookTitle.style.fontSize = "14px";

//     let bookSerie = document.createElement("p");

//     if (book.seriesname === null) {
//         bookSerie.textContent = "";
//     } else {
//         bookSerie.textContent = `${book.seriesname} # ${book.seriesnumber}`;
//     }
//     bookSerie.style.fontSize = "12px";
//     bookSerie.style.fontStyle = "italic";

//     let ratingStars = document.createElement("div");
//     ratingStars.style.display = "flex";
//     ratingStars.style.justifyContent = "center";

//     for (let i = 1; i < 11; i++) {
//         let star = document.createElement("p");
//         star.innerHTML = "★";

//         ratingStars.append(star);
//     }

//     div1.appendChild(bookImgDIV);
//     div1.appendChild(bookTitle);
//     div1.appendChild(bookSerie)
//     div2.appendChild(ratingStars);

//     return bookCard;
// }

function makeBookCard(book) {
    let bookCard = document.createElement("div");
    bookCard.classList.add("book");

    // Bokomslag
    let bookImgDiv = document.createElement("div");
    bookImgDiv.classList.add("bookImgDIV");

    let bookImg = document.createElement("img");
    bookImg.classList.add("imgBookCard");
    bookImg.src = book.imgsrc;
    bookImg.alt = book.title;

    bookImgDiv.appendChild(bookImg);

    // Etikett
    let bookLabel = document.createElement("div");
    bookLabel.classList.add("bookLabel");

    // Boktitel
    let bookTitle = document.createElement("p");
    bookTitle.classList.add("bookTitle");
    bookTitle.textContent = book.title;

    // Serie
    let bookSerie = document.createElement("p");
    bookSerie.classList.add("bookSerie");

    if (book.seriesname) {
        bookSerie.textContent =
            book.seriesname + " · " + book.seriesnumber;
    }

    // Betyg
    let bookRating = document.createElement("p");
    bookRating.classList.add("bookRating");

    let star = document.createElement("span");
    star.classList.add("ratingStar");
    star.textContent = "★";

    let ratingText = document.createElement("span");
    ratingText.textContent = book.ratings.book + "/10";

    bookRating.append(star, ratingText);

    // Lägg ihop etiketten
    bookLabel.append(
        bookTitle,
        bookSerie,
        bookRating
    );

    // Lägg ihop hela boken
    bookCard.append(
        bookLabel,
        bookImgDiv
    );


    return bookCard;
}


async function getAllBooks() {
    let { data: AllBooks, error } = await supabaseClient
        .from("books")
        .select("*")

    if (error) {
        console.error(error);
        return null;
    }

    let sortedBooks = sortBooks(AllBooks);
    createBookshelf(sortedBooks);
}
getAllBooks();


function createBookshelf(books) {
    let bookCounter = 0;
    let currentRow = null;

    for (let oneBook of books) {

        if (bookCounter % 5 === 0) {

            let bigDIV = document.createElement("div");
            bigDIV.classList.add("bigDIV");

            currentRow = document.createElement("div");
            currentRow.classList.add("rowShelf");

            let shelfIMG = document.createElement("img");
            shelfIMG.classList.add("allShelfs");
            shelfIMG.src = "../assets/pic/shelf.png";

            bigDIV.appendChild(currentRow);
            bigDIV.appendChild(shelfIMG);

            bookshelfContent.appendChild(bigDIV);
        }

        let bookCard = makeBookCard(oneBook);
        currentRow.appendChild(bookCard);

        bookCounter++;
    }
}


async function latestBook() {
    let { data: books, error } = await supabaseClient
        .from("books")
        .select("*");

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

    showLatestBook(latestBook);
}
latestBook();


// function showLatestBook(latestBook) {
//     //Skapa en div med info om boken som ska synas i topDIV
//     let divBook = document.createElement("div");
//     let pTitle = document.createElement("h4");
//     pTitle.textContent = latestBook.title;
//     pTitle.style.fontSize = "18px";
//     pTitle.style.margin = "0px";

//     let pInfo = null;

//     if (latestBook.seriesname) {
//         pInfo = document.createElement("p");
//         pInfo.style.margin = "0px";
//         pInfo.textContent = `${latestBook.seriesname} (${latestBook.seriesnumber})`;
//     }

//     let pImg = document.createElement("img");
//     pImg.src = latestBook.imgsrc;
//     pImg.style.height = "150px";

//     let pRating = document.createElement("p");
//     pRating.style.marginTop = "15px";
//     pRating.style.fontSize = "14px";
//     pRating.style.fontWeight = "bold";
//     let text = document.createElement("span");
//     text.textContent = `${latestBook.ratings.book}/10 `;

//     let star = document.createElement("span");
//     star.textContent = "★";
//     star.style.color = "gold";
//     pRating.append(text, star);

//     latestBookRead.innerHTML = "";
//     divBook.innerHTML = "";

//     let bookInfoDiv = document.createElement("div");
//     bookInfoDiv.classList.add("bookInfoDiv");
//     bookInfoDiv.append(pTitle);

//     if (pInfo) {
//         bookInfoDiv.append(pInfo);
//     }

//     bookInfoDiv.append(pRating)
//     latestBookRead.append(pImg, bookInfoDiv);
// }

function showLatestBook(latestBook) {
    latestBookRead.innerHTML = "";

    // Vänster sida - bokomslag
    let bookCoverDiv = document.createElement("div");
    bookCoverDiv.classList.add("latestCoverDiv");

    let bookImg = document.createElement("img");
    bookImg.classList.add("latestCover");
    bookImg.src = latestBook.imgsrc;
    bookImg.alt = latestBook.title;

    bookCoverDiv.appendChild(bookImg);

    // Höger sida - information om boken
    let bookInfoDiv = document.createElement("div");
    bookInfoDiv.classList.add("latestBookInfo");

    // // Liten rubrik
    // let latestText = document.createElement("p");
    // latestText.classList.add("latestText");
    // latestText.textContent = "LATEST READ"

    // Titel
    let bookTitle = document.createElement("h3");
    bookTitle.classList.add("latestTitle");
    bookTitle.textContent = latestBook.title;

    // Serie
    let bookSerie = document.createElement("p");
    bookSerie.classList.add("latestSerie");

    if (latestBook.seriesname) {
        bookSerie.textContent =
            latestBook.seriesname + " · " + latestBook.seriesnumber;
    }

    // Rating
    let bookRating = document.createElement("div");
    bookRating.classList.add("latestRating");

    let star = document.createElement("span");
    star.classList.add("latestStar");
    star.textContent = "★";

    let ratingNumber = document.createElement("span");
    ratingNumber.textContent = latestBook.ratings.book + "/10";

    bookRating.append(star, ratingNumber);

    // Extra information
    let extraInfo = document.createElement("div");
    extraInfo.classList.add("latestExtraInfo");

    // Format
    let formatDiv = createLatestInfo("FORMAT", latestBook.type);

    // Genre
    let genreDiv = createLatestInfo("GENRE", latestBook.genre);

    // Startdatum
    let startDiv = createLatestInfo("STARTED", latestBook.start);

    // Slutdatum
    let finishDiv = createLatestInfo("FINISHED", latestBook.finish);

    extraInfo.append(
        formatDiv,
        genreDiv,
        startDiv,
        finishDiv
    );


    // Lägg ihop informationen
    bookInfoDiv.append(
        bookTitle,
        bookSerie,
        bookRating,
        extraInfo
    );

    // Lägg in allt i latestRead
    latestBookRead.append(
        bookCoverDiv,
        bookInfoDiv
    );
}

function createLatestInfo(label, value) {

    let infoDiv = document.createElement("div");
    infoDiv.classList.add("latestInfoItem");

    let infoLabel = document.createElement("p");
    infoLabel.classList.add("latestInfoLabel");
    infoLabel.textContent = label;

    let infoValue = document.createElement("p");
    infoValue.classList.add("latestInfoValue");

    if (value) {
        infoValue.textContent = value;
    } else {
        infoValue.textContent = "—";
    }

    infoDiv.append(
        infoLabel,
        infoValue
    );

    return infoDiv;
}


async function allBooksByYear() {
    let books = await supabaseClient
        .from("books")
        .select("*")

    books = books.data || [];
    // Bara böcker som är avslutade
    const finishedBooks = books.filter(book => book.finish);
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
       <br>
   `;

    let pBooksYear = document.createElement("p");
    pBooksYear.classList.add("booksCountYear");
    let html = "";

    for (let year in booksPerYear) {
        html += `<strong>${year}: </strong> ${booksPerYear[year]} books<br><br>`;
    }
    pBooksYear.innerHTML = html;
    showBookNumber.append(BookShlefCount, pBooksYear);
};

allBooksByYear();


function sortBooks(books) {
    let groups = {};

    // Lägg böckerna i grupper
    for (let book of books) {
        let groupName;

        if (book.seriesname) {
            groupName = book.seriesname;
        } else {
            groupName = book.title;
        }

        if (groups[groupName] === undefined) {
            groups[groupName] = [];
        }

        groups[groupName].push(book);
    }

    // Gör om grupperna till en array
    let bookGroups = Object.values(groups);

    // Sortera böckerna INUTI varje serie
    for (let group of bookGroups) {

        if (group[0].seriesname) {
            group.sort(function (a, b) {
                return a.seriesnumber - b.seriesnumber;
            });
        }
    }

    // Sortera grupperna efter senaste läsdatum
    bookGroups.sort(function (a, b) {

        let latestDateA = 0;
        let latestDateB = 0;

        for (let book of a) {
            let date = new Date(book.finish).getTime();
            if (date > latestDateA) {
                latestDateA = date;
            }
        }

        for (let book of b) {
            let date = new Date(book.finish).getTime();

            if (date > latestDateB) {
                latestDateB = date;
            }
        }

        return latestDateB - latestDateA;
    });

    // Lägg tillbaka alla böcker i en vanlig array
    let sortedBooks = [];

    for (let group of bookGroups) {

        for (let book of group) {
            sortedBooks.push(book);
        }
    }
    return sortedBooks;
}