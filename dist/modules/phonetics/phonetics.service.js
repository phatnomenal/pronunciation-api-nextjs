"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhoneticsService = void 0;
const common_1 = require("@nestjs/common");
let PhoneticsService = class PhoneticsService {
    getIPATranscription(text) {
        return `[IPA: ${text}]`;
    }
    analyzeWordPronunciation(referenceWord, transcribedWord) {
        const refIpa = this.getIPATranscription(referenceWord);
        const transIpa = this.getIPATranscription(transcribedWord);
        const similarity = this.calculateSimilarity(referenceWord.toLowerCase(), transcribedWord.toLowerCase());
        const detail = {
            word: referenceWord,
            transcribed: transcribedWord,
            reference_ipa: refIpa,
            transcribed_ipa: transIpa,
            similarity: similarity,
            correct: similarity > 0.8,
        };
        if (!detail.correct) {
            detail.feedback = `Try pronouncing '${referenceWord}' as /${refIpa}/`;
        }
        return detail;
    }
    getPhoneticFeedback(referenceText, transcribedText) {
        const refWords = referenceText.toLowerCase().match(/\b\w+\b/g) || [];
        const transWords = transcribedText.toLowerCase().match(/\b\w+\b/g) || [];
        const feedback = [];
        refWords.forEach((refWord, i) => {
            const transWord = transWords[i] || '';
            const analysis = this.analyzeWordPronunciation(refWord, transWord);
            if (!analysis.correct) {
                feedback.push(analysis);
            }
        });
        return feedback;
    }
    getStressPatterns(text) {
        const ipaText = this.getIPATranscription(text);
        let guide = `IPA: ${ipaText}\n\n`;
        guide += 'Stress markers:\n';
        guide += 'ˈ (primary stress) - emphasize this syllable strongly\n';
        guide += 'ˌ (secondary stress) - mild emphasis\n';
        return guide;
    }
    getFullIPAAnalysis(text) {
        const ipaText = this.getIPATranscription(text);
        const words = text.split(' ');
        const wordIpa = words.map((word) => this.getIPATranscription(word));
        return {
            text: text,
            ipa: ipaText,
            words: words,
            word_ipa: wordIpa,
            stress_guide: this.getStressPatterns(text),
        };
    }
    calculateSimilarity(str1, str2) {
        const levenshtein = require('fast-levenshtein');
        const distance = levenshtein.get(str1, str2);
        const maxLength = Math.max(str1.length, str2.length);
        return 1 - distance / maxLength;
    }
};
exports.PhoneticsService = PhoneticsService;
exports.PhoneticsService = PhoneticsService = __decorate([
    (0, common_1.Injectable)()
], PhoneticsService);
//# sourceMappingURL=phonetics.service.js.map