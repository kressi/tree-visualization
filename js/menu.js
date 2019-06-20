const PATTERN_CSV = 'resources/pattern.csv';

window.addEventListener('load', function(){
    readCsv(PATTERN_CSV)
        .then(patterns => createTable(document, patterns))
        .then(function([table, keys]) {
            document.getElementById('pattern-list').appendChild(table);
            let list = new List('pattern-list', {valueNames: keys});
            insertFilterRow(document, keys, list);
        });
});

function createTable(doc, patterns) {
    let table = doc.createElement('TABLE');
    var keys;
    if (patterns.length > 0) {
        keys = Object.keys(patterns[0]);
        let head = createTableHead(doc, keys);
        table.appendChild(head);
        let tbody = doc.createElement('TBODY');
        table.appendChild(tbody);
        tbody.classList.add('list');
        patterns.forEach(pattern => {
            let row = createDataRow(doc, pattern, keys);
            tbody.appendChild(row);
        });
    };
    return [table, keys];
};

function createTableHead(doc, keys) {
    let head = doc.createElement('THEAD');
    let titleRow = createTitleRow(doc, keys);
    head.appendChild(titleRow);
    return head;
}

function createTitleRow(doc, keys) {
    let row = doc.createElement('TR');
    keys.forEach(key => {
        let th = insertChild(doc, row, 'TH');
        th.classList.add('sort');
        th.setAttribute('data-sort', key);
        let text = doc.createTextNode(key);
        th.appendChild(text);
    });
    return row;
};

function insertFilterRow(doc, keys, list) {
    let head = doc.getElementsByTagName('THEAD')[0];
    let row = insertChild(doc, head, 'TR');
    keys.forEach(key => {
        let td = insertChild(doc, row, 'TD');
        td.classList.add('filter');
        let input = insertChild(doc, td, 'INPUT');
        let id = 'filter-'.concat(key);
        input.id = id;
        input.setAttribute('type', 'text');
        input.oninput = createFilter(doc, id, key, list);
    });
};

function createFilter(doc, id, key, list) {
    let fun = () => {
        let inputNodes = doc.querySelectorAll('*[id^="filter-"]');
        let filters = Array.from(inputNodes)
            .filter(input => input.value)
            .map(input => [input.id.substring(7), input.value]);
        if (filters) {
            list.filter( item => {
                let matches = filters.filter(
                    ([key, val]) => item.values()[key].toLowerCase().includes(val.toLowerCase())
                ).length;
                if (matches === filters.length) {
                    return true;
                } else {
                    return false;
                };
            });
        } else {
            list.filter();
        };
        return false;
    };
    return fun;
};

function createDataRow(doc, pattern, keys) {
    let row = doc.createElement('TR');
    row.classList.add('pattern-link');
    row.addEventListener('click', function () {
        drawTree(pattern['CONTENT_ID']);
    });
    keys.forEach(key => {
        let cell = row.insertCell();
        cell.innerHTML = pattern[key];
        cell.classList.add(key);
    });
    return row;
};

function insertChild(doc, parent, element) {
    let child = doc.createElement(element);
    parent.appendChild(child);
    return child;
};