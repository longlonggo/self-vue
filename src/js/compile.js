import { Watcher } from './watcher'
export function Compile(el, vm) {
    this.vm = vm;
    this.el = document.querySelector(el);
    this.fragment = null;
    this.init();
}

Compile.prototype = {
    init: function () {
        if (this.el) {
            this.fragment = this.nodeToFragment(this.el);
            this.compileElement(this.fragment);
            this.el.appendChild(this.fragment);
        } else {
            console.warn("Dom元素不存在");
        }
    },
    nodeToFragment: function (el) {
        var fragment = document.createDocumentFragment();
        var child = el.firstChild;
        while (child) {
            //将Dom元素移入fragment中
            fragment.appendChild(child);
            child = el.firstChild;
        }
        return fragment;
    },
    compileElement: function (el) {
        var childNodes = el.childNodes;
        [].slice.call(childNodes).forEach(function (node) {
            var reg = /\{\{(.*)\}\}/;
            var text = node.textContent;
            if (this.isElementNode(node)) {
                this.compile(node);
            } else if (this.isTextNode(node) && reg.test(text)) {
                this.compileText(node, reg.exec(text)[1]);
            }

            if (node.childNodes && node.childNodes.length) {
                this.compileElement(node);
            }
        }.bind(this));
    },
    compile: function (node) {
        var nodeAttrs = node.attributes;
        [].slice.call(nodeAttrs).forEach(function (attr) {
            var attrName = attr.name;
            if (this.isDirective(attrName)) {
                var exp = attr.value;
                var dir = attrName.substring(2);
                if (this.isEventDirective(dir)) {
                    this.compileEvent(node, this.vm, exp, dir);
                } else {
                    this.compileModel(node, this.vm, exp, dir);
                }
                node.removeAttribute(attrName);
            }
        }.bind(this))
    },
    compileText: function (node, exp) {
        var initText = this.vm[exp];
        this.updateText(node, initText);
        new Watcher(this.vm, exp, function (value) {
            this.updateText(node, value);
        }.bind(this));
    },
    compileEvent: function (node, vm, exp, dir) {
        var eventType = dir.split(':')[1];
        var cb = vm.methods && vm.methods[exp];

        if (eventType && cb) {
            node.addEventListener(eventType, cb.bind(vm), false);
        }
    },
    compileModel: function (node, vm, exp, dir) {
        var val = this.vm[exp];
        this.modelUpdater(node, val);
        new Watcher(this.vm, exp, function (value) {
            this.modelUpdater(node, value);
        }.bind(this));

        node.addEventListener('input', function (e) {
            var newValue = e.target.value;
            if (val === newValue) {
                return;
            };
            this.vm[exp] = newValue;
            val = newValue;
        }.bind(this))
    },
    updateText: function (node, value) {
        node.textContent = typeof value === 'undefined' ? '' : value;
    },
    modelUpdater: function (node, value, oldValue) {
        node.value = typeof value === 'undefined' ? '' : value;
    },
    isDirective: function (attr) {
        return attr.indexOf('v-') === 0;
    },
    isEventDirective: function (dir) {
        return dir.indexOf('on:') === 0;
    },
    isElementNode: function (node) {
        return node.nodeType === 1;
    },
    isTextNode: function (node) {
        return node.nodeType === 3;
    }
}