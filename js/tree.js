const STRUCTURE_CSV = 'resources/structure.csv';
const CONTENT_CSV = 'resources/content.csv';
const SIMPLE_CSV = 'resources/simple-content.csv';

async function readCsv(path) {
    const response = await fetch(path);
    return $.csv.toObjects(response.text());
};

const structure = async () => {
    return Promises.all([
        readCsv(STRUCTURE_CSV),
        readCsv(CONTENT_CSV),
        readCsv(SIMPLE_CSV)
    ]);
}

async function drawTree(contentId) {
    structure().then( function([struct, content, simple]) {
        createChartConfig(struct, contentId);
    }).then(config => Treant(config));
}

function createChartNode(tree, contentId, condition) {
    const sub_tree = tree.filter(obj => obj['CONTENT_ID'] === contentId)
                         .map(child => createChartNode(tree, child['CHILD_CONTENT_ID'], child['CONDITION']));
    const tree_obj = {
        text: {name: contentId}
    };
    if (condition) {
        tree_obj.text.title = 'IF\xa0'.concat(condition);
    };
    if (sub_tree.length > 0) {
        tree_obj.children = sub_tree;
    };
    return tree_obj;
};

function createChartConfig(tree, contentId) {
    const struct = createChartNode(tree, contentId);
    return $.extend({}, CHART_CONFIG_0, {nodeStructure: struct});
};

const CHART_CONFIG_0 = {
    chart: {
        container: '#description-tree',
        animateOnInit: true,
        rootOrientation: 'WEST',
        node: {
            collapsable: true
        },
        animation: {
            nodeAnimation: 'easeOutBounce',
            nodeSpeed: 700,
            connectorsAnimation: 'bounce',
            connectorsSpeed: 700
        }
    }
};
