import os
import sys
from pathlib import Path

def convert_mp4_to_audio_moviepy(input_path, output_path=None, audio_format='mp3'):
    """
    使用moviepy将MP4文件转换为音频文件
    
    Args:
        input_path (str): 输入的MP4文件路径
        output_path (str, optional): 输出的音频文件路径，默认为None（自动生成）
        audio_format (str): 输出音频格式，默认为'mp3'
    
    Returns:
        str: 转换后的音频文件路径
    """
    try:
        # 导入moviepy库 - 修正导入方式
        from moviepy import VideoFileClip
        
        # 检查输入文件是否存在
        if not os.path.exists(input_path):
            raise FileNotFoundError(f"输入文件不存在: {input_path}")
        
        # 检查输入文件扩展名
        if not input_path.lower().endswith('.mp4'):
            raise ValueError("输入文件必须是MP4格式")
        
        # 创建VideoFileClip对象
        video_clip = VideoFileClip(input_path)
        
        # 提取音频
        audio_clip = video_clip.audio
        
        # 如果没有指定输出路径，则自动生成
        if output_path is None:
            input_path_obj = Path(input_path)
            output_path = input_path_obj.with_suffix(f'.{audio_format}')
        
        # 写入音频文件
        audio_clip.write_audiofile(output_path)
        
        # 关闭clip对象以释放资源
        audio_clip.close()
        video_clip.close()
        
        print(f"使用moviepy转换成功！音频文件已保存至: {output_path}")
        return output_path
        
    except ImportError:
        print("错误：未安装moviepy库。请运行 'pip install moviepy' 安装依赖。")
        return None
    except Exception as e:
        print(f"转换过程中发生错误: {str(e)}")
        return None


def convert_mp4_to_audio_ffmpeg(input_path, output_path=None, audio_format='mp3'):
    """
    使用ffmpeg将MP4文件转换为音频文件（备用方案）
    
    Args:
        input_path (str): 输入的MP4文件路径
        output_path (str, optional): 输出的音频文件路径，默认为None（自动生成）
        audio_format (str): 输出音频格式，默认为'mp3'
    
    Returns:
        str: 转换后的音频文件路径
    """
    try:
        import subprocess
        
        # 检查输入文件是否存在
        if not os.path.exists(input_path):
            raise FileNotFoundError(f"输入文件不存在: {input_path}")
        
        # 检查输入文件扩展名
        if not input_path.lower().endswith('.mp4'):
            raise ValueError("输入文件必须是MP4格式")
        
        # 如果没有指定输出路径，则自动生成
        if output_path is None:
            input_path_obj = Path(input_path)
            output_path = input_path_obj.with_suffix(f'.{audio_format}')
        
        # 构建ffmpeg命令
        cmd = [
            'ffmpeg',
            '-i', input_path,  # 输入文件
            '-vn',  # 不包含视频
            '-acodec', 'copy' if audio_format in ['m4a', 'aac'] else 'mp3',  # 音频编码
            '-y',  # 覆盖输出文件
            output_path
        ]
        
        # 执行命令
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode != 0:
            print(f"FFmpeg错误: {result.stderr}")
            # 尝试使用更通用的编码
            cmd[-2] = 'mp3' if audio_format != 'mp3' else 'aac'
            result = subprocess.run(cmd, capture_output=True, text=True)
            if result.returncode != 0:
                print(f"转换失败: {result.stderr}")
                return None
        
        print(f"使用ffmpeg转换成功！音频文件已保存至: {output_path}")
        return output_path
        
    except FileNotFoundError:
        print("错误：未找到ffmpeg。请安装ffmpeg并添加到系统PATH，或使用 'pip install ffmpeg-python' 安装Python包装器。")
        return None
    except Exception as e:
        print(f"转换过程中发生错误: {str(e)}")
        return None


def convert_mp4_to_audio(input_path):
    """
    将MP4文件转换为音频文件（主函数，使用默认参数）
    
    Args:
        input_path (str): 输入的MP4文件路径
    
    Returns:
        str: 转换后的音频文件路径
    """
    audio_format = 'mp3'  # 默认音频格式
    output_path = None    # 自动生成输出路径
    method = 'auto'       # 自动选择转换方法
    
    if method == 'moviepy' or method == 'auto':
        result = convert_mp4_to_audio_moviepy(input_path, output_path, audio_format)
        if result:
            return result
        elif method == 'moviepy':
            return None
    
    if method == 'ffmpeg' or method == 'auto':
        result = convert_mp4_to_audio_ffmpeg(input_path, output_path, audio_format)
        if result:
            return result
    
    print("所有转换方法都失败了。请确保已安装所需依赖。")
    print("选项1: pip install moviepy")
    print("选项2: 安装ffmpeg并添加到系统PATH")
    return None


def main():
    """主函数，演示如何使用转换功能"""
    print("MP4到音频转换器")
    print("="*50)
    
    # 获取用户输入
    input_file = input("请输入MP4文件路径: ").strip().strip('"\'')
    
    if not input_file:
        print("未提供输入文件路径")
        return
    
    if not os.path.exists(input_file):
        print(f"错误：文件不存在: {input_file}")
        return
    
    print(f"\n正在将 {input_file} 转换为 mp3 格式...")
    
    # 执行转换（使用默认参数）
    result = convert_mp4_to_audio(input_file)
    
    if result:
        print(f"\n转换完成！")
        print(f"输出文件: {result}")
    else:
        print("\n转换失败！")
        print("\n请尝试以下解决方案：")
        print("1. 安装moviepy: pip install moviepy")
        print("2. 安装ffmpeg并添加到系统PATH")
        print("3. 使用在线转换工具")


if __name__ == "__main__":
    main()