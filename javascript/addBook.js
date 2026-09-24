
let uploadButton = document.getElementById("uploadButton");
let coverInput = document.getElementById("cover");
let bookCover = document.getElementById("bookCover");
let imgCoverUrl = "";
let specialInfoCheckbox = document.getElementById("specialInfo");
let specialInfoInput = document.getElementById("specialInfoInput");
let addBookButton = document.getElementById("addBookButton");





//ladda upp bokomslag
uploadButton.addEventListener("click", function () {
    coverInput.click();
});

//lägga till en bok i bokhyllan
addBookButton.addEventListener("click", function () {
    addNewBook();
    //lägg till att alla fomrs ska whipas
});

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


async function addNewBook() {
    let info = getNewBookInfo();
    let format = getFormat();
    let rating = getRatings();
    let serie = getSeriesInfo();


    console.log(info);
    console.log(format);
    console.log(rating);
    console.log(serie);
}

function getNewBookInfo() {
    let title = document.getElementById("bookTitle").value;
    let author = document.getElementById("author").value;
    let genre = document.getElementById("genre").value;
    let pages = document.getElementById("pagesInput").value;
    let startDate = document.getElementById("startdate").value;
    let endDate = document.getElementById("finishdate").value;
    let summary = document.getElementById("summary").value;

    let newBookInfoObj = {
        title: title,
        author: author,
        genre: genre,
        pages: pages,
        startDate: startDate,
        endDate: endDate,
        summary: summary,
        imgsrc: imgCoverUrl
    };
    return newBookInfoObj;
}


function getFormat() {
    let bookFormat = [];
    let bookFormatCheckboxes = document.querySelectorAll('input[name ="bookFormat"]');

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


// getSeriesInfo() – serienamn, serienummer och serieslength.
// getEmotions() – skapar arrayen med valda känslor.
// getShelfNote() – hämtar texten om checkboxen är markerad.
// createBook() – samlar ihop informationen till ett bokobjekt.
// saveBook() – enda funktionen som pratar med Supabase.

