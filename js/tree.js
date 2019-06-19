const STRUCTURE_CSV = 'resources/structure.csv';
const CONTENT_CSV = 'resources/content.csv';
const SIMPLE_CSV = 'resources/simple-content.csv';
const NODE_VALUES = [
    ['SIMPLE_VALUE', 'Value'],
    ['MODE',         'Mode'],
    ['PATTERN_NAME', 'Pattern'],
    ['SENSITIVITY',  'Sensitivity']
];

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

function createChartNode(data, contentId, condition, simpleInd) {
    const tree = data[0];
    let simpleChild = {cnt: 0};
    const subTree = tree.filter(obj => obj['CONTENT_ID'] === contentId)
                        .map(child => createChartNode(data, child['CHILD_CONTENT_ID'], child['CONDITION'], simpleChild));
    const [type, node] = getContent(contentId, data);
    const treeObj = {
        text: createText(contentId, node, condition)
    };

    if (type === 'simple') { simpleInd.cnt++; };
    if (simpleChild.cnt > 0) { treeObj.collapsed = true; };
    if (subTree.length > 0) { treeObj.children = subTree; };

    return treeObj;
};

function createText(contentId, nodeValues, condition) {
    let text = { name: contentId };
    if (nodeValues) {
        NODE_VALUES.forEach(function([key, name]) {
            let value = nodeValues[key];
            if (value) {
                text[key] = createTextAttr(name, value);
            };
        });
    } else {
        text.info = '{content missing}';
    };
    if (condition) {
        text.condition = createTextAttr('IF', condition);
    };
    return text;
};

function createTextAttr(attr, text) {
    return attr + ':\xa0' + text;
};

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

function getContent(contentId, data) {
    let content = data[1].find(obj => obj['ID'] === contentId);
    let simple = data[2].find(obj => obj['ID'] === contentId);
    let node, type;
    if (simple) {
        type = 'simple';
        node = simple;
    } else if (content) {
        type = 'content';
        node = content;
    };
    return [type, node];
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
