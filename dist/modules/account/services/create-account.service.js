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
exports.CreateAccountService = void 0;
const common_1 = require("@nestjs/common");
const account_repository_1 = require("../account.repository");
const uuid_1 = require("uuid");
const app_exception_1 = require("../../../common/exceptions/app.exception");
let CreateAccountService = class CreateAccountService {
    accountRepository;
    constructor(accountRepository) {
        this.accountRepository = accountRepository;
    }
    async create(data) {
        if (!data.email || !data.password) {
            throw new app_exception_1.AppException("INVALID_INPUT", 400, "missing input.", "email / password.");
        }
        return this.accountRepository.create({
            idAccount: (0, uuid_1.v4)(),
            createdAt: new Date(),
            updatedAt: new Date(),
            email: data.email,
            password: data.password,
            document: data.document
        });
    }
};
exports.CreateAccountService = CreateAccountService;
exports.CreateAccountService = CreateAccountService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [account_repository_1.AccountRepository])
], CreateAccountService);
