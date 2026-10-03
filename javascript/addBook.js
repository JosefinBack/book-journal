
let uploadButton = document.getElementById("uploadButton");
let coverInput = document.getElementById("cover");
let bookCover = document.getElementById("bookCover");
let imgCoverUrl = "";
let specialInfoCheckbox = document.getElementById("specialInfo");
let specialInfoInput = document.getElementById("specialInfoInput");
let addBookButton = document.getElementById("addBookButton");
let cancelButton = document.getElementById("cancelButton");




//ladda upp bokomslag
uploadButton.addEventListener("click", function () {
    coverInput.click();
});

//lägga till en bok i bokhyllan
addBookButton.addEventListener("click", async function () {
    let book = createBook();
    let bookWasSaved = await saveBook(book);

    if (bookWasSaved) {
        clearForm();
    }
});

cancelButton.addEventListener("click", function () {
    clearForm();
})





// ***************** FUNKTIONER ****************'

//Komprimerar bilder och sparar dem på Cloudinaty
async function uploadToCloudinary(file) {
    //inlogg med google (ny)
    const CLOUD_NAME = "dhnlbcj9b";
    const UPLOAD_PRESET = "unsigned_books";

    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    let res = await fetch(url, {
        method: "POST",
        body: formData
    });

    let data = await res.json();
    return data.secure_url; // här får du en https-länk till bilden
}

//förminskar coverbilden
coverInput.addEventListener("change", async function () {
    bookCover.innerHTML = "";
    let file = coverInput.files[0];
    if (!file) {
        return;
    }

    imgCoverUrl = await uploadToCloudinary(file);

    let imgCover = document.createElement("img");
    imgCover.src = imgCoverUrl;
    imgCover.classList.add("bookCoverSize");
    bookCover.append(imgCover);
});



function makeStarsClickable() {
    let groupsOfStars = document.querySelectorAll(".stars");

    for (let i = 0; i < groupsOfStars.length; i++) {
        let stars = groupsOfStars[i].querySelectorAll("span");

        for (let j = 0; j < stars.length; j++) {
            stars[j].addEventListener("click", function () {

                for (let k = 0; k < stars.length; k++) {
                    if (k <= j) {
                        stars[k].classList.add("filled");
                    } else {
                        stars[k].classList.remove("filled");
                    }
                }
            });
        }
    }
}

makeStarsClickable();




//Get all info från form and create a book object

let specialInfoInputText = "testText";
let inputSpecInfo = document.getElementById("inputSpecInfo");

inputSpecInfo.value = specialInfoInputText;

//Ta fram inout för specialInfo
specialInfoCheckbox.addEventListener("click", function () {
    if (specialInfoCheckbox.checked) {
        specialInfoInput.style.visibility = "visible";
    } else {
        specialInfoInput.style.visibility = "hidden";
    }
});


function getBookInfo() {
    let title = document.getElementById("bookTitle").value;
    let author = document.getElementById("author").value;
    let genre = document.getElementById("genre").value;
    let pages = document.getElementById("pagesInput").value;
    let startDate = document.getElementById("startdate").value;
    let endDate = document.getElementById("finishdate").value;

    let newBookInfoObj = {
        title: title,
        author: author,
        genre: genre,
        pages: pages,
        startDate: startDate,
        endDate: endDate,
        imgsrc: imgCoverUrl
    };
    return newBookInfoObj;
}


function getFormat() {
    let bookFormat = [];
    let bookFormatCheckboxes = document.querySelectorAll('input[name="bookFormat"]');

    for (let i = 0; i < bookFormatCheckboxes.length; i++) {
        if (bookFormatCheckboxes[i].checked) {
            bookFormat.push(bookFormatCheckboxes[i].value);
        }
    }
    return bookFormat;
}

function getRatings() {
    let groupsOfStars = document.querySelectorAll(".stars");
    let ratings = {};

    // Gå igenom varje rating-grupp
    for (let i = 0; i < groupsOfStars.length; i++) {

        let oneGroupOfStars = groupsOfStars[i];

        // Hämtar t.ex. "story", "characters" eller "book"
        let dataCategory = oneGroupOfStars.dataset.category;

        // Räknar hur många stjärnor som är fyllda
        let filledStars =
            oneGroupOfStars.querySelectorAll(".filled").length;

        // Sparar resultatet i ratings-objektet
        ratings[dataCategory] = filledStars;
    }
    return ratings;
}

