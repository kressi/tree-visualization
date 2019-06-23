// List of root elements that are found in nodes.csv
const ROOT_CSV = 'resources/root.csv';
// Attribute name of root element which links root elements
// in root.csv with elements in node.csv
const ROOT_ID = 'RootId';
// Prefix for html element ids of filters
const FILTER_PREFIX = 'filter-';

window.addEventListener('load', function(){
    readCsv(ROOT_CSV)
        .then(roots => createTable(document, roots))
        .then(function([table, keys]) {
            document.getElementById('root-list').appendChild(table);
            let list = new List('root-list', {valueNames: keys});
            insertFilterRow(document, keys, list);
        });
});

function createTable(doc, roots) {
    let table = doc.createElement('TABLE');
    var keys;
    if (roots.length > 0) {
        keys = Object.keys(roots[0]);
        let head = createTableHead(doc, keys);
        table.appendChild(head);
        let tbody = doc.createElement('TBODY');
        table.appendChild(tbody);
        tbody.classList.add('list');
        roots.forEach(root => {
            let row = createDataRow(doc, root, keys);
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
        let id = FILTER_PREFIX.concat(key);
        input.id = id;
        input.setAttribute('type', 'text');
        input.oninput = createFilter(doc, id, key, list);
    });
};

function createFilter(doc, id, key, list) {
    let fun = () => {
        let inputNodes = doc.querySelectorAll(`*[id^="${FILTER_PREFIX}"]`);
        let filters = Array.from(inputNodes)
            .filter(input => input.value)
            .map(input => [input.id.substring(FILTER_PREFIX.length), input.value]);
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

function createDataRow(doc, root, keys) {
    let row = doc.createElement('TR');
    row.classList.add('root-link');
    row.addEventListener('click', function () {
        drawTree(root[ROOT_ID]);
    });
    keys.forEach(key => {
        let cell = row.insertCell();
        cell.innerHTML = root[key];
        cell.classList.add(key);
    });
    return row;
};

function insertChild(doc, parent, element) {
    let child = doc.createElement(element);
    parent.appendChild(child);
    return child;
};