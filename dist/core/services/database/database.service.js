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
var DatabaseService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const settings_service_1 = require("../../settings.service");
let DatabaseService = DatabaseService_1 = class DatabaseService extends client_1.PrismaClient {
    logger = new common_1.Logger(DatabaseService_1.name);
    constructor(settingsService) {
        const config = {
            log: [
                { emit: 'event', level: 'query' },
                { emit: 'event', level: 'info' },
                { emit: 'event', level: 'warn' },
                { emit: 'event', level: 'error' },
            ],
            datasources: {
                db: {
                    url: settingsService.database.url
                }
            }
        };
        super(config);
    }
    async onModuleInit() {
        await this.$connect();
        this.setupEventListeners();
    }
    async onModuleDestroy() {
        await this.$disconnect();
    }
    setupEventListeners() {
        this.$on('query', (event) => {
            this.logger.debug(`Query: ${event.query}`);
            this.logger.debug(`Params: ${event.params}`);
            this.logger.debug(`Duration: ${event.duration}ms`);
        });
        this.$on('info', (event) => {
            this.logger.log(`Prisma info: ${event.message}`);
        });
        this.$on('warn', (event) => {
            this.logger.warn(`Prisma warning: ${event.message}`);
        });
        this.$on('error', (event) => {
            this.logger.error(`Prisma error: ${event.message}`);
        });
    }
};
exports.DatabaseService = DatabaseService;
exports.DatabaseService = DatabaseService = DatabaseService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [settings_service_1.SettingsService])
], DatabaseService);
