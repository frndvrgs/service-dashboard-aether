"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppException = void 0;
const error_tools_1 = require("../helpers/error-tools");
const exception_base_1 = require("../abstracts/exception.base");
class AppException extends exception_base_1.ExceptionBase {
    constructor(description, code, message, detail, error) {
        super("Application Exception", description, code, message, detail, "APPLICATION", error_tools_1.errorTools.getScope(), error);
    }
}
exports.AppException = AppException;
