/**
 * TTS 服务：管理文本转语音的音频缓存和播放
 */

class TTSService {
  private audioCache: Map<string, string> = new Map(); // text -> blob URL
  private currentAudio: HTMLAudioElement | null = null;
  private loadingPromises: Map<string, Promise<string>> = new Map();

  /**
   * 获取文本对应的音频 URL（优先使用缓存）
   */
  async getAudioUrl(text: string): Promise<string> {
    // 检查缓存
    if (this.audioCache.has(text)) {
      return this.audioCache.get(text)!;
    }

    // 检查是否正在加载
    if (this.loadingPromises.has(text)) {
      return this.loadingPromises.get(text)!;
    }

    // 创建新的加载 Promise
    const loadingPromise = this.fetchAudio(text);
    this.loadingPromises.set(text, loadingPromise);

    try {
      const url = await loadingPromise;
      this.audioCache.set(text, url);
      return url;
    } finally {
      this.loadingPromises.delete(text);
    }
  }

  /**
   * 从 API 获取音频
   */
  private async fetchAudio(text: string): Promise<string> {
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`TTS API failed: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const blobUrl = URL.createObjectURL(audioBlob);
      
      return blobUrl;
    } catch (error) {
      console.error('Failed to fetch TTS audio:', error);
      throw error;
    }
  }

  /**
   * 播放指定文本的语音
   */
  async play(text: string, onEnd?: () => void, onError?: () => void): Promise<void> {
    try {
      // 停止当前播放
      this.stop();

      // 获取音频 URL
      const audioUrl = await this.getAudioUrl(text);

      // 创建并播放音频
      this.currentAudio = new Audio(audioUrl);
      
      this.currentAudio.onended = () => {
        onEnd?.();
      };

      this.currentAudio.onerror = () => {
        console.error('Audio playback error');
        onError?.();
      };

      await this.currentAudio.play();
    } catch (error) {
      console.error('Failed to play audio:', error);
      onError?.();
      throw error;
    }
  }

  /**
   * 停止当前播放
   */
  stop(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
  }

  /**
   * 检查是否正在播放
   */
  isPlaying(): boolean {
    return this.currentAudio !== null && !this.currentAudio.paused;
  }

  /**
   * 预加载音频（可用于提前缓存）
   */
  async preload(texts: string[]): Promise<void> {
    const promises = texts.map(text => this.getAudioUrl(text).catch(err => {
      console.warn(`Failed to preload audio for: "${text}"`, err);
    }));
    
    await Promise.all(promises);
  }

  /**
   * 清理缓存
   */
  clearCache(): void {
    // 释放所有 blob URLs
    this.audioCache.forEach(url => URL.revokeObjectURL(url));
    this.audioCache.clear();
    this.stop();
  }
}

// 导出单例
export const ttsService = new TTSService();
export default ttsService;
