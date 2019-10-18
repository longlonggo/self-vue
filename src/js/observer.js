import { isObject } from './util/index';
import { Dep } from './dep';

export function Observer(data) {
    this.data = data;
    this.walk(data);
}

Observer.prototype = {
    walk: function (data) {
        Object.keys(data).forEach(function (key) {
            this.defineReactive(data, key, data[key]);
        }.bind(this));
    },
    defineReactive: function (data, key, val) {
        var dep = new Dep();
        var childObj = observe(val);

        Object.defineProperty(data, key, {
            enumerable: true,
            configurable: true,
            get: function getter() {
                if (Dep.target) {
                    dep.addSub(Dep.target);
                };
                return val;
            },
            set: function setter(newVal) {
                if (newVal === val) {
                    return
                };

                val = newVal;
                dep.notify();
            }
        })
    }
}

export function observe(value, vm) {
    if (!isObject(value)) {
        return;
    };
    return new Observer(value);
}

