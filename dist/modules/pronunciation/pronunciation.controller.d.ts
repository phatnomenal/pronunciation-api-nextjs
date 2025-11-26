import { Response } from 'express';
import { PronunciationService } from './pronunciation.service';
import { FirebaseService } from '../firebase/firebase.service';
import { AnalyzeDto, TranscribeDto, GradeDto, IpaDto, TtsDto, TtsSlowDto } from './dto';
export declare class PronunciationController {
    private pronunciationService;
    private firebaseService;
    constructor(pronunciationService: PronunciationService, firebaseService: FirebaseService);
    getRoot(): {
        message: string;
        version: string;
        status: string;
        storage: string;
    };
    healthCheck(): {
        status: string;
        api_version: string;
        database: string;
        storage: string;
        timestamp: string;
    };
    transcribe(file: Express.Multer.File, dto: TranscribeDto): Promise<any>;
    analyze(file: Express.Multer.File, dto: AnalyzeDto, userId?: string): Promise<any>;
    grade(dto: GradeDto): Promise<{
        score: number;
        feedback: string;
        grade: GradeInfo;
        phonetic_details: PhoneticDetail[];
        pronunciation_guide: string;
    }>;
    getIpa(dto: IpaDto): Promise<IPAAnalysis>;
    textToSpeech(dto: TtsDto, res: Response): Promise<void>;
    slowTextToSpeech(dto: TtsSlowDto, res: Response): Promise<void>;
    getRecordings(userId?: string, limit?: number): Promise<{
        recordings: any;
        count: any;
        note: string;
    }>;
    searchRecordings(query: string, limit?: number): Promise<{
        recordings: RecordingMetadata[];
        count: number;
        query: string;
    }>;
    getRecordingsByScore(minScore?: number, maxScore?: number, limit?: number): Promise<{
        recordings: RecordingMetadata[];
        count: number;
        score_range: string;
    }>;
    getRecording(id: string): Promise<any>;
    updateRecording(id: string, updates: any): Promise<{
        message: string;
    }>;
    deleteRecording(id: string): Promise<{
        message: string;
    }>;
    getStatistics(): Promise<Statistics>;
    getUserStatistics(userId: string): Promise<UserStatistics>;
    getPhrases(): {
        phrases: Phrase[];
    };
    getVoices(): {
        voices: Voice[];
    };
}
