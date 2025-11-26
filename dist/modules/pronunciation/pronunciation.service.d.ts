import { OpenaiService } from '../openai/openai.service';
import { FirebaseService } from '../firebase/firebase.service';
import { ScoringService } from '../scoring/scoring.service';
import { PhoneticsService } from '../phonetics/phonetics.service';
import { AnalysisResult, Phrase, Voice } from '../../types';
export declare class PronunciationService {
    private openaiService;
    private firebaseService;
    private scoringService;
    private phoneticsService;
    constructor(openaiService: OpenaiService, firebaseService: FirebaseService, scoringService: ScoringService, phoneticsService: PhoneticsService);
    transcribeAudio(audioPath: string, language?: string): Promise<any>;
    analyzePronounciation(audioPath: string, referenceText: string, userId?: string, saveToDatabase?: boolean): Promise<AnalysisResult & {
        database_save?: any;
        note?: string;
    }>;
    gradePronounciation(referenceText: string, transcribedText: string): Promise<{
        score: number;
        feedback: string;
        grade: GradeInfo;
        phonetic_details: PhoneticDetail[];
        pronunciation_guide: string;
    }>;
    getIpaAnalysis(text: string): Promise<IPAAnalysis>;
    generateSpeech(text: string, voice?: string, speed?: number): Promise<Buffer<ArrayBufferLike>>;
    generateSlowSpeech(text: string, voice?: string): Promise<Buffer<ArrayBufferLike>>;
    getPhrases(): Phrase[];
    getVoices(): Voice[];
}
