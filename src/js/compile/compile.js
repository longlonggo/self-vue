import { Watcher } from '../watcher';
import { isDirective, isEventDirective, getVmVal } from '../util/index';
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
            } else {
                throw Error("指令不存在");
            }
        }
    })


    if (!!node.childNodes.length) {
        compile.call(this, node, vm);
    }
};

function compileText(node, vm) {
    var text = node.textContent;
    node.oldValArr = [];
    node.newValArr = [];
    if (/{{\s*\S+\s*}}/.test(text)) {
        var textArr = text.match(/{{[^{}]*}}|[^{}]+/g);
        for (var i in textArr) {
            var textSource = textArr[i].match(/({{\s*)([^{}\s]*)(\s*}})/);
            if (textSource) {
                var reg = textSource[0];
                var expr = textSource[2];

                new Watcher(vm, expr, function (newVal, oldVal, index) {
                    node.newValArr[index] = newVal;
                    replaceMustacheVal(node, text);
                }, node.newValArr.length);

                node.oldValArr.push(reg);
                node.newValArr.push(getVmVal(vm, expr));
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
    node.oldValArr.forEach(function (oldVal,i) { 
        text = text.replace(oldVal, node.newValArr[i]);
     });
    node.textContent = text;
}
