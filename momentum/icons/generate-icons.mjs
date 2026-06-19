#!/usr/bin/env node
/**
 * MOMENTUM — PWA アイコン生成（ネット非依存・Node標準ライブラリのみ）
 *
 * 深宇宙のグラデーション + 上昇するコメット（勢い/Momentum の象徴）を
 * ピクセル単位で描画し、PNG として書き出す。
 *
 *   node generate-icons.mjs
 */
import zlib from 'node:zlib';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/* ---------- PNG エンコーダ ---------- */
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}
function encodePNG(w, h, rgba) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;   // bit depth
  ihdr[9] = 6;   // color type RGBA
  const raw = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) {
    raw[y * (w * 4 + 1)] = 0; // filter: none
    rgba.copy(raw, y * (w * 4 + 1) + 1, y * w * 4, (y + 1) * w * 4);
  }
  const idat = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))]);
}

/* ---------- 描画ヘルパ ---------- */
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
function mix(c1, c2, t) {
  return [lerp(c1[0], c2[0], t), lerp(c1[1], c2[1], t), lerp(c1[2], c2[2], t)];
}
// 線分への距離
function distToSeg(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay;
  const l2 = dx * dx + dy * dy || 1e-9;
  let t = ((px - ax) * dx + (py - ay) * dy) / l2;
  t = clamp(t, 0, 1);
  const cx = ax + t * dx, cy = ay + t * dy;
  return { d: Math.hypot(px - cx, py - cy), t };
}

const VIOLET = [139, 92, 246];
const CYAN = [34, 211, 238];
const PINK = [244, 114, 182];
const DEEP1 = [26, 16, 51];  // 上部
const DEEP2 = [8, 8, 16];    // 下部 #080810

function render(size, opaque = false) {
  const buf = Buffer.alloc(size * size * 4);
  // コメット軌道（正規化座標）: 左下 → 右上
  const ax = 0.30, ay = 0.78, bx = 0.74, by = 0.26;
  // オーロラ・グローの中心
  const gx = 0.66, gy = 0.34;
  // 星（小さな点）
  const stars = [
    [0.20, 0.28, 0.012], [0.82, 0.70, 0.010], [0.30, 0.50, 0.007],
    [0.58, 0.62, 0.008], [0.78, 0.46, 0.006],
  ];

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = x / (size - 1);
      const v = y / (size - 1);

      // 背景：縦グラデ + 斜めの陰影
      let base = mix(DEEP1, DEEP2, clamp(v * 0.9 + (u) * 0.15, 0, 1));

      // オーロラ・グロー（放射状）
      const gd = Math.hypot((u - gx) * 1.05, (v - gy));
      const glow = Math.exp(-Math.pow(gd / 0.42, 2));
      const auroraCol = mix(VIOLET, CYAN, clamp((u - 0.3) / 0.5 + (gy - v), 0, 1));
      base = mix(base, auroraCol, glow * 0.55);

      // 星
      let starAdd = 0;
      for (const [sx, sy, sr] of stars) {
        const sd = Math.hypot(u - sx, v - sy);
        starAdd += Math.exp(-Math.pow(sd / sr, 2)) * 0.9;
      }
      base = [base[0] + 255 * starAdd, base[1] + 255 * starAdd, base[2] + 255 * starAdd];

      // コメット軌道
      const { d, t } = distToSeg(u, v, ax, ay, bx, by);
      // トレイル幅：頭(t=1)に向かって太く
      const width = lerp(0.010, 0.060, t);
      const trail = Math.exp(-Math.pow(d / width, 2));
      // トレイル色：尾=violet → 中=cyan → 頭=white
      let trailCol = t < 0.6 ? mix(VIOLET, CYAN, t / 0.6) : mix(CYAN, [255, 255, 255], (t - 0.6) / 0.4);
      const trailIntensity = trail * lerp(0.35, 1.0, t);
      base = mix(base, trailCol, clamp(trailIntensity, 0, 1));

      // コメットの頭（明るいコア + ハロー）
      const hd = Math.hypot(u - bx, v - by);
      const core = Math.exp(-Math.pow(hd / 0.045, 2));
      const halo = Math.exp(-Math.pow(hd / 0.14, 2)) * 0.6;
      base = mix(base, [255, 255, 255], clamp(core, 0, 1));
      base = mix(base, CYAN, clamp(halo * (1 - core), 0, 1));

      // ビネット（端を少し落として宇宙感）
      const vd = Math.hypot(u - 0.5, v - 0.5);
      const vig = clamp(1 - Math.pow(vd / 0.85, 2.2) * 0.5, 0, 1);
      base = [base[0] * vig, base[1] * vig, base[2] * vig];

      const i = (y * size + x) * 4;
      buf[i] = clamp(Math.round(base[0]), 0, 255);
      buf[i + 1] = clamp(Math.round(base[1]), 0, 255);
      buf[i + 2] = clamp(Math.round(base[2]), 0, 255);
      buf[i + 3] = 255; // 不透明（maskable / apple 両対応のため全面塗り）
    }
  }
  return encodePNG(size, size, buf);
}

const targets = [
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
  { name: 'maskable-512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
];
for (const t of targets) {
  const png = render(t.size);
  fs.writeFileSync(path.join(__dirname, t.name), png);
  console.log(`✓ ${t.name} (${t.size}x${t.size}, ${png.length} bytes)`);
}
console.log('done.');
