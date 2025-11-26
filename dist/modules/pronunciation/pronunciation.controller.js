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
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PronunciationController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const pronunciation_service_1 = require("./pronunciation.service");
const firebase_service_1 = require("../firebase/firebase.service");
const dto_1 = require("./dto");
let PronunciationController = class PronunciationController {
    constructor(pronunciationService, firebaseService) {
        this.pronunciationService = pronunciationService;
        this.firebaseService = firebaseService;
    }
    getRoot() {
        return {
            message: 'Pronunciation Trainer API (NestJS Version - Firebase Database)',
            version: '2.0.0',
            status: 'running',
            storage: 'metadata_only',
        };
    }
    healthCheck() {
        return {
            status: 'healthy',
            api_version: 'nestjs',
            database: 'firebase_firestore',
            storage: 'none',
            timestamp: new Date().toISOString(),
        };
    }
    async transcribe(file, dto) {
        if (!file) {
            throw new common_1.HttpException('No audio file provided', common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            const result = await this.pronunciationService.transcribeAudio(file.path, dto.language || 'en');
            return result;
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Transcription failed', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async analyze(file, dto, userId) {
        if (!file) {
            throw new common_1.HttpException('No audio file provided', common_1.HttpStatus.BAD_REQUEST);
        }
        if (!dto.reference_text) {
            throw new common_1.HttpException('Reference text is required', common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            const saveToDb = dto.save_to_database !== false;
            const result = await this.pronunciationService.analyzePronounciation(file.path, dto.reference_text, userId || dto.user_id, saveToDb);
            return result;
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Analysis failed', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async grade(dto) {
        try {
            const result = await this.pronunciationService.gradePronounciation(dto.reference_text, dto.transcribed_text);
            return result;
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Grading failed', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getIpa(dto) {
        try {
            const result = await this.pronunciationService.getIpaAnalysis(dto.text);
            return result;
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'IPA analysis failed', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async textToSpeech(dto, res) {
        try {
            if (dto.speed && (dto.speed < 0.25 || dto.speed > 4.0)) {
                throw new common_1.HttpException('Speed must be between 0.25 and 4.0', common_1.HttpStatus.BAD_REQUEST);
            }
            const audioBuffer = await this.pronunciationService.generateSpeech(dto.text, dto.voice, dto.speed || 1.0);
            res.set({
                'Content-Type': 'audio/mpeg',
                'Content-Disposition': 'attachment; filename=speech.mp3',
            });
            res.send(audioBuffer);
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'TTS generation failed', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async slowTextToSpeech(dto, res) {
        try {
            const audioBuffer = await this.pronunciationService.generateSlowSpeech(dto.text, dto.voice);
            res.set({
                'Content-Type': 'audio/mpeg',
                'Content-Disposition': 'attachment; filename=speech_slow.mp3',
            });
            res.send(audioBuffer);
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'TTS generation failed', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getRecordings(userId, limit) {
        try {
            const limitNum = limit ? parseInt(limit.toString()) : 100;
            let recordings;
            if (userId) {
                recordings = await this.firebaseService.getRecordingsByUser(userId, limitNum);
            }
            else {
                recordings = await this.firebaseService.getAllRecordings(limitNum);
            }
            return {
                recordings,
                count: recordings.length,
                note: 'Only metadata available - audio files not stored',
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Failed to get recordings', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async searchRecordings(query, limit) {
        try {
            const limitNum = limit ? parseInt(limit.toString()) : 50;
            const recordings = await this.firebaseService.searchRecordingsByText(query, limitNum);
            return {
                recordings,
                count: recordings.length,
                query,
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Search failed', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getRecordingsByScore(minScore = 0, maxScore = 100, limit) {
        try {
            const limitNum = limit ? parseInt(limit.toString()) : 50;
            const recordings = await this.firebaseService.getRecordingsByScoreRange(Number(minScore), Number(maxScore), limitNum);
            return {
                recordings,
                count: recordings.length,
                score_range: `${minScore}-${maxScore}`,
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Failed to get recordings by score', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getRecording(id) {
        try {
            const recording = await this.firebaseService.getRecordingById(id);
            if (!recording) {
                throw new common_1.HttpException('Recording not found', common_1.HttpStatus.NOT_FOUND);
            }
            return recording;
        }
        catch (error) {
            if (error.status === 404) {
                throw error;
            }
            throw new common_1.HttpException(error.message || 'Failed to get recording', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateRecording(id, updates) {
        try {
            const success = await this.firebaseService.updateRecording(id, updates);
            if (!success) {
                throw new common_1.HttpException('Recording not found', common_1.HttpStatus.NOT_FOUND);
            }
            return { message: 'Recording updated successfully' };
        }
        catch (error) {
            if (error.status === 404) {
                throw error;
            }
            throw new common_1.HttpException(error.message || 'Failed to update recording', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteRecording(id) {
        try {
            const success = await this.firebaseService.deleteRecording(id);
            if (!success) {
                throw new common_1.HttpException('Recording not found', common_1.HttpStatus.NOT_FOUND);
            }
            return { message: 'Recording deleted successfully' };
        }
        catch (error) {
            if (error.status === 404) {
                throw error;
            }
            throw new common_1.HttpException(error.message || 'Failed to delete recording', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getStatistics() {
        try {
            const stats = await this.firebaseService.getStatistics();
            return stats;
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Failed to get statistics', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getUserStatistics(userId) {
        try {
            const stats = await this.firebaseService.getUserStatistics(userId);
            return stats;
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Failed to get user statistics', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    getPhrases() {
        return { phrases: this.pronunciationService.getPhrases() };
    }
    getVoices() {
        return { voices: this.pronunciationService.getVoices() };
    }
};
exports.PronunciationController = PronunciationController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'API root endpoint' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PronunciationController.prototype, "getRoot", null);
__decorate([
    (0, common_1.Get)('health'),
    (0, swagger_1.ApiOperation)({ summary: 'Health check' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PronunciationController.prototype, "healthCheck", null);
__decorate([
    (0, common_1.Post)('transcribe'),
    (0, swagger_1.ApiOperation)({ summary: 'Transcribe audio file' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('audio')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_a = typeof dto_1.TranscribeDto !== "undefined" && dto_1.TranscribeDto) === "function" ? _a : Object]),
    __metadata("design:returntype", Promise)
], PronunciationController.prototype, "transcribe", null);
__decorate([
    (0, common_1.Post)('analyze'),
    (0, swagger_1.ApiOperation)({ summary: 'Analyze pronunciation with full feedback' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('audio')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Headers)('x-user-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof dto_1.AnalyzeDto !== "undefined" && dto_1.AnalyzeDto) === "function" ? _b : Object, String]),
    __metadata("design:returntype", Promise)
], PronunciationController.prototype, "analyze", null);
__decorate([
    (0, common_1.Post)('grade'),
    (0, swagger_1.ApiOperation)({ summary: 'Grade pronunciation without audio file' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof dto_1.GradeDto !== "undefined" && dto_1.GradeDto) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], PronunciationController.prototype, "grade", null);
__decorate([
    (0, common_1.Post)('ipa'),
    (0, swagger_1.ApiOperation)({ summary: 'Get IPA transcription for text' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof dto_1.IpaDto !== "undefined" && dto_1.IpaDto) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], PronunciationController.prototype, "getIpa", null);
__decorate([
    (0, common_1.Post)('tts'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate speech from text' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_e = typeof dto_1.TtsDto !== "undefined" && dto_1.TtsDto) === "function" ? _e : Object, Object]),
    __metadata("design:returntype", Promise)
], PronunciationController.prototype, "textToSpeech", null);
__decorate([
    (0, common_1.Post)('tts/slow'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate slow speech for learning' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_f = typeof dto_1.TtsSlowDto !== "undefined" && dto_1.TtsSlowDto) === "function" ? _f : Object, Object]),
    __metadata("design:returntype", Promise)
], PronunciationController.prototype, "slowTextToSpeech", null);
__decorate([
    (0, common_1.Get)('recordings'),
    (0, swagger_1.ApiOperation)({ summary: 'Get recordings from database' }),
    __param(0, (0, common_1.Query)('user_id')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], PronunciationController.prototype, "getRecordings", null);
__decorate([
    (0, common_1.Get)('recordings/search'),
    (0, swagger_1.ApiOperation)({ summary: 'Search recordings by text' }),
    __param(0, (0, common_1.Query)('query')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], PronunciationController.prototype, "searchRecordings", null);
__decorate([
    (0, common_1.Get)('recordings/score-range'),
    (0, swagger_1.ApiOperation)({ summary: 'Get recordings within score range' }),
    __param(0, (0, common_1.Query)('min_score')),
    __param(1, (0, common_1.Query)('max_score')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", Promise)
], PronunciationController.prototype, "getRecordingsByScore", null);
__decorate([
    (0, common_1.Get)('recordings/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get specific recording by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PronunciationController.prototype, "getRecording", null);
__decorate([
    (0, common_1.Put)('recordings/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update recording metadata' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PronunciationController.prototype, "updateRecording", null);
__decorate([
    (0, common_1.Delete)('recordings/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete recording' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PronunciationController.prototype, "deleteRecording", null);
__decorate([
    (0, common_1.Get)('statistics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get overall statistics' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PronunciationController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Get)('statistics/user/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user-specific statistics' }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PronunciationController.prototype, "getUserStatistics", null);
__decorate([
    (0, common_1.Get)('phrases'),
    (0, swagger_1.ApiOperation)({ summary: 'Get practice phrases' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PronunciationController.prototype, "getPhrases", null);
__decorate([
    (0, common_1.Get)('voices'),
    (0, swagger_1.ApiOperation)({ summary: 'Get available TTS voices' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PronunciationController.prototype, "getVoices", null);
exports.PronunciationController = PronunciationController = __decorate([
    (0, swagger_1.ApiTags)('pronunciation'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [pronunciation_service_1.PronunciationService,
        firebase_service_1.FirebaseService])
], PronunciationController);
//# sourceMappingURL=pronunciation.controller.js.map