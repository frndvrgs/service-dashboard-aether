"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorTools = void 0;
const logger_1 = require("./logger");
const format = (errorObject) => {
    const clear = (line) => line.replace(/^\s+at\s+/, "").replace(/\r?\n|\r/g, " ");
    const clearStack = (stack) => stack
        .split("\n")
        .map((line) => `- ${clear(line)}`)
        .join("\n");
    const mount = (error) => ({
        message: error.message && clear(error.message),
        stack: error.stack && clearStack(error.stack),
    });
    if (errorObject instanceof AggregateError) {
        return {
            error: errorObject.errors.map((err) => mount(err)),
        };
    }
    else if (errorObject instanceof Error) {
        return {
            error: mount(errorObject),
        };
    }
    else {
        return null;
    }
};
const getScope = () => {
    const stack = new Error().stack;
    if (!stack)
        return "unknown";
    const stackLines = stack.split("\n");
    for (let i = 3; i < stackLines.length; i++) {
        const match = stackLines[i]?.match(/at (\w+)\.(\w+)/);
        if (match) {
            return `${match[1]}.${match[2]}`;
        }
    }
    return "unknown";
};
const log = (exception) => {
    const { name = "UNKNOWN_ERROR", description, context, code = 500, scope, message, detail, error, } = exception || {};
    return logger_1.logger
        .child({
        name,
        msg: description,
        context,
        code,
        scope,
        message,
        detail,
    })
        .error(format(error));
};
exports.errorTools = {
    format,
    getScope,
    log,
};
