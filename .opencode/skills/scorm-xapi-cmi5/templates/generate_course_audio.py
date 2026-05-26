"""
Generate AI-narrated model audio for course content using Microsoft Edge TTS.
Matches the portfolio's existing edge_tts pattern.

Usage:
  python generate_course_audio.py

Requires:
  pip install edge-tts
"""
import asyncio
import edge_tts
import os

VOICE = "en-US-AvaMultilingualNeural"
ASSETS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "assets")


async def generate_audio(text, filename, rate="+3%", pitch="+2Hz"):
    communicate = edge_tts.Communicate(text, VOICE, rate=rate, pitch=pitch)
    await communicate.save(filename)
    print(f"  Generated: {os.path.basename(filename)}")


async def main():
    if not os.path.exists(ASSETS_DIR):
        os.makedirs(ASSETS_DIR)

    # ── Define your audio segments here ──
    # Each entry: (filename, text, optional_rate, optional_pitch)

    segments = [
        {{AUDIO_SEGMENTS}}
    ]

    for seg in segments:
        fname, text = seg[0], seg[1]
        rate = seg[2] if len(seg) > 2 else "+3%"
        pitch = seg[3] if len(seg) > 3 else "+2Hz"
        await generate_audio(text, os.path.join(ASSETS_DIR, fname), rate, pitch)

    print("\nDone! All audio files ready.")


if __name__ == "__main__":
    asyncio.run(main())
