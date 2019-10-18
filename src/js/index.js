import { observe } from "./observer";
import { Compile } from "./compile/index";


export function MiniVue(options) {
    this.$data = options.data;
    this.$methods = options.methods;

    this.proxy();

    observe(this.$data);
    this.$el = this.query(options.el);
    new Compile(this.$el, this);
    options.mounted.call(this);
}

MiniVue.prototype = {
    proxy: function () {
        this.proxyThis();
    },
    proxyThis() {
        Object.keys(this).forEach(function (key) {
            Object.defineProperty(this, key, {
                writable:false,
                enumerable: false,
                configurable: true,
            });
            this.proxyPoperty(this[key]);
        }.bind(this));
    },
    proxyPoperty(data) {
        Object.keys(data).forEach(function (key) {
            Object.defineProperty(this, key, {
                enumerable: false,
                configurable: true,
                get: function getter() {
                    return data[key];
                }.bind(this),
                set: function setter(newVal) {
                    if (data[key] === newVal) {
                        return
                    }
                    data[key] = newVal;
                }.bind(this)
            })
        }.bind(this));
    },
    query: function (el) {
        if (typeof el === 'string') {
            return document.querySelector(el);
        } else if (el instanceof HTMLElement) {
            return el;
        }
    }
}