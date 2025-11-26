import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: NestConfigService) {}

  get port(): number {
    return this.configService.get<number>('PORT') || 8000;
  }

  get nodeEnv(): string {
    return this.configService.get<string>('NODE_ENV') || 'development';
  }

  get openaiApiKey(): string {
    const key = this.configService.get<string>('OPENAI_API_KEY');
    if (!key) {
      throw new Error('OPENAI_API_KEY is not defined in environment variables');
    }
    return key;
  }

  get openaiModel(): string {
    return this.configService.get<string>('OPENAI_MODEL') || 'whisper-1';
  }

  get openaiTtsModel(): string {
    return this.configService.get<string>('OPENAI_TTS_MODEL') || 'tts-1';
  }

  get openaiTtsVoice(): string {
    return this.configService.get<string>('OPENAI_TTS_VOICE') || 'alloy';
  }

  get firebaseCredentialsPath(): string {
    return this.configService.get<string>('FIREBASE_CREDENTIALS_PATH') || './firebase-credentials.json';
  }

  get corsOrigins(): string[] {
    const origins = this.configService.get<string>('CORS_ORIGINS');
    if (!origins) {
      return ['http://localhost:3000', 'http://localhost:5173'];
    }
    return origins.split(',').map(origin => origin.trim());
  }

  get maxFileSizeMB(): number {
    return this.configService.get<number>('MAX_FILE_SIZE_MB') || 25;
  }

  get maxFileSizeBytes(): number {
    return this.maxFileSizeMB * 1024 * 1024;
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  validateConfig(): void {
    const requiredVars = [
      'OPENAI_API_KEY',
      'FIREBASE_CREDENTIALS_PATH',
    ];

    const missingVars = requiredVars.filter(varName => {
      const value = this.configService.get<string>(varName);
      return !value || value.trim() === '';
    });

    if (missingVars.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missingVars.join(', ')}\n` +
        'Please check your .env file.'
      );
    }

    console.log('✓ Configuration validated successfully');
    console.log(`✓ Environment: ${this.nodeEnv}`);
    console.log(`✓ Port: ${this.port}`);
    console.log(`✓ OpenAI Model: ${this.openaiModel}`);
    console.log(`✓ TTS Model: ${this.openaiTtsModel}`);
    console.log(`✓ Max File Size: ${this.maxFileSizeMB}MB`);
  }
}