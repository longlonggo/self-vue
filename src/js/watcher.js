import {Dep} from './dep';

export function Watcher(vm, exp, cb) {
    this.vm = vm;
    this.cb = cb;
    this.exp = exp;
    this.value = this.get();
}

Watcher.prototype = {
    update: function () {
        this.run();
    },
    run: function () {
        var oldValue = this.value;
        var value = this.vm.data[this.exp];
        if (value !== oldValue) {
            this.value = value;
            this.cb.call(this.vm, value, oldValue);
        };
    },
    get: function () {
        Dep.target = this;
        var value = this.vm.data[this.exp];
        Dep.target = null;
        return value;
    }
}