function getSeriesInfo() {
    let serieInfo = {};
    let serieName = document.getElementById("seriesname").value;
    let serieNumber = document.getElementById("numberSeries").value;
    let serieNumberThisBook = document.getElementById("seriesnumber").value;

    let radioButtons = document.querySelectorAll('input[name="series"]');

    for (let i = 0; i < radioButtons.length; i++) {
        if (radioButtons[i].checked) {
            serieInfo = {
                NameOfSeries: serieName,
                NumberOfBooks: serieNumber,
                ThisBookNumber: serieNumberThisBook
            }
        }
    }
    return serieInfo;
}

function getEmotions() {
    let emotionsArray = [];
    let emotionsCheckboxes = document.querySelectorAll('input[name="emotion"]');

    for (let i = 0; i < emotionsCheckboxes.length; i++) {
        if (emotionsCheckboxes[i].checked) {
            emotionsArray.push(emotionsCheckboxes[i].id);
        }
    }
    return emotionsArray;
}

function getShelfNote() {
    let shelfNote = [];
    let checkboxShelfNote = document.getElementById("specialInfo");
    let inputSpecInfo = document.getElementById("inputSpecInfo");

    if (checkboxShelfNote.checked) {
        shelfNote.push(inputSpecInfo.value);
    }
    return shelfNote;
}

function getBookDescription() {
    let bookDescription = document.getElementById("bookDescriptionArea").value;
    return bookDescription;
}


function createBook() {
    let bookInfo = getBookInfo();
    let format = getFormat();
    let ratings = getRatings();
    let serie = getSeriesInfo();
    let bookDescription = getBookDescription();

    let book = {
        title: bookInfo.title,
        author: bookInfo.author,
        genre: bookInfo.genre,
        pages: Number(bookInfo.pages),
        start: bookInfo.startDate || null,
        finish: bookInfo.endDate || null,
        imgsrc: bookInfo.imgsrc,

        ratings: ratings,
        book_format: format,

        seriesname: serie.NameOfSeries || null,
        seriesnumber: serie.ThisBookNumber ? Number(serie.ThisBookNumber) : null,
        serieslength: serie.NumberOfBooks ? Number(serie.NumberOfBooks) : null,

        bookDescription: bookDescription
    };

    return book;
}

//save book to supabase
async function saveBook(book) {

    if (!book.title.trim()) {
        alert("You need to add a title.");
        return false;
    }

    if (!book.imgsrc) {
        alert("You need to add a book cover.");
        return false;
    }

    if (!book.ratings.finalRate) {
        alert("You need to add a final rating.");
        return false;
    }

    let { data, error } = await supabaseClient
        .from("books")
        .insert([book])
        .select();

    if (error) {
        console.error("Kunde inte spara boken:", error);
        return false;
    }

    console.log("Boken sparades:", data);
    return true;
}



function clearForm() {
    // Nollställ vanliga textfält
    document.getElementById("bookTitle").value = "";
    document.getElementById("author").value = "";
    document.getElementById("genre").value = "";
    document.getElementById("pagesInput").value = "";
    document.getElementById("startdate").value = "";
    document.getElementById("finishdate").value = "";
    document.getElementById("bookDescriptionArea").value = "";

    // Nollställ serie-information
    document.getElementById("seriesname").value = "";
    document.getElementById("numberSeries").value = "";
    document.getElementById("seriesnumber").value = "";

    // Nollställ alla checkboxar
    let checkboxes = document.querySelectorAll('input[type="checkbox"]');

    for (let i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = false;
    }

    // Nollställ alla radio-knappar
    let radioButtons = document.querySelectorAll('input[type="radio"]');

    for (let i = 0; i < radioButtons.length; i++) {
        radioButtons[i].checked = false;
    }

    // Nollställ alla ratings
    let stars = document.querySelectorAll(".stars span");

    for (let i = 0; i < stars.length; i++) {
        stars[i].classList.remove("filled");
    }

    // Nollställ special info
    document.getElementById("inputSpecInfo").value = "";
    specialInfoInput.style.visibility = "hidden";

    // Ta bort bokomslaget
    bookCover.innerHTML = "";
    coverInput.value = "";
    imgCoverUrl = "";
}

