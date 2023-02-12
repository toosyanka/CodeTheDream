let apiUrl = 'https://swapi.dev/api/';

function fetchModels (page) {
    let url = `${apiUrl}/people`
    if (page) {
        url += `?page=${page}&limit=10`
    }
    const columns = ['name', 'gender', 'height', 'url'];
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.previous) {
                const prevUrl = new URL(data.previous, url);
                window.prevPage = prevUrl.searchParams.get('page');
            } else {
                window.prevPage = null;
            }
            if (data.next) {
                const nextUrl = new URL(data.next, url);
                window.nextPage = nextUrl.searchParams.get('page');
            } else {
                window.nextPage = null;
            }
            const container = document.getElementById('container');
            container.innerHTML = '';
            generatePeopleTable(container, columns, data.results);
        })
        .catch(() => alert(`Url ${url} is not available`))

}

function fetchFilms (page) {
    let url = `${apiUrl}/films`
    if (page) {
        url += `?page=${page}&limit=10`
    }
    const columns = ['title', 'director', 'release_date', 'url'];
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.previous) {
                const prevUrl = new URL(data.previous, url);
                window.prevPage = prevUrl.searchParams.get('page');
            } else {
                window.prevPage = null;
            }
            if (data.next) {
                const nextUrl = new URL(data.next, url);
                window.nextPage = nextUrl.searchParams.get('page');
            } else {
                window.nextPage = null;
            }
            const container = document.getElementById('container');
            container.innerHTML = '';
            generateFilmsTable(container, columns, data.results);
        })
    .catch(() => alert(`Url ${url} is not available`))

}

function loadNextModelPage () {
    fetchModels(nextPage);
}

function loadPrevModelPage () {
    fetchModels(prevPage);
}

function generatePeopleTable (container, columns, data) {
    const table = document.createElement('table');
    table.setAttribute('class', 'table')
    generateTableHead(table, columns);
    generateTableBody(table, columns, data, peopleRowClickHandler);
    container.appendChild(table);

    const prevButton = document.createElement('button');
    prevButton.innerText = 'Previous';
    prevButton.addEventListener("click", loadPrevModelPage);
    document.getElementById('container');


    const nextButton = document.createElement('button');
    nextButton.innerText = 'Next';
    nextButton.addEventListener("click", loadNextModelPage);
    document.getElementById('container');


    if (!prevPage) {
        prevButton.setAttribute('disabled', 'disabled')
    }
    if (!nextPage) {
        nextButton.setAttribute('disabled', 'disabled')
    }

    container.appendChild(prevButton);
    container.appendChild(nextButton);
}

function generateFilmsTable (container, columns, data) {
    const table = document.createElement('table');
    table.setAttribute('class', 'table')
    generateTableHead(table, columns);
    generateTableBody(table, columns, data);
    container.appendChild(table);
}

function generateTableHead (table, columns) {
    const thead = table.createTHead();
    const row = thead.insertRow();
    for (let column of columns) {
        const th = document.createElement("th");
        if (column === 'url') {
            th.setAttribute('hidden', 'hidden');
        }
        const text = document.createTextNode(column);
        th.appendChild(text);
        row.appendChild(th);
    }
    table.appendChild(thead);
}

function generateTableBody (table, columns, data, rowClickHandler) {
    let tbody = document.createElement('tbody');
    for (const item of data) {
        let tr = document.createElement('tr');
        if (rowClickHandler) {
            tr.addEventListener('click', rowClickHandler)
        }

        for (const column of columns) {
            const td = document.createElement('td');
            if (column === 'url') {
                td.setAttribute('hidden', 'hidden');
            }
            let text = '';
            if (item[column]) {
                text = item[column];
            }
            const textNode = document.createTextNode(text);
            td.appendChild(textNode);
            tr.appendChild(td)
        }
        tbody.appendChild(tr);
    }
    table.appendChild(tbody);
}

function peopleRowClickHandler (event) {
    const url = event.currentTarget.cells[3].innerText;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('container');
            container.innerHTML = '';

            const h2name = document.createElement('h2');
            h2name.innerText = `Name: ${data.name}`;
            container.appendChild(h2name);
            const h2films = document.createElement('h2');
            h2films.innerText = `Films:`;
            container.appendChild(h2films);
            const films = [];
            const promises = [];
            for (const film of data.films) {
                promises.push(fetch(film)
                    .then(response => response.json())
                    .then(data => {
                        films.push({
                            title: data.title,
                            director: data.director,
                            release_date: data.release_date,
                            url: film
                        })
                    }));
            }

            Promise.all(promises).then(() => {
                const columns = ['title', 'director', 'release_date', 'url'];
                const table = generateFilmsTable(container, columns, films);
                container.appendChild(table);
            });
        });

}