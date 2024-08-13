"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterfaceException = void 0;
const error_tools_1 = require("../helpers/error-tools");
const exception_base_1 = require("../abstracts/exception.base");
class InterfaceException extends exception_base_1.ExceptionBase {
    constructor(description, code, message, detail, error) {
        super("Interface Exception", description, code, message, detail, "INTERFACE", error_tools_1.errorTools.getScope(), error);
    }
}
exports.InterfaceException = InterfaceException;
