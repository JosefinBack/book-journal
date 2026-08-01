
let uploadButton = document.getElementById("uploadButton");
let coverInput = document.getElementById("cover");
let bookCover = document.getElementById("bookCover");


//ladda upp bokomslag
uploadButton.addEventListener("click", function () {
    coverInput.click();
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
    if (!file) return;

    let url = await uploadToCloudinary(file);
    console.log(url);

    let imgCover = document.createElement("img");
    imgCover.src = url;
    imgCover.classList.add("bookCoverSize");
    bookCover.append(imgCover);
});


