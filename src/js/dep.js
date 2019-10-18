import { remove } from './util/index';

export function Dep() {
    this.subs = [];
    this.temp={txt:null};
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
            sub.update(this.temp);
        }.bind(this))
        this.temp.txt=null;
    }
}

Dep.target = null;