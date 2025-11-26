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
exports.OpenaiService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const openai_1 = require("openai");
const fs = require("fs");
let OpenaiService = class OpenaiService {
    constructor(configService) {
        this.configService = configService;
        this.openai = new openai_1.default({
            apiKey: this.configService.get('OPENAI_API_KEY'),
        });
        this.model = this.configService.get('OPENAI_MODEL') || 'whisper-1';
        this.ttsModel = this.configService.get('OPENAI_TTS_MODEL') || 'tts-1';
        this.ttsVoice = this.configService.get('OPENAI_TTS_VOICE') || 'alloy';
    }
    async transcribeAudio(audioPath, language = 'en') {
        try {
            const audioFile = fs.createReadStream(audioPath);
            const transcription = await this.openai.audio.transcriptions.create({
                file: audioFile,
                model: this.model,
                language: language,
                response_format: 'verbose_json',
            });
            return {
                text: transcription.text,
                language: language,
                duration: transcription.duration,
                segments: transcription.segments,
            };
        }
        catch (error) {
            console.error('Error transcribing audio:', error);
            throw error;
        }
    }
    async generateSpeech(text, voice, speed = 1.0) {
        try {
            const selectedVoice = voice || this.ttsVoice;
            const mp3 = await this.openai.audio.speech.create({
                model: this.ttsModel,
                voice: selectedVoice,
                input: text,
                speed: speed,
            });
            const buffer = Buffer.from(await mp3.arrayBuffer());
            return buffer;
        }
        catch (error) {
            console.error('Error generating speech:', error);
            throw error;
        }
    }
    async generateSlowSpeech(text, voice) {
        return this.generateSpeech(text, voice, 0.75);
    }
};
exports.OpenaiService = OpenaiService;
exports.OpenaiService = OpenaiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], OpenaiService);
//# sourceMappingURL=openai.service.js.map