const TREE_CSV = 'resources/tree.csv';
const NODE_CSV = 'resources/node.csv';
const LEAF_CSV = 'resources/leaf.csv';
const DISPLAY_VALUES = [
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

// data[0]: tree structure
// data[1]: node values
// data[2]: leaf values
const data = async () => {
    return await Promise.all([
        readCsv(TREE_CSV),
        readCsv(NODE_CSV),
        readCsv(LEAF_CSV)
    ]);
};

async function drawTree(nodeId) {
    data().then(data => createChartConfig(data, nodeId))
          .then(config => Treant(config));
};

function createChartNode(data, nodeId, simpleInd) {
    const tree = data[0];
    let simpleChild = {cnt: 0};
    const subTree = tree.filter(obj => obj['NodeId'] === nodeId)
                        .map(child => createChartNode(data, child['ChildNodeId'], simpleChild));
    const [type, node] = getContent(nodeId, data);
    const treeObj = {
        text: createText(nodeId, node)
    };

    if (type === 'leaf') { simpleInd.cnt++; };
    if (simpleChild.cnt > 0) { treeObj.collapsed = true; };
    if (subTree.length > 0) { treeObj.children = subTree; };

    return treeObj;
};

function createText(nodeId, nodeValues) {
    let text = { name: nodeId };
    if (nodeValues) {
        DISPLAY_VALUES.forEach(function([key, name]) {
            let value = nodeValues[key];
            if (value) {
                text[name] = createTextAttr(name, value);
            };
        });
    } else {
        text.info = '{content missing}';
    };
    return text;
};

function createTextAttr(attr, text) {
    return attr + ':\xa0' + text;
};

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

function getContent(nodeId, data) {
    let node = data[1].find(obj => obj['ID'] === nodeId);
    let leaf = data[2].find(obj => obj['ID'] === nodeId);
    let n, type;
    if (leaf) {
        type = 'leaf';
        n = leaf;
    } else if (node) {
        type = 'node';
        n = node;
    };
    return [type, n];
};

function createChartConfig(data, nodeId) {
    const struct = createChartNode(data, nodeId);
    return $.extend({}, CHART_CONFIG_0, {nodeStructure: struct});
};

const CHART_CONFIG_0 = {
    chart: {
        container: '#tree',
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
