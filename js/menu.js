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
        let th = doc.createElement('TH');
        th.classList.add('sort');
        th.setAttribute('data-sort', key);
        let text = doc.createTextNode(key);
        th.appendChild(text);
        row.appendChild(th);
    });
    return row;
};

function insertFilterRow(doc, keys, list) {
    let head = doc.getElementsByTagName('THEAD')[0];
    let row = doc.createElement('TR');
    head.appendChild(row);
    keys.forEach(key => {
        let input = doc.createElement('INPUT');
        let id = 'filter-'.concat(key);
        input.id = id;
        input.setAttribute('type', 'text');
        input.oninput = createFilter(doc, id, key, list);
        let td = doc.createElement('TD');
        td.classList.add('filter');
        td.appendChild(input);
        row.appendChild(td);
    });
};

function createFilter(doc, id, key, list) {
    let fun = () => {
        let input = doc.getElementById(id);
        let value = input.value;
        if (value) {
            list.filter( item => {
                if (item.values()[key].startsWith(value)) {
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

