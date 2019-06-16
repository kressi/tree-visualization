window.addEventListener("load", function(){
    read_csv('resources/pattern.csv')
        .then(patterns => table_with_value(document, patterns))
        .then(table => document.getElementById("pattern-list").appendChild(table));
});

function table_with_value(document, patterns) {
    let table = document.createElement("table");
    if (patterns.length > 0) {
        let keys = Object.keys(patterns[0]);
        let head = table.insertRow();
        keys.forEach(key => {
            let th = document.createElement("TH");
            let text = document.createTextNode(key);
            th.appendChild(text);
            head.appendChild(th);
        });
        patterns.forEach(pattern => {
            row_with_value(table, pattern, keys);
        });
    };
    return table;
};

function row_with_value(table, pattern, keys) {
    let r = table.insertRow();
    keys.forEach(key => {
        let c = cell_with_value(r, pattern[key]);
        if (key === 'content_id') {
            c.addEventListener("click", function () {
                draw_tree(pattern[key]);
            });
            c.addClass("pattern-link");
        };
    });
};

function cell_with_value(row, value) {
    let c = row.insertCell();
    c.innerHTML = value;
    return c;
};
