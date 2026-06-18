# 診断結果ドリンクの「実写写真」スロット

このフォルダに画像を置くと、診断結果ページのドリンクが **自動で実写写真に差し替わります**。
置かなければ現状の CG 風レンダリングのまま（フォールバック）なので、用意できたタイプから順に差し込めます。

## 使い方
1. 下表の16枚を用意する（撮影 もしくは 画像生成AI：Adobe Firefly / DALL·E / Midjourney / Google ImageFX など）
2. **JPEG / PNG / WebP** いずれかで、ファイル名は **「タイプコード.拡張子」**（例: `KBPF.jpg`）にする
3. このフォルダ（`fizz/img/drinks/`）に置く → 置いた瞬間に反映（要リロード）
4. 推奨スペック：**縦4:5（例 1080×1350px）／被写体センター／背景は暗め**（結果カードに馴染みます）

> 🟣 **現在は各フレーバー色の「仮プレースホルダ画像（`<CODE>.png`）」が入っています。**
> 同じコードの `.jpg` を置けば、そちらが優先表示されます（探索順：`jpg → png → webp`）。
> 本物写真ができたら png を消す or jpg で上書きでOK。

> ⚠️ 権利メモ：本家フルーティス／コカ・コーラの**公式写真の流用は不可**。
> 「世界観の参照」はOKですが、実データは 撮影 / AI生成 / 許諾済み素材 を使ってください。

---

## 共通スタイル（各プロンプトの先頭に付ける）
```
Professional advertising beverage photography, photorealistic, ultra-detailed,
a tall clear highball glass, sparkling Coca-Cola–based drink, plenty of clear ice cubes,
water condensation droplets on the glass, fine rising bubbles, dramatic dark studio backdrop
with deep Coca-Cola red rim light and soft glow, 100mm macro, shallow depth of field,
glossy, vibrant, high contrast, centered product, vertical 4:5 --no text, logo, watermark, hands
```

## 16タイプ別（共通スタイル＋下記を足す）

| ファイル名 | タイプ / ドリンク | 追加プロンプト |
|---|---|---|
| `KTPF.jpg` | ご褒美ストロング / ディープ・ルビーコーク | deep ruby-crimson cola, blackberry and pomegranate-seed garnish, luxe late-night mood |
| `KTPD.jpg` | 黄金比の探求者 / パーフェクト・レモンコーク | classic amber cola, a crisp lemon wheel garnish, precise and clean |
| `KTGF.jpg` | 場をアゲる着火剤 / パーティ・ストロングベリー | vivid magenta-red mixed-berry cola, cherry and mixed berries garnish, festive splash |
| `KTGD.jpg` | 乾杯の演出家 / ゴールデン・パインコーク | golden amber pineapple cola, pineapple wedge and leaf garnish, glamorous toast |
| `KBPF.jpg` | 実験室の変人天才 / ミッドナイト・グレープ | deep purple grape cola, fresh purple grape cluster garnish, moody midnight mood |
| `KBPD.jpg` | 孤高のミクソロジスト / ブルー・エレクトリック | electric blue-violet cola (zero sugar), blueberries garnish, sleek and cool |
| `KBGF.jpg` | 未知数のエンタメ番長 / トロピカル・サンダー | bright golden tropical pineapple cola, pineapple and lemon garnish, energetic splash |
| `KBGD.jpg` | 攻めの仕掛け人 / マスカット・ハイボルテージ | bright green-gold muscat cola, mint sprig and green grapes garnish, high-energy |
| `RTPF.jpg` | 自分時間の名人 / ピーチ・リラックスコーク | soft peachy-amber cola (zero sugar), white peach slice garnish, calm and cozy |
| `RTPD.jpg` | 丁寧な暮らしの達人 / ハニーレモン・スロウ | pale golden honey-lemon cola (zero sugar), lemon wheel and honey drizzle, serene |
| `RTGF.jpg` | みんなのオアシス / ストロベリー・スマイル | bright pink-red strawberry cola, fresh strawberry garnish, cute and warm |
| `RTGD.jpg` | やさしい幹事 / 王林クリア・クーラー | pale clear green-apple cola (zero sugar), green apple slice garnish, transparent and fresh |
| `RBPF.jpg` | ゆるふわ冒険家 / ゆずミント・フィズ | yellow-green yuzu cola, yuzu peel and mint garnish, refreshing and artisanal |
| `RBPD.jpg` | 隠れこだわりの研究員 / バナナ・ベルベット | creamy tan banana cola, banana slice garnish, velvety smooth, soft light |
| `RBGF.jpg` | ハッピー拡散マシン / レインボー・ベリーフロート | pink-red berry cola float topped with a vanilla ice-cream scoop and a cherry, playful and colorful |
| `RBGD.jpg` | 癒しのプロデューサー / マスカット・ピーチ・スプリッツ | layered muscat-green to peach gradient cola (zero sugar), muscat and peach garnish, elegant two-tone |

---

## 仕組み（参考）
- 表示ロジック：`script.js` の `renderResult()` が `img/drinks/<CODE>.jpg` を読み込み、成功したら写真表示（`.rec-visual.has-photo`）、失敗したら CG 風レンダリングにフォールバック。
- シェアカード（保存画像）は仕様どおり**現状のまま**（このスロットは結果ページの表示のみ差し替え）。
