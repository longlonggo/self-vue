import { Watcher } from '../watcher';
import { getVmVal, setVmVal, toggleHide, toggleRender } from '../util/index';

export default {
    text: function (node, vm, expr) {
        node.textContent = getVmVal(vm, expr);
        new Watcher(vm, expr, function (newVal) {
            node.textContent = newVal;
        })
    },
    html: function (node, vm, expr) {
        node.innerHTML = getVmVal(vm, expr);
        new Watcher(vm, expr, function (newVal) {
            node.innerHTML = newVal;
        })
    },
    show: function (node, vm, expr) {
        var flag = getVmVal(vm, expr);
        toggleHide(node,node.className,flag);

        new Watcher(vm, expr, function (flag) {
            toggleHide(node,node.className,flag);
        })
    },
    if: function (node, vm, expr) {
        var flag = getVmVal(vm, expr);

        new Watcher(vm, expr, function (flag) {

        });
    },
    else: function () {

    },
    "else-if": function () {

    },
    for: function (node, vm, expr) {
        
    },
    on: function (node, vm, expr, eventType) {
        var fn = vm.$methods && vm.$methods[expr];
        if (!fn) {
            throw Error("实例的methods找不到" + expr);
        }

        node.addEventListener(eventType, fn.bind(vm));
    },
    bind: function (node, vm, expr, attr) {

    },
    model: function (node, vm, expr) {
        var value = getVmVal(vm, expr);
        node.value = value;
        node.addEventListener('input', function () {
            setVmVal(vm, expr, this.value);
        });

        new Watcher(vm, expr, function (newVal) {
            node.value = newVal;
        });
    },
    slot: function () {

    },
    pre: function () {

    },
    cloak: function () {

    },
    once: function () {

    },

}