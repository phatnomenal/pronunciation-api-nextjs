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
exports.FirebaseService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const admin = require("firebase-admin");
const uuid_1 = require("uuid");
let FirebaseService = class FirebaseService {
    constructor(configService) {
        this.configService = configService;
    }
    onModuleInit() {
        const credentialsPath = this.configService.get('FIREBASE_CREDENTIALS_PATH');
        try {
            const serviceAccount = require(`../../../${credentialsPath}`);
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });
            this.db = admin.firestore();
            console.log('Firebase initialized successfully (Database only)');
        }
        catch (error) {
            console.error('Error initializing Firebase:', error);
            throw error;
        }
    }
    async saveRecordingMetadata(referenceText, transcribedText, score, userId, metadata) {
        try {
            const recordingId = (0, uuid_1.v4)();
            const recordingData = {
                recording_id: recordingId,
                reference_text: referenceText,
                transcribed_text: transcribedText,
                score: score,
                user_id: userId || 'anonymous',
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
                created_at: new Date().toISOString(),
                api_version: 'openai',
                has_audio_file: false,
                ...metadata,
            };
            await this.db.collection('recordings').doc(recordingId).set(recordingData);
            console.log(`Metadata saved successfully. ID: ${recordingId}`);
            return {
                success: true,
                recording_id: recordingId,
                message: 'Metadata saved to Firestore',
            };
        }
        catch (error) {
            console.error('Error saving metadata to Firebase:', error);
            return {
                success: false,
                error: error.message,
            };
        }
    }
    async getRecordingById(recordingId) {
        try {
            const doc = await this.db.collection('recordings').doc(recordingId).get();
            if (doc.exists) {
                const data = doc.data();
                return { ...data, recording_id: doc.id };
            }
            return null;
        }
        catch (error) {
            console.error('Error getting recording:', error);
            return null;
        }
    }
    async getAllRecordings(limit = 100) {
        try {
            const snapshot = await this.db
                .collection('recordings')
                .orderBy('timestamp', 'desc')
                .limit(limit)
                .get();
            const recordings = [];
            snapshot.forEach((doc) => {
                recordings.push({ ...doc.data(), recording_id: doc.id });
            });
            return recordings;
        }
        catch (error) {
            console.error('Error getting recordings:', error);
            return [];
        }
    }
    async getRecordingsByUser(userId, limit = 50) {
        try {
            const snapshot = await this.db
                .collection('recordings')
                .where('user_id', '==', userId)
                .orderBy('timestamp', 'desc')
                .limit(limit)
                .get();
            const recordings = [];
            snapshot.forEach((doc) => {
                recordings.push({ ...doc.data(), recording_id: doc.id });
            });
            return recordings;
        }
        catch (error) {
            console.error('Error getting user recordings:', error);
            return [];
        }
    }
    async deleteRecording(recordingId) {
        try {
            const docRef = this.db.collection('recordings').doc(recordingId);
            const doc = await docRef.get();
            if (!doc.exists) {
                return false;
            }
            await docRef.delete();
            console.log(`Recording ${recordingId} deleted successfully`);
            return true;
        }
        catch (error) {
            console.error('Error deleting recording:', error);
            return false;
        }
    }
    async updateRecording(recordingId, updates) {
        try {
            await this.db.collection('recordings').doc(recordingId).update(updates);
            console.log(`Recording ${recordingId} updated successfully`);
            return true;
        }
        catch (error) {
            console.error('Error updating recording:', error);
            return false;
        }
    }
    async getStatistics() {
        try {
            const recordings = await this.getAllRecordings(1000);
            if (recordings.length === 0) {
                return {
                    total_recordings: 0,
                    average_score: 0,
                    total_users: 0,
                    api_version: 'openai',
                };
            }
            const totalScore = recordings.reduce((sum, r) => sum + (r.score || 0), 0);
            const uniqueUsers = new Set(recordings.map((r) => r.user_id)).size;
            const scoreDistribution = {
                excellent: 0,
                good: 0,
                fair: 0,
                poor: 0,
            };
            recordings.forEach((r) => {
                const score = r.score || 0;
                if (score >= 90)
                    scoreDistribution.excellent++;
                else if (score >= 70)
                    scoreDistribution.good++;
                else if (score >= 50)
                    scoreDistribution.fair++;
                else
                    scoreDistribution.poor++;
            });
            return {
                total_recordings: recordings.length,
                average_score: Math.round((totalScore / recordings.length) * 100) / 100,
                total_users: uniqueUsers,
                score_distribution: scoreDistribution,
                api_version: 'openai',
            };
        }
        catch (error) {
            console.error('Error getting statistics:', error);
            return {
                total_recordings: 0,
                average_score: 0,
                total_users: 0,
                api_version: 'openai',
            };
        }
    }
    async getRecordingsByScoreRange(minScore, maxScore, limit = 50) {
        try {
            const snapshot = await this.db
                .collection('recordings')
                .where('score', '>=', minScore)
                .where('score', '<=', maxScore)
                .orderBy('score')
                .orderBy('timestamp', 'desc')
                .limit(limit)
                .get();
            const recordings = [];
            snapshot.forEach((doc) => {
                recordings.push({ ...doc.data(), recording_id: doc.id });
            });
            return recordings;
        }
        catch (error) {
            console.error('Error getting recordings by score:', error);
            return [];
        }
    }
    async searchRecordingsByText(query, limit = 50) {
        try {
            const allRecordings = await this.getAllRecordings(500);
            const queryLower = query.toLowerCase();
            const filtered = allRecordings.filter((r) => r.reference_text?.toLowerCase().includes(queryLower) ||
                r.transcribed_text?.toLowerCase().includes(queryLower) ||
                r.feedback?.toLowerCase().includes(queryLower));
            return filtered.slice(0, limit);
        }
        catch (error) {
            console.error('Error searching recordings:', error);
            return [];
        }
    }
    async getUserStatistics(userId) {
        try {
            const recordings = await this.getRecordingsByUser(userId, 1000);
            if (recordings.length === 0) {
                return {
                    total_recordings: 0,
                    average_score: 0,
                    best_score: 0,
                    worst_score: 0,
                    improvement_trend: null,
                };
            }
            const scores = recordings.map((r) => r.score || 0);
            let improvementTrend = null;
            if (scores.length >= 10) {
                const recentAvg = scores.slice(0, 5).reduce((a, b) => a + b, 0) / 5;
                const oldAvg = scores.slice(-5).reduce((a, b) => a + b, 0) / 5;
                improvementTrend = Math.round((recentAvg - oldAvg) * 100) / 100;
            }
            return {
                total_recordings: recordings.length,
                average_score: Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 100) / 100,
                best_score: Math.max(...scores),
                worst_score: Math.min(...scores),
                improvement_trend: improvementTrend,
                recent_recordings: recordings.slice(0, 5),
            };
        }
        catch (error) {
            console.error('Error getting user statistics:', error);
            return {
                total_recordings: 0,
                average_score: 0,
                best_score: 0,
                worst_score: 0,
            };
        }
    }
};
exports.FirebaseService = FirebaseService;
exports.FirebaseService = FirebaseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], FirebaseService);
//# sourceMappingURL=firebase.service.js.map