import os
import sys
import json
import requests
from pathlib import Path
from dotenv import load_dotenv
from openai import OpenAI

# 尝试导入同目录下的 MP4_to_MP3 模块
try:
    import MP4_to_MP3
except ImportError:
    # 如果直接运行此脚本，需要添加当前目录到 sys.path
    sys.path.append(os.path.dirname(os.path.abspath(__file__)))
    import MP4_to_MP3

# 加载环境变量 (上级目录的 .env.local)
env_path = Path(__file__).parent.parent / '.env.local'
load_dotenv(dotenv_path=env_path)

API_KEY = os.getenv("SILICONFLOW_API_KEY")
if not API_KEY:
    print("错误: 未找到 SILICONFLOW_API_KEY。请确保 .env.local 文件存在且包含 Key。")
    sys.exit(1)

# SiliconFlow 配置
BASE_URL = "https://api.siliconflow.cn/v1"
ASR_MODEL = "FunAudioLLM/SenseVoiceSmall"
LLM_MODEL = "Qwen/Qwen2.5-72B-Instruct" 

client = OpenAI(
    api_key=API_KEY,
    base_url=BASE_URL
)

def transcribe_audio(audio_path):
    """使用 SiliconFlow ASR API 将音频转换为文本"""
    print(f"正在进行语音识别 (Model: {ASR_MODEL})...")
    
    try:
        with open(audio_path, "rb") as audio_file:
            transcription = client.audio.transcriptions.create(
                model=ASR_MODEL,
                file=audio_file,
                response_format="text" # 或者 json
            )
        # 兼容性处理：OpenAI SDK 有时返回对象，有时返回字符串取决于 response_format
        text = transcription if isinstance(transcription, str) else transcription.text
        print("语音识别完成！")
        return text
    except Exception as e:
        print(f"语音识别失败: {e}")
        return None

def generate_lesson_content(transcript):
    """使用 LLM 将文本稿转换为教学 JSON"""
    print(f"正在生成课程内容 (Model: {LLM_MODEL})...")
    
    system_prompt = """
    你是一个专业的教育内容生成助手。你的任务是将一段视频的文字稿（Transcript）转化为结构化的英语教学课程数据。
    
    请严格遵循以下 JSON 结构输出，不要包含 Markdown 代码块标记（如 ```json），直接输出纯 JSON 字符串。
    
    目标 JSON 结构 (TypeScript Interface):
    
    type LessonItem = 
      | { id: string; type: 'story'; content: { english: string; chinese: string; audio: string } }
      | { id: string; type: 'quiz'; content: { question: string; options: string[]; correctAnswer: string; explanation: string } }
      | { id: string; type: 'match'; content: { pairs: { id: string; left: string; right: string }[] } };

    要求：
    1. **Story**: 将文字稿改写为 3-5 段引人入胜的双语故事（English + Chinese translation）。每段代表故事的一个发展阶段。`audio` 字段请填 "mock_audio_generated"。
    2. **Quiz**: 根据故事内容生成 2-3 个选择题。
       - 题目类型可以是：理解细节、词汇释义、或文化背景理解。
       - `correctAnswer` 必须完全匹配 `options` 中的一项。
    3. **Match**: 生成 1 个连线题（Matching Game），提取 4-6 个关键生词或短语及其翻译。
    4. **Language**: 
       - English: 简单、自然、地道。
       - Chinese: 现代、口语化、贴合上下文。
    
    请确保输出是一个 LessonItem 对象的数组: LessonItem[]
    """

    user_prompt = f"这是视频的文字稿：\n\n{transcript}\n\n请生成对应的课程 JSON 数据。"

    try:
        response = client.chat.completions.create(
            model=LLM_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.7,
            max_tokens=4096
        )
        content = response.choices[0].message.content
        
        # 清理可能存在的 markdown 标记
        content = content.replace("```json", "").replace("```", "").strip()
        
        return json.loads(content)
    except Exception as e:
        print(f"内容生成失败: {e}")
        return None

def main():
    if len(sys.argv) < 2:
        print("用法: python generate_lesson.py <video_file_path>")
        sys.exit(1)

    video_path = sys.argv[1]
    
    if not os.path.exists(video_path):
        print(f"错误: 文件不存在 {video_path}")
        sys.exit(1)

    print(f"=== 开始处理视频: {os.path.basename(video_path)} ===")

    # 1. 提取音频
    print("步骤 1/3: 提取音频...")
    audio_path = MP4_to_MP3.convert_mp4_to_audio(video_path)
    if not audio_path:
        print("音频提取失败，终止。")
        sys.exit(1)

    # 2. 语音转文字 (ASR)
    print("步骤 2/3: 语音转文字...")
    transcript = transcribe_audio(audio_path)
    if not transcript:
        print("转录失败，终止。")
        sys.exit(1)
    
    print(f"\n--- 识别到的文本片段 ({len(transcript)} 字) ---")
    print(transcript[:200] + "..." if len(transcript) > 200 else transcript)
    print("------------------------------------------\n")

    # 3. 生成课程内容 (LLM)
    print("步骤 3/3: AI 生成课程数据...")
    lesson_data = generate_lesson_content(transcript)
    
    if lesson_data:
        output_filename = f"lesson_{Path(video_path).stem}.json"
        output_path = Path(video_path).parent / output_filename
        
        # 为了演示，也保存到当前目录一份
        local_output_path = Path(__file__).parent / output_filename
        
        with open(local_output_path, "w", encoding="utf-8") as f:
            json.dump(lesson_data, f, ensure_ascii=False, indent=2)
            
        print(f"\n✅ 成功！课程数据已保存至: {local_output_path}")
        print("你可以直接复制这个 JSON 到 lib/data.ts 中使用。")
    else:
        print("生成失败。")

    # 清理临时音频文件
    try:
        os.remove(audio_path)
        print("(已清理临时音频文件)")
    except:
        pass

if __name__ == "__main__":
    main()
