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
exports.ScoringService = void 0;
const common_1 = require("@nestjs/common");
const phonetics_service_1 = require("../phonetics/phonetics.service");
let ScoringService = class ScoringService {
    constructor(phoneticsService) {
        this.phoneticsService = phoneticsService;
    }
    normalizeText(text) {
        return text
            .toLowerCase()
            .trim()
            .replace(/[.,!?]/g, '');
    }
    calculatePronunciationScore(reference, transcribed) {
        const refNormalized = this.normalizeText(reference);
        const transNormalized = this.normalizeText(transcribed);
        const levenshtein = require('fast-levenshtein');
        const distance = levenshtein.get(refNormalized, transNormalized);
        const maxLength = Math.max(refNormalized.length, transNormalized.length);
        const similarity = 1 - distance / maxLength;
        const score = Math.round(similarity * 100);
        let feedback = '';
        if (score >= 95) {
            feedback = 'Excellent! Your pronunciation is nearly perfect.';
        }
        else if (score >= 85) {
            feedback = 'Great job! Your pronunciation is very clear with minor differences.';
        }
        else if (score >= 70) {
            feedback = 'Good effort! There are some pronunciation differences. Keep practicing.';
        }
        else if (score >= 50) {
            feedback = 'Fair attempt. Focus on clarity and try to match the reference text more closely.';
        }
        else {
            feedback = 'Keep practicing! Try speaking more slowly and clearly.';
        }
        const phoneticDetails = this.phoneticsService.getPhoneticFeedback(reference, transcribed);
        const pronunciationGuide = this.phoneticsService.getStressPatterns(reference);
        return {
            score,
            feedback,
            phonetic_details: phoneticDetails,
            pronunciation_guide: pronunciationGuide,
        };
    }
    getGradeBreakdown(score) {
        let grade = '';
        let level = '';
        let color = '';
        if (score >= 95) {
            grade = 'A+';
            level = 'Excellent';
            color = '#10b981';
        }
        else if (score >= 90) {
            grade = 'A';
            level = 'Excellent';
            color = '#10b981';
        }
        else if (score >= 85) {
            grade = 'B+';
            level = 'Very Good';
            color = '#3b82f6';
        }
        else if (score >= 80) {
            grade = 'B';
            level = 'Good';
            color = '#3b82f6';
        }
        else if (score >= 75) {
            grade = 'B-';
            level = 'Good';
            color = '#3b82f6';
        }
        else if (score >= 70) {
            grade = 'C+';
            level = 'Fair';
            color = '#f59e0b';
        }
        else if (score >= 65) {
            grade = 'C';
            level = 'Fair';
            color = '#f59e0b';
        }
        else if (score >= 60) {
            grade = 'C-';
            level = 'Fair';
            color = '#f59e0b';
        }
        else if (score >= 50) {
            grade = 'D';
            level = 'Needs Improvement';
            color = '#ef4444';
        }
        else {
            grade = 'F';
            level = 'Poor';
            color = '#dc2626';
        }
        return {
            score,
            grade,
            level,
            color,
            percentage: score,
        };
    }
};
exports.ScoringService = ScoringService;
exports.ScoringService = ScoringService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [phonetics_service_1.PhoneticsService])
], ScoringService);
//# sourceMappingURL=scoring.service.js.map