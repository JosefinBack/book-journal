
document.getElementById("bookMenu").innerHTML = `
<div id="menuButtons">
        <a href="books.html" class="menuButtonStyle">
            <p>My books</p>
        </a>

        <a href="addBook.html" class="menuButtonStyle">
            <p>Add a book</p>
        </a>

        <button class="menuButtonStyle">
            <p>TBR</p>
        </button>

        <a href="stats.html" class="menuButtonStyle">
            <p>Statistics</p>
        </a>
    </div>

    <div id="searchAndFilter">
        <div id="inputDiv">
            <input type="text" id="textfield">
            <button class="buttons">Search</button>
            <button class="buttons">Filter</button>
        </div>
    </div>
</div>
`;