import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// 硅基流动 TTS API
const SILICONFLOW_API_KEY = process.env.SILICONFLOW_API_KEY;
const API_BASE_URL = 'https://api.siliconflow.cn/v1';

// 创建 OpenAI 客户端（兼容 SiliconFlow）
const client = new OpenAI({
  apiKey: SILICONFLOW_API_KEY,
  baseURL: API_BASE_URL,
});

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();
    
    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    if (!SILICONFLOW_API_KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    // 使用 OpenAI SDK 调用硅基流动 CosyVoice2 TTS
    const response = await client.audio.speech.create({
      model: 'FunAudioLLM/CosyVoice2-0.5B',
      voice: 'FunAudioLLM/CosyVoice2-0.5B:bella' as any, // 清晰女声
      input: text,
      response_format: 'mp3',
    });

    // 获取音频数据
    const audioBuffer = Buffer.from(await response.arrayBuffer());
    
    // 返回音频数据
    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=86400', // 缓存24小时
      },
    });

  } catch (error: any) {
    console.error('TTS Error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error?.message || 'Unknown error',
      details: error?.response?.data || null
    }, { status: 500 });
  }
}
