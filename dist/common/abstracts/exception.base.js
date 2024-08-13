"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExceptionBase = void 0;
const error_tools_1 = require("../helpers/error-tools");
class ExceptionBase extends Error {
    status;
    constructor(name, description, code, message, detail, context, scope, error, validation) {
        super(message);
        this.name = name;
        this.status = {
            description,
            code,
            message,
            detail,
            context,
            scope,
            validation,
        };
        if (error) {
            error_tools_1.errorTools.log({
                ...this.status,
                name: this.name,
                error,
            });
        }
    }
}
exports.ExceptionBase = ExceptionBase;
