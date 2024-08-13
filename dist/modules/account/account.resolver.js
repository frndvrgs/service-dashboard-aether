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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const read_account_service_1 = require("./services/read-account.service");
const create_account_service_1 = require("./services/create-account.service");
const update_account_service_1 = require("./services/update-account.service");
const schema_graphql_1 = require("./interface/v1/schema.graphql");
let AccountResolver = class AccountResolver {
    readAccountService;
    createAccountService;
    updateAccountService;
    constructor(readAccountService, createAccountService, updateAccountService) {
        this.readAccountService = readAccountService;
        this.createAccountService = createAccountService;
        this.updateAccountService = updateAccountService;
    }
    async getAccountByEmail(email) {
        return this.readAccountService.findByEmail(email);
    }
    async getAccountById(idAccount) {
        return this.readAccountService.findById(idAccount);
    }
    async createAccount(input) {
        return this.createAccountService.create(input);
    }
    async updateAccount(idAccount, input) {
        return this.updateAccountService.update(idAccount, input);
    }
};
exports.AccountResolver = AccountResolver;
__decorate([
    (0, graphql_1.Query)(() => schema_graphql_1.AccountType, { nullable: true }),
    __param(0, (0, graphql_1.Args)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AccountResolver.prototype, "getAccountByEmail", null);
__decorate([
    (0, graphql_1.Query)(() => schema_graphql_1.AccountType, { nullable: true }),
    __param(0, (0, graphql_1.Args)('idAccount')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AccountResolver.prototype, "getAccountById", null);
__decorate([
    (0, graphql_1.Mutation)(() => schema_graphql_1.AccountType),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [schema_graphql_1.CreateAccountInput]),
    __metadata("design:returntype", Promise)
], AccountResolver.prototype, "createAccount", null);
__decorate([
    (0, graphql_1.Mutation)(() => schema_graphql_1.AccountType),
    __param(0, (0, graphql_1.Args)('idAccount')),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, schema_graphql_1.UpdateAccountInput]),
    __metadata("design:returntype", Promise)
], AccountResolver.prototype, "updateAccount", null);
exports.AccountResolver = AccountResolver = __decorate([
    (0, graphql_1.Resolver)(() => schema_graphql_1.AccountType),
    __metadata("design:paramtypes", [read_account_service_1.ReadAccountService,
        create_account_service_1.CreateAccountService,
        update_account_service_1.UpdateAccountService])
], AccountResolver);
