import { Injectable } from '@nestjs/common';
import { AppConfigService } from '../../config/config.service';
import OpenAI from 'openai';
import * as fs from 'fs';

@Injectable()
export class OpenaiService {
  private openai: OpenAI;
  private model: string;
  private ttsModel: string;
  private ttsVoice: string;

  constructor(private configService: AppConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.openaiApiKey,
    });
    this.model = this.configService.openaiModel;
    this.ttsModel = this.configService.openaiTtsModel;
    this.ttsVoice = this.configService.openaiTtsVoice;
  }

  async transcribeAudio(audioPath: string, language: string = 'en'): Promise<any> {
    try {
      const audioFile = fs.createReadStream(audioPath);
      
      const transcription = await this.openai.audio.transcriptions.create({
        file: audioFile,
        model: this.model,
        language: language,
        response_format: 'verbose_json',
      });

      return {
        text: transcription.text,
        language: language,
        duration: (transcription as any).duration,
        segments: (transcription as any).segments,
      };
    } catch (error) {
      console.error('Error transcribing audio:', error);
      throw error;
    }
  }

  async generateSpeech(
    text: string,
    voice?: string,
    speed: number = 1.0,
  ): Promise<Buffer> {
    try {
      const selectedVoice = voice || this.ttsVoice;
      
      const mp3 = await this.openai.audio.speech.create({
        model: this.ttsModel,
        voice: selectedVoice as any,
        input: text,
        speed: speed,
      });

      const buffer = Buffer.from(await mp3.arrayBuffer());
      return buffer;
    } catch (error) {
      console.error('Error generating speech:', error);
      throw error;
    }
  }

  async generateSlowSpeech(text: string, voice?: string): Promise<Buffer> {
    return this.generateSpeech(text, voice, 0.75);
  }
}