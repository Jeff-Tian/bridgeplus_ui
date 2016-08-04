function trimString(s, substr) {
    return s.replace(substr, '');
}

function trimNode(n, substr) {
    var anotherNode = {};

    for (var p in n) {
        if (typeof n[p] === 'string') {
            anotherNode[p] = trimString(n[p], substr);
        } else {
            anotherNode[p] = trimNode(n[p], substr);
        }
    }

    return anotherNode;
}

module.exports = {
    trim: function (tree, substr) {
        return trimNode(tree, substr);
    }
};