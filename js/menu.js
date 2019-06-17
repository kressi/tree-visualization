const PATTERN_CSV = 'resources/pattern.csv';

window.addEventListener("load", function(){
    readCsv(PATTERN_CSV)
        .then(patterns => createTable(document, patterns))
        .then(function([table, keys]) {
            document.getElementById("pattern-list").appendChild(table);
            new List('pattern-list', {valueNames: keys});
        });
});

function createTable(doc, patterns) {
    let table = doc.createElement("TABLE");
    var keys;
    if (patterns.length > 0) {
        keys = Object.keys(patterns[0]);
        let head = createTableHead(doc, keys);
        table.appendChild(head);
        let tbody = doc.createElement("TBODY");
        table.appendChild(tbody);
        tbody.classList.add("list");
        patterns.forEach(pattern => {
            let row = createRow(doc, pattern, keys);
            tbody.appendChild(row);
        });
    };
    return [table, keys];
};

function createTableHead(doc, keys) {
    let head = doc.createElement("THEAD");
    keys.forEach(key => {
        let th = doc.createElement("TH");
        th.classList.add("sort");
        th.setAttribute("data-sort", key);
        let text = doc.createTextNode(key);
        th.appendChild(text);
        head.appendChild(th);
    });
    return head;
}

function createRow(doc, pattern, keys) {
    let row = doc.createElement("TR");
    keys.forEach(key => {
        let cell = row.insertCell();
        cell.innerHTML = pattern[key];
        if (key === 'CONTENT_ID') {
            cell.addEventListener("click", function () {
                drawTree(pattern[key]);
            });
            cell.classList.add("pattern-link");
        };
        cell.classList.add(key);
    });
    return row;
};

