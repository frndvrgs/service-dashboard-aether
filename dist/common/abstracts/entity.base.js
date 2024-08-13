"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityBase = void 0;
class EntityBase {
    #id;
    props;
    constructor(id, props) {
        this.#id = id;
        this.props = props;
    }
    equals(object) {
        return JSON.stringify(object.#id) === JSON.stringify(this.#id);
    }
}
exports.EntityBase = EntityBase;
