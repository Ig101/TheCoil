interface Array<T> {
    remove(object: T): Array<T>;
}

Object.defineProperty(Array.prototype, 'remove', {
    value: function remove(object) {
        const index = this.indexOf(object, 0);
        if (index > -1) {
            this.splice(index, 1);
            return true;
        }
        return false;
    },
    writable: true,
    configurable: true
});
