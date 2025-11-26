import { PhoneticsService } from '../phonetics/phonetics.service';
import { GradeInfo, PhoneticDetail } from '../../types';
export declare class ScoringService {
    private phoneticsService;
    constructor(phoneticsService: PhoneticsService);
    normalizeText(text: string): string;
    calculatePronunciationScore(reference: string, transcribed: string): {
        score: number;
        feedback: string;
        phonetic_details: PhoneticDetail[];
        pronunciation_guide: string;
    };
    getGradeBreakdown(score: number): GradeInfo;
}
