let supabaseClient = window.supabase.createClient(
    "https://qciftuisfloydqxgrdrt.supabase.co",
    "sb_publishable_m1PZazpxmQepEPbktVMzZA_YusPeIWL"
);


let main = document.getElementById("main");
let drawingSpace = document.getElementById("drawingSpace");
let grafHeader = document.getElementById("grafHeader");

let buttonStatsDiv = document.getElementById("ButtonsStats");
let genreButton = document.getElementById("genreButton");
let monthButton = document.getElementById("monthButton");


let currentYear = new Date().getFullYear();
let selectedYear = currentYear;

let firstYear = currentYear;
let allBooks = [];
let activeDiagram = "month";


// Hämta alla böcker från Supabase
async function getBooks() {
    let { data, error } = await supabaseClient
        .from("books")
        .select("title, genre, finish");

    if (error) {
        console.error(error);
        return [];
    }
    return data;
}


// Hitta det äldsta året med en avslutad bok
function getFirstYear(bookArray) {
    let years = [];
    for (let book of bookArray) {
        if (book.finish) {
            let year = Number(book.finish.slice(0, 4));

            if (!isNaN(year)) {
                years.push(year);
            }
        }
    }

    if (years.length === 0) {
        return currentYear;
    }
    return Math.min(...years);
}


// Skapa årsknappar automatiskt
function createYearButtons() {
    let divYearsButton = document.createElement("div");
    divYearsButton.id = "statsYears";

    for (let year = firstYear; year <= currentYear; year++) {
        let yearButton = document.createElement("button");
        yearButton.textContent = year;

        if (year === selectedYear) {
            yearButton.classList.add("active");
        }

        yearButton.addEventListener("click", function () {
            selectedYear = year;
            updateDiagram();
        });
        divYearsButton.append(yearButton);
    }
    grafHeader.append(divYearsButton);
}


// Uppdatera det valda diagrammet
function updateDiagram() {
    grafHeader.innerHTML = "";
    drawingSpace.innerHTML = "";
    if (activeDiagram === "genre") {
        diagramGenre();
    }
    else {
        diagramBooksPerMonth();
    }
    createYearButtons();
}


// Starta statistiken
async function startStats() {
    allBooks = await getBooks();
    firstYear = getFirstYear(allBooks);
    updateDiagram();
}

startStats();

genreButton.addEventListener("click", function () {
    activeDiagram = "genre";
    updateDiagram();
});


monthButton.addEventListener("click", function () {
    activeDiagram = "month";
    updateDiagram();
});


//Diagram för genre
function diagramGenre() {
    let h2 = document.createElement("h2");
    h2.innerHTML = `Antal böcker inom varje genre - ${selectedYear}`;
    grafHeader.append(h2);

    function prepareData(bookArray) {
        let genres = [];
        for (let book of bookArray) {
            if (!book.finish || !book.genre) {
                continue;
            }

            let yearFinish = Number(book.finish.slice(0, 4));

            if (yearFinish === selectedYear) {
                let genre = book.genre.split(",")[0].trim();
                genres.push(genre);
            }
        }
        return genres;
    }

    let genres = prepareData(allBooks);
    drawChart(genres);


    function drawChart(genres) {
        const hSvg = 400;
        const wSvg = 800;
        const hPad = 50;
        const wPad = 100;

        let genreCount = {};

        for (let genre of genres) {
            if (!genreCount[genre]) {
                genreCount[genre] = 0;
            }
            genreCount[genre]++;
        }

        let dataset = [];
        for (let genre in genreCount) {
            let count = genreCount[genre];
            dataset.push({
                genre: genre,
                count: count
            });
        }

        let allGenres = [];
        for (let genre of dataset) {
            if (!allGenres.includes(genre.genre)) {
                allGenres.push(genre.genre);
            };
        };

        let maxNumber = 0;
        for (let item of dataset) {
            if (item.count > maxNumber) {
                maxNumber = item.count;
            };
        };

        let svg = d3.select("#drawingSpace")
            .append("svg")
            .attr("height", hSvg)
            .attr("width", wSvg)

        let xScale = d3.scaleBand()
            .domain(allGenres)
            .range([wPad, wSvg - wPad])
            .paddingInner(0.2)
            .paddingOuter(0.1)

        let yScale = d3.scaleLinear()
            .domain([0, maxNumber + 5])
            .range([hSvg - hPad, hPad])

        let selction = svg.selectAll("rect")
            .data(dataset)
            .enter()
            .append("rect")
            .attr("height", d => (hSvg - hPad) - yScale(d.count))
            .attr("width", xScale.bandwidth())
            .attr("x", d => xScale(d.genre))
            .attr("y", d => yScale(d.count))
            .attr("fill", "#436448")
            ;

        svg.selectAll("text")
            .data(dataset)
            .enter()
            .append("text")
            .text(d => d.count)
            .attr("x", d => xScale(d.genre) + xScale.bandwidth() / 2)
            .attr("y", d => yScale(d.count) - 10)
            .attr("text-anchor", "middle")
            .attr("fill", "black")
            .attr("font-weight", "bold")
            .attr("font-size", "16px")

        let xAxel = d3.axisBottom(xScale);
        let yAxel = d3.axisLeft(yScale);

        svg.append("g")
            .call(xAxel)
            .attr("transform", `translate(0, ${hSvg - hPad})`);

        svg.append("g")
            .call(yAxel)
            .attr("transform", `translate(${wPad}, 0)`);
    };
};


