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
    var txt = node.textContent;
    var text = txt;
    if (/{{\s*\S+\s*}}/.test(txt)) {
        var txtArr = txt.match(/{{[^{}]*}}|[^{}]+/g);
        for (var i in txtArr) {
            var txtSource = txtArr[i].match(/({{\s*)([^{}\s]*)(\s*}})/);
            if (txtSource) {
                var reg = txtSource[0];
                var expr = txtSource[2];
                txt = txt.replace(reg, getVmVal(vm, expr));
                node.textContent = txt;
                new Watcher(vm, expr, function (newVal, oldVal, reg, temp) {
                    // if (!temp.txt) {
                    //     temp.txt = text.replace(reg, newVal);
                    // }else{
                    //     temp.txt = temp.txt.replace(reg, newVal);
                    // }
                    // console.log(temp.txt)
                    console.log(temp)
                    // console.log(temp.txt)
                    // node.textContent = temp.txt;
                }, reg)
            }
        }
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

