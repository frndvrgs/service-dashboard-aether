"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAccountInput = exports.CreateAccountInput = exports.AccountType = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_type_json_1 = require("graphql-type-json");
let AccountType = class AccountType {
    idAccount;
    email;
    scope;
    document;
    createdAt;
    updatedAt;
};
exports.AccountType = AccountType;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], AccountType.prototype, "idAccount", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], AccountType.prototype, "email", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], AccountType.prototype, "scope", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_type_json_1.GraphQLJSONObject),
    __metadata("design:type", Object)
], AccountType.prototype, "document", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], AccountType.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], AccountType.prototype, "updatedAt", void 0);
exports.AccountType = AccountType = __decorate([
    (0, graphql_1.ObjectType)()
], AccountType);
let CreateAccountInput = class CreateAccountInput {
    email;
    password;
    scope;
    document;
};
exports.CreateAccountInput = CreateAccountInput;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], CreateAccountInput.prototype, "email", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], CreateAccountInput.prototype, "password", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateAccountInput.prototype, "scope", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_type_json_1.GraphQLJSONObject, { nullable: true }),
    __metadata("design:type", Object)
], CreateAccountInput.prototype, "document", void 0);
exports.CreateAccountInput = CreateAccountInput = __decorate([
    (0, graphql_1.InputType)()
], CreateAccountInput);
let UpdateAccountInput = class UpdateAccountInput {
    email;
    password;
    document;
};
exports.UpdateAccountInput = UpdateAccountInput;
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], UpdateAccountInput.prototype, "email", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], UpdateAccountInput.prototype, "password", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_type_json_1.GraphQLJSONObject, { nullable: true }),
    __metadata("design:type", Object)
], UpdateAccountInput.prototype, "document", void 0);
exports.UpdateAccountInput = UpdateAccountInput = __decorate([
    (0, graphql_1.InputType)()
], UpdateAccountInput);
