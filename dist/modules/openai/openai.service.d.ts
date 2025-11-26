import { ConfigService } from '@nestjs/config';
export declare class OpenaiService {
    private configService;
    private openai;
    private model;
    private ttsModel;
    private ttsVoice;
    constructor(configService: ConfigService);
    transcribeAudio(audioPath: string, language?: string): Promise<any>;
    generateSpeech(text: string, voice?: string, speed?: number): Promise<Buffer>;
    generateSlowSpeech(text: string, voice?: string): Promise<Buffer>;
}
