# Video to Lesson Pipeline

这是一个独立的后端工具，用于演示如何从 MP4 视频自动生成结构化的英语学习课程数据。

## 功能

1.  **视频转音频**: 使用 `ffmpeg` 或 `moviepy` 从 MP4 提取 MP3。
2.  **语音识别 (ASR)**: 使用 SiliconFlow API (`FunAudioLLM/SenseVoiceSmall`) 将音频转为文字。
3.  **智能生成 (LLM)**: 使用 SiliconFlow API (`Qwen/Qwen2.5-72B-Instruct`) 将文字整理为 Story/Quiz/Match 格式的 JSON 数据。

## 环境准备

1.  确保项目根目录有 `.env.local` 文件，并包含 SiliconFlow Key:
    ```
    SILICONFLOW_API_KEY=sk-xxxxxx
    ```

2.  安装 Python 依赖:
    ```bash
    cd backend_pipeline
    pip install -r requirements.txt
    ```
    *(建议使用虚拟环境)*

3.  系统需安装 `ffmpeg` (如果使用 ffmpeg 模式):
    ```bash
    sudo apt install ffmpeg  # Linux
    ```

## 使用方法

在 `backend_pipeline` 目录下运行:

```bash
python generate_lesson.py <path_to_video_file>
```

**示例:**

```bash
python generate_lesson.py ../public/videos/367185444.mp4
```

运行成功后，会在当前目录生成 `lesson_367185444.json`，您可以直接将其内容复制到前端项目的 `lib/data.ts` 中。
