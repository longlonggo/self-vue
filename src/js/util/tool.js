export function isObject(obj) {
    return obj !== null && typeof obj === 'object'
};

export function isElementNode(node) {
    return node.nodeType === 1;
};

export function isTextNode(node) {
    return node.nodeType === 3;
};

export function isCommentNode(node) {
    return node.nodeType === 8;
};

export function isDirective(attr) {
    return /^v-/.test(attr);
};

export function isEventDirective(dir) {
    return /^on:/.test(dir)
};

export function isOnDirective(attr) {
    return /^@/.test(attr);
};
export function isBindDirective(attr) {
    return /^:/.test(attr);
};

export function isSpecificSymbol(str) {
    return /[^\w.\[\]$]/.test(str);
};

export function remove(arr, item) {
    if (arr.length) {
        var index = arr.indexOf(item)
        if (index > -1) {
            return arr.splice(index, 1);
        }
    }
};


export function getUUID() {
    return Number(Math.random().toString().substr(3, 5) + Date.now()).toString(36);
};