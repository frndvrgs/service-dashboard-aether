"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Account = void 0;
const uuid_1 = require("uuid");
class Account {
    id;
    idAccount;
    email;
    password;
    scope;
    document;
    createdAt;
    updatedAt;
    constructor(partial) {
        this.idAccount = (0, uuid_1.v4)();
        this.scope = 'user';
        this.document = {};
        this.createdAt = new Date();
        this.updatedAt = new Date();
        Object.assign(this, partial);
    }
    static create(email, password, scope, document) {
        return new Account({ email, password, scope, document });
    }
}
exports.Account = Account;
