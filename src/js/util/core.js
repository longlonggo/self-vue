import { isSpecificSymbol } from './tool';

export function parsePath(path) {
    path = path.replace(/\s/g, '');
    if (isSpecificSymbol(path)) {
        return console.error('调用路径的：' + path + '中含有特殊符号');
    }

    path = path.replace(/^\[|\]/g, '');
    path = path.replace(/\[/g, '.');
    var segments = path.split('.');

    return segments;
}


export function getData(obj, segments) {
    for (let i = 0; i < segments.length; i++) {
        if (!obj) return;
        obj = obj[segments[i]];
    }
    return obj;
}

export function getVmVal(vm, expr) {
    return getData(vm.$data, parsePath(expr));
}

export function setVmVal(vm, expr, value) {
    var data = vm.$data;
    var segments = parsePath(expr);
    for (var index = 0, len = segments.length - 1; index < len; index++) {
        data = data[segments[index]];
    }
    data[segments[index]] = value;
}

export function toggleHide(node, className, flag) {
    if (flag) {
        className = className.replace(/hide/g, '')
    } else if (className.indexOf('hide') === -1) {
        className += ' hide';
    }
    node.className = className.trim();
}