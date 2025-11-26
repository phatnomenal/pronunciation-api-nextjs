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
exports.PronunciationService = void 0;
const common_1 = require("@nestjs/common");
const openai_service_1 = require("../openai/openai.service");
const firebase_service_1 = require("../firebase/firebase.service");
const scoring_service_1 = require("../scoring/scoring.service");
const phonetics_service_1 = require("../phonetics/phonetics.service");
const fs = require("fs");
let PronunciationService = class PronunciationService {
    constructor(openaiService, firebaseService, scoringService, phoneticsService) {
        this.openaiService = openaiService;
        this.firebaseService = firebaseService;
        this.scoringService = scoringService;
        this.phoneticsService = phoneticsService;
    }
    async transcribeAudio(audioPath, language = 'en') {
        const result = await this.openaiService.transcribeAudio(audioPath, language);
        if (fs.existsSync(audioPath)) {
            fs.unlinkSync(audioPath);
        }
        return result;
    }
    async analyzePronounciation(audioPath, referenceText, userId, saveToDatabase = true) {
        try {
            const fileStats = fs.statSync(audioPath);
            const fileSize = fileStats.size;
            const fileType = audioPath.split('.').pop();
            const transcriptionResult = await this.openaiService.transcribeAudio(audioPath);
            const transcribedText = transcriptionResult.text;
            const scoreResult = this.scoringService.calculatePronunciationScore(referenceText, transcribedText);
            const gradeInfo = this.scoringService.getGradeBreakdown(scoreResult.score);
            let databaseResult = null;
            if (saveToDatabase) {
                databaseResult = await this.firebaseService.saveRecordingMetadata(referenceText, transcribedText, scoreResult.score, userId, {
                    feedback: scoreResult.feedback,
                    phonetic_details: scoreResult.phonetic_details,
                    pronunciation_guide: scoreResult.pronunciation_guide,
                    grade: gradeInfo.grade,
                    grade_level: gradeInfo.level,
                    duration: transcriptionResult.duration,
                    file_size: fileSize,
                    file_type: fileType,
                });
            }
            if (fs.existsSync(audioPath)) {
                fs.unlinkSync(audioPath);
            }
            const response = {
                transcribed_text: transcribedText,
                reference_text: referenceText,
                score: scoreResult.score,
                feedback: scoreResult.feedback,
                grade: gradeInfo,
                phonetic_details: scoreResult.phonetic_details,
                pronunciation_guide: scoreResult.pronunciation_guide,
                duration: transcriptionResult.duration,
            };
            if (databaseResult) {
                response.database_save = databaseResult;
                response.note = 'Audio file processed temporarily - only metadata saved to database';
            }
            return response;
        }
        catch (error) {
            if (fs.existsSync(audioPath)) {
                try {
                    fs.unlinkSync(audioPath);
                }
                catch (e) {
                    console.error('Error deleting temp file:', e);
                }
            }
            throw error;
        }
    }
    async gradePronounciation(referenceText, transcribedText) {
        const scoreResult = this.scoringService.calculatePronunciationScore(referenceText, transcribedText);
        const gradeInfo = this.scoringService.getGradeBreakdown(scoreResult.score);
        return {
            score: scoreResult.score,
            feedback: scoreResult.feedback,
            grade: gradeInfo,
            phonetic_details: scoreResult.phonetic_details,
            pronunciation_guide: scoreResult.pronunciation_guide,
        };
    }
    async getIpaAnalysis(text) {
        return this.phoneticsService.getFullIPAAnalysis(text);
    }
    async generateSpeech(text, voice, speed = 1.0) {
        return this.openaiService.generateSpeech(text, voice, speed);
    }
    async generateSlowSpeech(text, voice) {
        return this.openaiService.generateSlowSpeech(text, voice);
    }
    getPhrases() {
        return [
            {
                id: 1,
                text: 'The quick brown fox jumps over the lazy dog',
                difficulty: 'beginner',
                category: 'tongue_twister',
            },
            {
                id: 2,
                text: 'She sells seashells by the seashore',
                difficulty: 'beginner',
                category: 'tongue_twister',
            },
            {
                id: 3,
                text: 'How much wood would a woodchuck chuck',
                difficulty: 'beginner',
                category: 'tongue_twister',
            },
            {
                id: 4,
                text: 'Peter Piper picked a peck of pickled peppers',
                difficulty: 'intermediate',
                category: 'tongue_twister',
            },
            {
                id: 5,
                text: 'I scream, you scream, we all scream for ice cream',
                difficulty: 'beginner',
                category: 'tongue_twister',
            },
            {
                id: 6,
                text: "The sixth sick sheikh's sixth sheep's sick",
                difficulty: 'advanced',
                category: 'tongue_twister',
            },
            {
                id: 7,
                text: 'Hello, how are you doing today?',
                difficulty: 'beginner',
                category: 'conversation',
            },
            {
                id: 8,
                text: 'Could you please tell me where the nearest station is?',
                difficulty: 'intermediate',
                category: 'conversation',
            },
            {
                id: 9,
                text: 'I would like to schedule an appointment for next week',
                difficulty: 'intermediate',
                category: 'business',
            },
            {
                id: 10,
                text: 'The weather forecast predicts thunderstorms throughout the weekend',
                difficulty: 'advanced',
                category: 'news',
            },
        ];
    }
    getVoices() {
        return [
            { id: 'alloy', name: 'Alloy', description: 'Neutral, balanced voice' },
            { id: 'echo', name: 'Echo', description: 'Male, clear voice' },
            { id: 'fable', name: 'Fable', description: 'British accent, expressive' },
            { id: 'onyx', name: 'Onyx', description: 'Deep, authoritative voice' },
            { id: 'nova', name: 'Nova', description: 'Female, warm voice' },
            { id: 'shimmer', name: 'Shimmer', description: 'Soft, friendly voice' },
        ];
    }
};
exports.PronunciationService = PronunciationService;
exports.PronunciationService = PronunciationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [openai_service_1.OpenaiService,
        firebase_service_1.FirebaseService,
        scoring_service_1.ScoringService,
        phonetics_service_1.PhoneticsService])
], PronunciationService);
//# sourceMappingURL=pronunciation.service.js.map