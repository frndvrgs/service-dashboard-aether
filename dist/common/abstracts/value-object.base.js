"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValueObjectBase = void 0;
class ValueObjectBase {
    props;
    constructor(props) {
        this.props = props;
    }
    equals(object) {
        return JSON.stringify(object.props) === JSON.stringify(this.props);
    }
}
exports.ValueObjectBase = ValueObjectBase;
