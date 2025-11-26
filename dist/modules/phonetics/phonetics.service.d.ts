import { PhoneticDetail, IPAAnalysis } from '../../types';
export declare class PhoneticsService {
    getIPATranscription(text: string): string;
    analyzeWordPronunciation(referenceWord: string, transcribedWord: string): PhoneticDetail;
    getPhoneticFeedback(referenceText: string, transcribedText: string): PhoneticDetail[];
    getStressPatterns(text: string): string;
    getFullIPAAnalysis(text: string): IPAAnalysis;
    private calculateSimilarity;
}
