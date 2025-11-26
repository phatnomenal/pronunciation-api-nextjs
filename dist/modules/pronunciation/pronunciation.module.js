"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PronunciationModule = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const pronunciation_controller_1 = require("./pronunciation.controller");
const pronunciation_service_1 = require("./pronunciation.service");
const openai_module_1 = require("../openai/openai.module");
const firebase_module_1 = require("../firebase/firebase.module");
const scoring_module_1 = require("../scoring/scoring.module");
const phonetics_module_1 = require("../phonetics/phonetics.module");
const multer_1 = require("multer");
const path_1 = require("path");
let PronunciationModule = class PronunciationModule {
};
exports.PronunciationModule = PronunciationModule;
exports.PronunciationModule = PronunciationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            platform_express_1.MulterModule.register({
                storage: (0, multer_1.diskStorage)({
                    destination: './temp',
                    filename: (req, file, callback) => {
                        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                        const ext = (0, path_1.extname)(file.originalname);
                        callback(null, `audio-${uniqueSuffix}${ext}`);
                    },
                }),
                limits: {
                    fileSize: 25 * 1024 * 1024,
                },
            }),
            openai_module_1.OpenaiModule,
            firebase_module_1.FirebaseModule,
            scoring_module_1.ScoringModule,
            phonetics_module_1.PhoneticsModule,
        ],
        controllers: [pronunciation_controller_1.PronunciationController],
        providers: [pronunciation_service_1.PronunciationService],
    })
], PronunciationModule);
//# sourceMappingURL=pronunciation.module.js.map