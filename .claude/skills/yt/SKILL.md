---
name: yt
description: YouTube動画のURLを受け取り、字幕を取得して標準フォーマットで要約しVideo_Knowledgeディレクトリに保存する。
---

# YouTube動画要約スキル（クラウド版）

YouTube動画のURLを受け取り、字幕を取得して要約し、`Video_Knowledge/` に保存する。
クラウド環境ではセッション終了時にファイルが消えるため、**保存後は必ずcommit & pushまで行う**。

## 手順

### 1. video_id の抽出

受け取ったURLから video_id を抽出する。以下の形式に対応すること:

- `https://www.youtube.com/watch?v=<video_id>`
- `https://youtu.be/<video_id>`
- `https://www.youtube.com/shorts/<video_id>`
- `https://www.youtube.com/embed/<video_id>`

### 2. 字幕の取得

**優先手段: youtube-transcript MCP**

`youtube-transcript` MCPサーバーの `get_transcript` を使う。言語は **ja を優先し、失敗したら en** で再試行する。

**フォールバック: yt-dlp**

MCPでの取得に失敗した場合は yt-dlp でVTT字幕を取得する:

```bash
yt-dlp --write-auto-subs --write-subs --skip-download --sub-langs "ja,en" --sub-format vtt "<URL>"
```

取得したVTTファイルから、タイムスタンプ行・`<c>` 等のタグ・重複行を除去してプレーンテキスト化する。

**字幕がない場合**: どちらの手段でも字幕が取得できない動画は、**要約不可であることをユーザーに伝えて中断**する。ファイルは作成しない。

### 3. 要約の作成と保存

保存先: リポジトリ直下 `Video_Knowledge/<sanitized_title>.md`

ファイルのfrontmatter:

```yaml
---
title: <動画タイトル>
url: <動画URL>
video_id: <video_id>
channel: <チャンネル名>
summarized_at: <YYYY-MM-DD>
tags: [<関連タグ>]
---
```

本文の構成:

1. **TL;DR** — 3行
2. **詳細要約** — 章立てで記述
3. **キーポイント** — 箇条書き
4. **自分メモ** — 空欄可

### 4. INDEX.md への追記

`Video_Knowledge/INDEX.md` の「## 動画一覧」セクションに1行追記する（タイトル・リンク・日付など）。
`INDEX.md` が存在しない場合は「## 動画一覧」セクションを持つファイルとして新規作成する。

### 5. ファイル名のサニタイズ

- `!`（半角）と `！`（全角）、および `/ \ : * ? " < > |` を削除
- スペースは `_` に置換
- 80文字以内に切り詰める

### 6. commit & push

保存後は必ず変更をコミットしてプッシュする（クラウド環境ではpushしないとファイルが消えるため）。

```bash
git add Video_Knowledge/
git commit -m "Add video summary: <title>"
git push
```
