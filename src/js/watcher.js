import { Dep } from './dep';
import { getVmVal, getData, parsePath, getUUID } from './util/index';

var index = 0;
export function Watcher(vm, expr, cb, reg) {
    this.vm = vm;
    this.cb = cb;
    this.expr = parsePath(expr).join('.');
    this.reg = reg;
    this.value = this.get();
    index++;
}

Watcher.prototype = {
    update: function (temp) {
        this.run(temp);
    },

    run: function (temp) {
        var oldVal = this.value;
        var value = getVmVal(this.vm, this.expr);
        if (value !== oldVal) {
            this.value = value;
            this.cb.call(this.vm, value, oldVal, this.reg, temp);
        };
    },
    get: function () {
        Dep.target = this;
        var value = getVmVal(this.vm, this.expr);
        Dep.target = null;
        return value;
    },
}