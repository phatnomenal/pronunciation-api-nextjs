import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RecordingMetadata, Statistics, UserStatistics } from '../../types';
export declare class FirebaseService implements OnModuleInit {
    private configService;
    private db;
    constructor(configService: ConfigService);
    onModuleInit(): void;
    saveRecordingMetadata(referenceText: string, transcribedText: string, score: number, userId?: string, metadata?: Partial<RecordingMetadata>): Promise<{
        success: boolean;
        recording_id?: string;
        message?: string;
        error?: string;
    }>;
    getRecordingById(recordingId: string): Promise<RecordingMetadata | null>;
    getAllRecordings(limit?: number): Promise<RecordingMetadata[]>;
    getRecordingsByUser(userId: string, limit?: number): Promise<RecordingMetadata[]>;
    deleteRecording(recordingId: string): Promise<boolean>;
    updateRecording(recordingId: string, updates: Partial<RecordingMetadata>): Promise<boolean>;
    getStatistics(): Promise<Statistics>;
    getRecordingsByScoreRange(minScore: number, maxScore: number, limit?: number): Promise<RecordingMetadata[]>;
    searchRecordingsByText(query: string, limit?: number): Promise<RecordingMetadata[]>;
    getUserStatistics(userId: string): Promise<UserStatistics>;
}
