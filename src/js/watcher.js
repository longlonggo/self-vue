import { Dep } from './dep';
import { getVmVal, getData, parsePath, getUUID } from './util/index';


export function Watcher(vm, expr, cb, UUID) {
    this.vm = vm;
    this.cb = cb;
    this.UUID = UUID || getUUID();
    this.expr = parsePath(expr).join('.');
    this.value = this.get();
}

Watcher.prototype = {
    update: function () {
        this.run();
    },

    run: function () {
        var oldVal = this.value;
        var value = getVmVal(this.vm, this.expr);
        if (value !== oldVal) {
            this.value = value;
            this.cb.call(this.vm, value, oldVal, this.UUID);
        };
    },
    get: function () {
        Dep.target = this;
        var value = getVmVal(this.vm, this.expr);
        Dep.target = null;
        return value;
    },
}