window.addEventListener("load", function(){
    let table = document.createElement("table");
    read_csv('resources/pattern.csv')
        .then(patterns => table_with_value(table, patterns))
        .then(() => document.getElementById("pattern-list").appendChild(table));
});

function table_with_value(table, patterns) {
    if (patterns.length > 0) {
        let keys = Object.keys(patterns[0]);
        let head = table.insertRow();
        keys.forEach(key => {
            cell_with_value(head, key);
        });
        patterns.forEach(pattern => {
            row_with_value(table, pattern, keys);
        });
    };
};

function row_with_value(table, pattern, keys) {
    let r = table.insertRow();
    keys.forEach(key => {
        let c = cell_with_value(r, pattern[key]);
        if (key === 'content_id') {
            c.addEventListener("click", function () {
                draw_tree(pattern[key]);
            });
        };
    });
};

function cell_with_value(row, value) {
    let c = row.insertCell();
    c.innerHTML = value;
    return c;
};