function SelfVue(options) {
    this.data = options.data;
    this.methods = options.methods;

    Object.keys(this.data).forEach(function (key) {
        this.proxyKeys(key);
    }.bind(this));

    observe(this.data);
    new Compile(options.el, this);
    options.mounted.call(this);
}

SelfVue.prototype = {
    proxyKeys: function (key) {
        Object.defineProperty(this, key, {
            enumerable: false,
            configurable: true,
            get: function getter() {
                return this.data[key];
            }.bind(this),
            set: function setter(newVal) {
                this.data[key] = newVal;
            }.bind(this)
        })
    }
}