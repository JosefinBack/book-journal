let supabaseClient = window.supabase.createClient(
    "https://qciftuisfloydqxgrdrt.supabase.co",
    "sb_publishable_m1PZazpxmQepEPbktVMzZA_YusPeIWL"
);

let main = document.querySelector("main");
let bookshelfContent = document.getElementById("bookshelfContent");
let latestBookRead = document.getElementById("latestRead");
let rowShelf = document.querySelector(".rowShelf");

let buttonSort = document.getElementById("buttonSort");
let dropDownSort = document.getElementById("dropDownSort");

let buttonFilter = document.getElementById("buttonFilter");

let allBooks = [];
let currentBookIndex = 0;

let bookPopupOverlay = document.getElementById("bookPopupOverlay");
let bookPopupContent = document.getElementById("bookPopupContent");
let closeBookPopup = document.getElementById("closeBookPopup");
let previousBook = document.getElementById("previousBook");
let nextBook = document.getElementById("nextBook");



//AddEventListener

buttonSort.addEventListener("click", function () {
    dropDownSort.classList.toggle("showSortMenu");
});


nextBook.addEventListener("click", function () {
    currentBookIndex++;
    if (currentBookIndex >= allBooks.length) {
        currentBookIndex = 0;
    }
    showBookInPopup();
});


previousBook.addEventListener("click", function () {
    currentBookIndex--;
    if (currentBookIndex < 0) {
        currentBookIndex = allBooks.length - 1;
    }
    showBookInPopup();
});


closeBookPopup.addEventListener("click", function () {
    bookPopupOverlay.classList.remove("showBookPopup");
});


bookPopupOverlay.addEventListener("click", function (event) {
    if (event.target === bookPopupOverlay) {
        bookPopupOverlay.classList.remove("showBookPopup");
    }
});




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

    // Info-box
    if (book.shelf_note) {
        let infoBox = document.createElement("div");
        infoBox.classList.add("bookInfoBox");

        let infoText = document.createElement("p");
        infoText.textContent = book.shelf_note;

        infoBox.appendChild(infoText);
        bookImgDiv.appendChild(infoBox);
    }

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
    } else {
        bookSerie.textContent = "*** Stand alone ***";
    }

    //Boktitel + Serienamn i samma div (pga design i label)
    let titleAndSerieDIV = document.createElement("div");
    titleAndSerieDIV.append(bookTitle, bookSerie);

    // Betyg
    let bookRating = document.createElement("p");
    bookRating.classList.add("bookRating");

    let star = document.createElement("img");
    star.src = "assets/pic/icons/goldstar.png";
    star.classList.add("ratingStar");

    let ratingText = document.createElement("span");
    ratingText.textContent = book.ratings.finalRate + "/10";

    bookRating.append(star, ratingText);

    // Lägg ihop etiketten
    bookLabel.append(titleAndSerieDIV, bookRating);

    // Lägg ihop hela boken
    bookCard.append(bookLabel, bookImgDiv);

    bookCard.addEventListener("click", function () {
        openBookPopup(book.id);
    });

    return bookCard;
}

function openBookPopup(bookId) {
    for (let i = 0; i < allBooks.length; i++) {

        if (allBooks[i].id === bookId) {
            currentBookIndex = i;
            break;
        }
    }
    showBookInPopup();
    bookPopupOverlay.classList.add("showBookPopup");
}

async function getAllBooks() {
    let { data: books, error } = await supabaseClient
        .from("books")
        .select("*");

    if (error) {
        console.error(error);
        return null;
    }

    let sortedBooks = sortBooks(books);
    allBooks = sortedBooks;
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
            shelfIMG.src = "assets/pic/shelf.png";

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
    ratingNumber.textContent = latestBook.ratings.finalRate + "/10";

    bookRating.append(star, ratingNumber);

    // Extra information
    let extraInfo = document.createElement("div");
    extraInfo.classList.add("latestExtraInfo");
    let formatDiv = createLatestInfo("FORMAT", latestBook.book_format);
    let genreDiv = createLatestInfo("GENRE", latestBook.genre);
    let startDiv = createLatestInfo("STARTED", latestBook.start);
    let finishDiv = createLatestInfo("FINISHED", latestBook.finish);

    extraInfo.append(formatDiv, genreDiv, startDiv, finishDiv);

    bookInfoDiv.append(bookTitle, bookSerie, bookRating, extraInfo);

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

    infoDiv.append(infoLabel, infoValue);

    return infoDiv;
}

