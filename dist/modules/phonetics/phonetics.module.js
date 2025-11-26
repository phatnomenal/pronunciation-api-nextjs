"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhoneticsModule = void 0;
const common_1 = require("@nestjs/common");
const phonetics_service_1 = require("./phonetics.service");
let PhoneticsModule = class PhoneticsModule {
};
exports.PhoneticsModule = PhoneticsModule;
exports.PhoneticsModule = PhoneticsModule = __decorate([
    (0, common_1.Module)({
        providers: [phonetics_service_1.PhoneticsService],
        exports: [phonetics_service_1.PhoneticsService],
    })
], PhoneticsModule);
//# sourceMappingURL=phonetics.module.js.map