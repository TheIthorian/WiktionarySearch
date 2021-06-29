
function Search(e, language) {

    var start = "https://en.wiktionary.org/wiki/";
    var end = "#" + language;
    var searchTerm = document.getElementById("searchTerm").value;

    var link = start.concat(searchTerm, end);


    console.log(e, link);

    logSearch(e, link, language);

    window.open(link, '_blank');
}


class History {
    constructor(inputValue, urlValue) {
        this.input = inputValue;
        this.url = urlValue;
    }
}

function logSearch(e, link, language) {
    // Old code to use wiktionary form
    // let url = e.target.parentNode.action;
    // let type = e.target;
    // let input = document.getElementById("search-input").value;
    // console.log(url, type, input);
    // url = url + "?search=" + input + "&" + type.name + "=" + type.value.replace(/\s/g, '+') ;

    let url = link;
    let input = e.target.previousElementSibling.value;

    console.log(url);

    let history = JSON.parse(localStorage.getItem("searchHistory_" + language));

    let repeat = false;

    // First one
    if (!history) { history = [new History(input, url)]; }

    else {
        // check if it's a repeat
        for (const record of history) {
            if (record.input == input) { repeat = true; break }
        }
        // It it's not, add it to the list
        if (!repeat) { history.push(new History(input, url)); }

        // Otherwise move it to the top
        else {
            let index = history.length - history.findIndex(x => x.input == input) - 1;
            history = clearHistoryByIndex(index, language);
            history.push(new History(input, url));
        }
    }

    if (history.length > 10) { history.shift(); }

    localStorage.setItem("searchHistory_"  + language, JSON.stringify(history));

    showHistory(language);
}

function showHistory(language) {
    let list = document.getElementById("history");
    let listDisplay = "";

    let records = JSON.parse(localStorage.getItem("searchHistory_"  + language)) ? JSON.parse(localStorage.getItem("searchHistory_"  + language)).reverse() : [];
    let l = records.length;

    for (let i = 0; i < l; i++) {
        let record = records[i];
        listDisplay += "<li><a target='_blank' href='" + record.url + "'>" + record.input + "</a><button id='Clear:" + i + "' value='" + i +
            `' onclick='clearHistoryByEvent(event, "${language}")'>X</button></li>`;
    }

    list.innerHTML = listDisplay;
}

function clearHistoryByEvent(e, language) {
    let index = e.target.value;

    clearHistoryByIndex(index, language);
}

function clearHistoryByIndex(index, language) {
    index = index.toString();
    let history = JSON.parse(localStorage.getItem("searchHistory_"  + language));
    let target = document.getElementById("Clear:" + index);

    history.splice(history.length - index - 1, 1);

    localStorage.setItem("searchHistory_"  + language, JSON.stringify(history));

    target.parentNode.style.display = 'none';

    return history;
}

function clearAllHistory(language) {
    localStorage.removeItem("searchHistory_"  + language);
    for (const listItem of document.getElementById("history").children) {
        listItem.style.display = 'none';
    }
}