function showBookInPopup() {

    let book = allBooks[currentBookIndex];
    bookPopupContent.innerHTML = "";

    // BOKOMSLAG
    let cover = document.createElement("img");
    cover.src = book.imgsrc;
    cover.alt = book.title;
    cover.classList.add("popupBookCover");

    // INFO-CONTAINER
    let info = document.createElement("div");
    info.classList.add("popupBookInfo");

    // TITEL
    let title = document.createElement("h2");
    title.textContent = book.title;

    // FÖRFATTARE
    let author = document.createElement("p");
    author.classList.add("popupAuthor");
    author.textContent = book.author;

    // SERIE
    let series = document.createElement("p");

    if (book.seriesname) {
        series.textContent =
            book.seriesname +
            " · Book " +
            book.seriesnumber +
            " of " +
            book.serieslength;
    }

    // BETYG
    let rating = document.createElement("p");
    rating.classList.add("popupRating");

    if (book.ratings && book.ratings.finalRate !== undefined) {
        rating.textContent = "★ " + book.ratings.finalRate + "/10";
    }

    // GENRE
    let genre = document.createElement("p");
    genre.textContent = "Genre: " + (book.genre || "—");

    // FORMAT
    let format = document.createElement("p");

    if (book.book_format && book.book_format.length > 0) {
        format.textContent = "Format: " + book.book_format.join(", ");
    } else {
        format.textContent = "Format: —";
    }

    // SIDOR
    let pages = document.createElement("p");
    pages.textContent = "Pages: " + (book.pages || "—");


    // DATUM
    let dates = document.createElement("p");
    dates.textContent = "Read: " + (book.start || "—") + " – " + (book.finish || "—");


    // SUMMARY
    let summary = document.createElement("p");
    summary.classList.add("popupSummary");
    summary.textContent = book.summary || "";

    // EDIT-KNAPP
    let editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.classList.add("buttonInForm");

    editButton.addEventListener("click", function () {
        window.location.href = "addBook.html?edit=" + book.id;
    });


    let bigDiv = document.createElement("div");
    bigDiv.classList.add("bigDivStyle");

    let bookInfo = document.createElement("div");
    bookInfo.style.width = "50%";
    let bookFeelings = document.createElement("div");
    bookFeelings.style.width = "50%";
    bookFeelings.classList.add("bookFeelings");



    //KÄNSLOR
    let emotionImages = {
        happy: "dragonHappy.png",
        sad: "dragonSad.png",
        angry: "dragonAngry.png",
        heartbroken: "dragonHeartbroken.png",
        LoveIt: "dragonLoveIt.png",
        inspired: "dragonInspired.png",
        excited: "dragonExcited.png",
        notLikeIt: "dragonNotLikeIt.png",
        wantMore: "dragonMore.png",
        flitry: "dragonFlirty.png",
        bored: "dragonBored.png",
        meh: "dragonMeh.png",
        laughing: "dragonLaughing.png",
        disappointed: "dragonDisappointed.png"
    };

    let allFeelings = book.emotions;
    let showEmotions = [];

    for (let i = 0; i < allFeelings.length; i++) {
        let emotion = allFeelings[i];
        let imageName = emotionImages[emotion];

        if (imageName) {
            let feeling = document.createElement("img");
            feeling.src = "assets/pic/" + imageName;
            feeling.alt = emotion;
            feeling.classList.add("dragonEmotions");

            showEmotions.push(feeling);
        }
    }
    bookFeelings.append(...showEmotions);

    bigDiv.append(bookInfo, bookFeelings);
    bookInfo.append(author, series, rating, genre, format, pages, dates);
    info.append(title, bigDiv, summary, editButton);
    bookPopupContent.append(cover, info);
}




