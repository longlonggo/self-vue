import { remove } from './util/index';

export function Dep() {
    this.subs = [];
}

Dep.prototype = {
    addSub: function (sub) {
        this.subs.push(sub);
    },
    removeSub(sub) {
        remove(this.subs, sub)
    },
    notify: function () {
        this.subs.forEach(function (sub) {
            sub.update();
        }.bind(this))
    }
}

Dep.target = null;