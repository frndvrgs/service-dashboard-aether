"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseValueObject = void 0;
class BaseValueObject {
    props;
    constructor(props) {
        this.props = props;
    }
    equals(object) {
        return JSON.stringify(object.props) === JSON.stringify(this.props);
    }
}
exports.BaseValueObject = BaseValueObject;