//Sortering

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
    // Här skapar vi ett tomt objekt som ska innehålla våra grupper.
    // Exempel på hur objektet kan se ut senare:
    // {
    //     "Ironside Academy": [Plier, Tourner, Relever],
    //     "Ruthless Boys": [bok 1, bok 2, bok 3],
    //     "For the Fans": [For the Fans]
    // }
    // Serier grupperas efter seriesname.
    // Böcker utan serie får en egen grupp med bokens titel som namn.
    let groups = {};


    // Gå igenom alla böcker från databasen.
    for (let book of books) {
        let groupName;

        // Om boken tillhör en serie använder vi serienamnet
        // som namn på gruppen.
        if (book.seriesname) {
            groupName = book.seriesname;
        }

        // Om boken INTE tillhör en serie använder vi istället
        // boktiteln som gruppnamn. På så sätt får även fristående böcker en egen grupp.
        else {
            groupName = book.title;
        }

        // Om gruppen inte redan finns skapar vi den.
        //Exempel: groups["Ironside Academy"] = [];
        if (groups[groupName] === undefined) {
            groups[groupName] = [];
        }
        // Lägg sedan boken i rätt grupp.
        groups[groupName].push(book);
    }

    // Just nu är "groups" ett objekt:
    // {
    //     "Ironside Academy": [Plier, Tourner],
    //     "For the Fans": [For the Fans]
    // }
    //
    // Object.values() hämtar själva innehållet från objektet.
    // Resultatet blir en array som innehåller flera arrayer:
    // [
    //     [Plier, Tourner],
    //     [For the Fans]
    // ]
    // Det gör att vi senare kan sortera och flytta HELA grupper.
    let bookGroups = Object.values(groups);


    // Gå igenom en grupp i taget.
    // "group" kan exempelvis vara:
    // [Tourner, Plier, Relever]
    for (let group of bookGroups) {

        // group[0] är den första boken i gruppen.
        // Om den har ett seriesname vet vi att gruppen representerar en serie.
        if (group[0].seriesname) {
            group.sort(function (a, b) {
                return a.seriesnumber - b.seriesnumber;
            });
        }
    }
    // Nu är böckerna inom varje serie i rätt ordning.
    // Men vi måste också bestämma vilken SERIE/GRUPP
    // som ska visas först på bokhyllan. Vi vill att gruppen som innehåller den senast lästa boken ska komma först.
    bookGroups.sort(function (a, b) {

        // Här ska vi spara det senaste datumet vi hittar i grupp A respektive grupp B.
        let latestDateA = 0;
        let latestDateB = 0;

        // Gå igenom alla böcker i grupp A.
        for (let book of a) {

            // Gör om bokens finish-datum till ett tal. Ju senare datum, desto större tal.
            let date = new Date(book.finish).getTime();

            // Om detta datum är senare än det senaste datum vi hittat hittills sparar vi det.
            if (date > latestDateA) {
                latestDateA = date;
            }
        }

        // Gör exakt samma sak med grupp B.
        for (let book of b) {
            let date = new Date(book.finish).getTime();
            if (date > latestDateB) {
                latestDateB = date;
            }
        }

        // Jämför gruppernas senaste läsdatum.
        // latestDateB - latestDateA betyder att det SENASTE datumet hamnar först.
        return latestDateB - latestDateA;
    });

    let sortedBooks = [];

    // Gå igenom varje grupp.
    for (let group of bookGroups) {
        for (let book of group) {
            sortedBooks.push(book);
        }
    }

    return sortedBooks;
}

async function sortAuthorsAtoZ() {

    // Hämta alla böcker från Supabase
    let { data: books, error } = await supabaseClient
        .from("books")
        .select("*");

    if (error) {
        console.error(error);
        return;
    }

    // Sortera böckerna efter författare A–Ö
    books.sort(function (a, b) {
        return a.author.localeCompare(b.author, "sv");
    });

    // Töm den nuvarande bokhyllan
    bookshelfContent.innerHTML = "";

    // Skapa bokhyllan igen med den nya sorteringen
    createBookshelf(books);

    // Stäng dropdown-menyn
    dropDownSort.classList.remove("showSortMenu");
}


async function sortAuthorsZtoA() {

    let { data: books, error } = await supabaseClient
        .from("books")
        .select("*");

    if (error) {
        console.error(error);
        return;
    }

    // Sortera böckerna efter författare Ö–A
    books.sort(function (a, b) {
        return b.author.localeCompare(a.author, "sv");
    });

    bookshelfContent.innerHTML = "";

    createBookshelf(books);

    dropDownSort.classList.remove("showSortMenu");
}


async function sortTitleAtoZ() {

    let { data: books, error } = await supabaseClient
        .from("books")
        .select("*");

    if (error) {
        console.error(error);
        return;
    }

    // Sortera böckerna efter titel A–Ö
    books.sort(function (a, b) {
        return a.title.localeCompare(b.title, "sv");
    });

    bookshelfContent.innerHTML = "";

    createBookshelf(books);

    dropDownSort.classList.remove("showSortMenu");
}

async function sortTitleZtoA() {

    let { data: books, error } = await supabaseClient
        .from("books")
        .select("*");

    if (error) {
        console.error(error);
        return;
    }

    // Sortera böckerna efter titel Ö–A
    books.sort(function (a, b) {
        return b.title.localeCompare(a.title, "sv");
    });

    bookshelfContent.innerHTML = "";

    createBookshelf(books);

    dropDownSort.classList.remove("showSortMenu");
}