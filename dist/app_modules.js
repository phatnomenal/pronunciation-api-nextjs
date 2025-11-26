"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const pronunciation_module_1 = require("./modules/pronunciation/pronunciation.module");
const openai_module_1 = require("./modules/openai/openai.module");
const firebase_module_1 = require("./modules/firebase/firebase.module");
const phonetics_module_1 = require("./modules/phonetics/phonetics.module");
const scoring_module_1 = require("./modules/scoring/scoring.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            pronunciation_module_1.PronunciationModule,
            openai_module_1.OpenaiModule,
            firebase_module_1.FirebaseModule,
            phonetics_module_1.PhoneticsModule,
            scoring_module_1.ScoringModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app_modules.js.map