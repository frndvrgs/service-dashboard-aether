"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerException = void 0;
const error_tools_1 = require("../helpers/error-tools");
const exception_base_1 = require("../abstracts/exception.base");
class ServerException extends exception_base_1.ExceptionBase {
    constructor(description, code, message, detail, error) {
        super("Server Exception", description, code, message, detail, "SERVER", error_tools_1.errorTools.getScope(), error);
    }
}
exports.ServerException = ServerException;
