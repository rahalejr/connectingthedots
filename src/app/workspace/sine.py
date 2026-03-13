#!/usr/bin/env python3
"""
Generate three 5-second sine-wave MP3s for a C major triad
in 5-limit just intonation, rooted at middle C (C4).

Ratios:
C : E : G = 1 : 5/4 : 3/2
"""

import math
import struct
from pathlib import Path

# ---------------- Configuration ----------------
DURATION_S = 5.0
SAMPLE_RATE = 44100
BIT_DEPTH = 16
AMPLITUDE = 0.2  # keep low to reduce clipping risk

# Middle C (C4) in Hz (standard equal-tempered value)
C4_HZ = 261.6255653005986

RATIOS = {
    "C4": 1.0,
    "E4": 5 / 4,
    "G4": 3 / 2,
}

OUT_DIR = Path("CMaj")

# ---------------- Synthesis ----------------
def sine_pcm16(freq_hz: float, duration_s: float, sr: int, amp: float) -> bytes:
    n = int(sr * duration_s)
    max_i16 = 32767
    pcm = bytearray()

    for i in range(n):
        t = i / sr
        s = amp * math.sin(2.0 * math.pi * freq_hz * t)
        # hard start/stop by design; no fades
        pcm += struct.pack("<h", int(max_i16 * s))

    return bytes(pcm)

def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    try:
        from pydub import AudioSegment
    except ImportError:
        raise SystemExit(
            "Missing dependency: pydub\n"
            "Install: pip install pydub\n"
            "Also install ffmpeg so MP3 export works (e.g., brew install ffmpeg)."
        )

    for note, ratio in RATIOS.items():
        freq = C4_HZ * ratio
        pcm = sine_pcm16(freq, DURATION_S, SAMPLE_RATE, AMPLITUDE)

        audio = AudioSegment(
            data=pcm,
            sample_width=BIT_DEPTH // 8,
            frame_rate=SAMPLE_RATE,
            channels=1,
        )

        out_path = OUT_DIR / f"{note}_just.mp3"
        audio.export(out_path, format="mp3", bitrate="192k")
        print(f"{note}: {freq:.6f} Hz -> {out_path}")

if __name__ == "__main__":
    main()
