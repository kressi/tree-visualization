async function read_csv(path) {
    const response = await fetch(path);
    const csv = await response.text();
    return $.csv.toObjects(csv);
};

const structure = async () => {
    return await read_csv('resources/structure.csv');
}

async function draw_tree(content_id) {
    structure().then(struct => chart_config(content_id, struct))
               .then(config => Treant(config));
}

function desc_tree(content_id, tree) {
    const sub_tree = tree.filter(obj => obj.id === content_id)
                         .map(child => desc_tree(child.childId, tree));
    const tree_obj = {
        text: {name: content_id}
    };
    if (sub_tree.length > 0) {
        tree_obj.children = sub_tree;
    };
    return tree_obj;
};

function chart_config(content_id, tree) {
    const node_structure = desc_tree(content_id, tree);
    return $.extend({}, chart_config_0, {nodeStructure: node_structure});
};

const chart_config_0 = {
    chart: {
        container: "#description-tree",
        animateOnInit: true,
        node: {
            collapsable: true
        },
        animation: {
            nodeAnimation: "easeOutBounce",
            nodeSpeed: 700,
            connectorsAnimation: "bounce",
            connectorsSpeed: 700
        }
    }
};
