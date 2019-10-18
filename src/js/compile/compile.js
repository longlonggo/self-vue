import { Watcher } from '../watcher';
import { isDirective, isEventDirective, getVmVal, getUUID } from '../util/index';
import directive from './directive';

var compileNodeType = {
    '1': compileElement,
    '3': compileText,
    '8': compileComment
}

function compileElement(node, vm) {
    var attributes = node.attributes;
    [].slice.call(attributes).forEach(function (attr) {
        var attrName = attr.name;
        if (isDirective(attrName)) {
            var attrNameSegments = attrName.match(/(v-)(\S[^:]*)(:?)([^:]*)/)
            var type = attrNameSegments[2];
            var expr = attr.value;
            var key = attrNameSegments[4];

            if (directive[type]) {
                directive[type](node, vm, expr, key);
                node.removeAttribute(attr.name);
            } else {
                console.error(attrName + ("指令不存在"))
            }
        }
    })


    if (!!node.childNodes.length) {
        compile.call(this, node, vm);
    }
};

function compileText(node, vm) {
    var text = node.textContent;
    node.oldValSet = {};
    node.newValSet = {};
    if (/{{\s*\S+\s*}}/.test(text)) {
        var textArr = text.match(/{{[^{}]*}}|[^{}]+/g);
        for (var i in textArr) {
            var textSource = textArr[i].match(/({{\s*)([^{}\s]*)(\s*}})/);
            if (textSource) {
                var reg = textSource[0];
                var expr = textSource[2];
                var UUID = getUUID();
                new Watcher(vm, expr, function (newVal, oldVal, UUID) {
                    node.newValSet[UUID] = newVal;
                    replaceMustacheVal(node, text, UUID);
                }, UUID);

                node.oldValSet[UUID] = reg;
                node.newValSet[UUID] = getVmVal(vm, expr);
            }
        }
        replaceMustacheVal(node, text);
    }
};

function compileComment(node) {
    if (node.parentNode) {
        node.parentNode.removeChild(node);
    };
}


export function compile(node, vm) {
    [].slice.call(node.childNodes).forEach(function (node) {
        compileNodeType[node.nodeType] && compileNodeType[node.nodeType].call(this, node, vm);
    }.bind(this));
}



function replaceMustacheVal(node, text) {
    for (var UUID in node.newValSet) {
        text = text.replace(node.oldValSet[UUID], node.newValSet[UUID]);
    }

    node.textContent = text;
}
