import { Watcher } from '../watcher';
import { compile } from './compile';


export function Compile(el, vm) {
    this.vm = vm;
    this.el = el;
    this.fragment = null;
    this.init();
}

Compile.prototype = {
    init: function () {
        if (this.el) {
            this.fragment = this.nodeToFragment(this.el);
            compile.call(this, this.fragment,this.vm);
            this.el.appendChild(this.fragment);
        } else {
            throw Error("Dom元素不存在");
        }
    },
    nodeToFragment: function (node) {
        var fragment = document.createDocumentFragment();

        [].slice.call(node.childNodes).forEach(function (node) {
            fragment.appendChild(node);
        })

        return fragment;
    },




    updateText: function (node, value) {
        node.textContent = typeof value === 'undefined' ? '' : value;
    },
    modelUpdater: function (node, value, oldVal) {
        node.value = typeof value === 'undefined' ? '' : value;
    },
}