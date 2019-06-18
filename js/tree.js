const STRUCTURE_CSV = 'resources/structure.csv';
const CONTENT_CSV = 'resources/content.csv';
const SIMPLE_CSV = 'resources/simple-content.csv';

async function readCsv(path) {
    const response = await fetch(path);
    const csv = await response.text();
    return $.csv.toObjects(csv);
};

const data = async () => {
    return await Promise.all([
        readCsv(STRUCTURE_CSV),
        readCsv(CONTENT_CSV),
        readCsv(SIMPLE_CSV)
    ]);
};

async function drawTree(contentId) {
    data().then(data => createChartConfig(data, contentId))
          .then(config => Treant(config));
};

function createChartNode(data, contentId, condition) {
    const tree = data[0];
    const subTree = tree.filter(obj => obj['CONTENT_ID'] === contentId)
                        .map(child => createChartNode(data, child['CHILD_CONTENT_ID'], child['CONDITION']));
    const [pattern, mode, sensitivity, value] = contentDescription(contentId, data);
    const treeObj = {
        text: {name: contentId}
    };
    let title = '';
    if (pattern) { title = 'Pattern:\xa0'.concat(pattern); };
    if (value) { title = 'Simple:\xa0'.concat(value); };
    if (condition) { title = title.concat(' IF\xa0'.concat(condition)); };
    if (title) { treeObj.text.title = title; };
    let desc = '';
    if (mode) { desc = 'Mode:\xa0'.concat(mode); };
    if (sensitivity) { desc = desc.concat(' Sensitivity:\xa0'.concat(sensitivity)); };
    if (desc) { treeObj.text.desc = desc; };
    if (subTree.length > 0) { treeObj.children = subTree; };
    return treeObj;
};

function contentDescription(contentId, data) {
    let simple = data[2].find(obj => obj['ID'] === contentId);
    let content = data[1].find(obj => obj['ID'] === contentId);
    let pattern, mode, sensitivity, value;
    if (simple) {
        mode = simple['MODE'];
        value = simple['SIMPLE_VALUE'];
    } else if (content) {
        mode = content['MODE'];
        pattern = content['PATTERN_NAME'];
        sensitivity = content['SENSITIVITY'];
    };
    return [pattern, mode, sensitivity, value];
};

function createChartConfig(data, contentId) {
    const struct = createChartNode(data, contentId);
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
