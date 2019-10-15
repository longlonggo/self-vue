function Observer(data) {
    this.data = data;
}

Object.prototype = {
    walk: function (data) {
        Object.keys(data).forEach(function (key) {
            this.defineReactive(data, key, data[key]);
        }.bind(this));
    },
    defineReactive: function (data, key, val) {

    }
}

function observe(value, vm) {
    if (isObject(value)) {
        return;
    }
    return new Observer(value);
}

