# 🔥 推しリマインダー — Screen Time Reminder

特定のアプリ／サイトを **見すぎたら、好きなキャラ（熱血コーチ・猫・犬・フクロウ・自分の推し）が画面に登場** して、大事なことに気づかせてくれるアプリです。

> 「おい！その手を止めろ！今こそ熱くなる時だ！🔥」

PC と スマホ、両方で使えるように **2つのアプリ** を同梱しています。

| 対象 | 中身 | 場所 | 状態 |
|---|---|---|---|
| 💻 **PC** | Chrome/Edge ブラウザ拡張機能 | [`extension/`](./extension) | ✅ 今すぐ動く（サイト別に実時間を計測） |
| 📱 **スマホ** | PWA（ホーム画面に追加できるWebアプリ） | [`mobile/`](./mobile) | ✅ 今すぐ動く（タイマー＋自アプリ利用時間） |
| 🧩 共通 | キャラ定義・名言・オーバーレイ表示 | [`shared/`](./shared) | — |

---

## 💻 PC版（ブラウザ拡張）の使い方

YouTube / X / Instagram / TikTok などを、設定した分数より長く見ていると、
そのタブの上に推しが全画面で登場します。

### インストール（開発者モード）
1. Chrome か Edge を開く
2. アドレスバーに `chrome://extensions`（Edgeは `edge://extensions`）と入力
3. 右上の **「デベロッパーモード」** をON
4. **「パッケージ化されていない拡張機能を読み込む」** をクリック
5. この `extension/` フォルダを選択

### 設定
- ツールバーのアイコンをクリック → 今日の利用時間が見られます
- **「⚙ 設定を開く」** から:
  - キャラクターの選択（熱血コーチ / 猫 / 犬 / フクロウ / 自分の推し）
  - 監視サイトと上限（分）の追加・編集
  - 「あと5分だけ」を押した後の再登場間隔
  - 自分の推し画像URL＆自作の名言

### 仕組み
- アクティブなタブのドメインと滞在時間を1分ごと＋イベントごとに集計
- 監視対象サイトの「今日の合計」が上限を超えると、そのタブに推しを表示
- 日付が変わると自動でリセット（データは端末内 `chrome.storage.local` のみ。外部送信なし）

---

## 📱 スマホ版（PWA）の使い方

### 起動
- `mobile/index.html` を Web サーバー経由で開きます（ローカル例）:
  ```bash
  cd mobile
  python3 -m http.server 8000
  # スマホから同じWi-Fiで http://<PCのIP>:8000 を開く
  ```
  ※ Service Worker / 通知は `https` か `localhost` でのみ動きます。
  公開するなら GitHub Pages / Netlify / Vercel 等に `mobile/` を置くのが簡単です。
- 開いたら **「ホーム画面に追加」** でアプリのように使えます。

### できること
- リマインダー時間（1/15/30/60分）をセットして **スタート** → 経過したら推しが全画面登場＋通知＋バイブ
- アプリを前面で見ている時間も計測
- キャラ選択・自分の推し画像・自作名言（端末内 `localStorage` に保存）
- 「👀 今すぐ登場をプレビュー」で見た目を確認

### スマホの「他アプリ監視」について（重要）
ブラウザ／PWA からは、**他のアプリ（例: 純正のTikTokアプリ）の利用時間を裏で測ることはOSの制約でできません。**
- iOS … Screen Time / DeviceActivity API（特別なエンタイトルメントが必要）
- Android … `UsageStatsManager`（「使用状況へのアクセス」権限が必要）

そのため第一弾は「自アプリ＋タイマー」で “見すぎ通知” を体験できる形にしています。
**本格的に他アプリも監視したい場合のネイティブ化メモ** を下に置きました。

---

## 🚀 ネイティブ化ロードマップ（他アプリ監視をやるなら）

### Android（実現しやすい）
- `UsageStatsManager` で各アプリの前面利用時間を取得
- フォアグラウンドサービスで一定間隔ポーリング
- 上限超過で `SYSTEM_ALERT_WINDOW`（他アプリの上に表示）権限を使い、
  このリポジトリの `overlay.css` / `overlay.js` をそのまま WebView で表示
- 推奨スタック: Kotlin、または React Native + ネイティブモジュール

### iOS（制約が大きい）
- `FamilyControls` / `DeviceActivity` / `ManagedSettings`（Screen Time API）
- アプリ単位のしきい値を `DeviceActivityMonitor` で監視し、`ShieldConfiguration` で
  カスタム画面（推しの画像＋名言）を表示
- 個人開発でも利用可だが、配布には Apple の審査と特別な許可が必要

> どちらも UI（キャラ・名言・オーバーレイ）は `shared/` をそのまま流用できる設計です。

---

## 🗂 構成

```
screen-time-reminder/
├── shared/        … キャラ定義(characters.js)・名言・オーバーレイ(overlay.js/css) の正本
├── extension/     … PC用 Chrome拡張(MV3)。shared のコピーを同梱
└── mobile/        … スマホ用 PWA。shared のコピーを同梱
```

`shared/` がキャラ・UIの正本です。編集したら `extension/` と `mobile/` にコピーしてください:
```bash
cp shared/characters.js extension/ && cp shared/characters.js mobile/
cp shared/overlay.js   extension/ && cp shared/overlay.js   mobile/
cp shared/overlay.css  extension/ && cp shared/overlay.css  mobile/
```

---

## 🎭 キャラクターと名言について
- 同梱の名言は「松岡修造さん風の熱血テイスト」の **オリジナル文** です。
- 実在の人物の写真・実際の発言をそのまま使うと著作権／肖像権の問題があるため、
  画像は **「自分の推し」キャラでユーザーが自分で用意したURLを設定** する方式にしています。

---

## 🔒 プライバシー
- 利用時間データは **端末内にのみ保存**（拡張: `chrome.storage.local` / PWA: `localStorage`）。
- 外部サーバーへの送信は一切ありません。