function getCurrentYear() {
    return new Date().getFullYear();
}


// Diagram för böcker per månad
function diagramBooksPerMonth() {
    let h2 = document.createElement("h2");
    h2.innerHTML = `Avslutade böcker per månad - ${selectedYear}`;
    grafHeader.append(h2);

    function prepareData(bookArray) {

        const allMonth = [
            "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
        ];

        let booksInEachMonth = {};
        let dataset = [];

        // Räkna böcker för det valda året
        for (let book of bookArray) {

            if (!book.finish) {
                continue;
            }

            let yearFinish = Number(book.finish.slice(0, 4));

            if (yearFinish === selectedYear) {
                let monthFinish = Number(book.finish.slice(5, 7)) - 1;
                let monthName = allMonth[monthFinish];

                if (!monthName) {
                    continue;
                }

                if (!booksInEachMonth[monthName]) {
                    booksInEachMonth[monthName] = 0;
                }

                booksInEachMonth[monthName]++;
            }
        }

        // Skapa dataset för alla tolv månader
        for (let month of allMonth) {
            let count = booksInEachMonth[month] || 0;

            dataset.push({
                month: month,
                count: count
            });
        }
        return dataset;
    }
    let dataset = prepareData(allBooks);
    makeChart(dataset);
}

function makeChart(dataset) {
    drawingSpace.innerHTML = "";

    const hSvg = 400;
    const wSvg = 800;
    const hPad = 50;
    const wPad = 100;

    let months = dataset.map(d => d.month);
    let valueDatset = [dataset];

    let svg = d3.select("#drawingSpace")
        .append("svg")
        .attr("height", hSvg)
        .attr("width", wSvg);

    let xScale = d3.scaleBand()
        .domain(months)
        .range([wPad, wSvg - wPad])

    let maxBooks = d3.max(dataset, d => d.count) || 0;

    let yScale = d3.scaleLinear()
        .domain([0, Math.max(5, maxBooks + 1)])
        .range([hSvg - hPad, hPad])

    let dFunction = d3.line()
        .x(d => xScale(d.month) + xScale.bandwidth() / 2)
        .y(d => yScale(d.count))

    svg.append("g")
        .selectAll("rect")
        .data(valueDatset)
        .enter()
        .append("path")
        .attr("fill", "none")
        .attr("stroke", "pink")
        .attr("stroke-width", 3)
        .attr("d", dFunction);

    svg.append("g")
        .selectAll("rect")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.month) + xScale.bandwidth() / 2)
        .attr("cy", d => yScale(d.count))
        .attr("r", 3)
        .attr("fill", "black")



    let xAxel = d3.axisBottom(xScale);
    let yAxel = d3.axisLeft(yScale);

    svg.append("g")
        .call(xAxel)
        .attr("transform", `translate(0, ${hSvg - hPad})`)

    svg.append("g")
        .call(yAxel)
        .attr("transform", `translate(${wPad}, 0)`)
};


