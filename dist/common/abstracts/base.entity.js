"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseEntity = void 0;
class BaseEntity {
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
exports.BaseEntity = BaseEntity;
