# Fabriq — 社内ワークスペース

> プロジェクトとチャンネルで動く、足立 開の“社内ツール”。
> Slackのように **チャンネルでやり取り** しながら、**プロジェクトを盤で管理** する。
> ローカル（リモート操作中のPC）にあった構想を、**二度と消えないGitHub上の本体** として作り直したもの。

🔗 ローカルで開く: `fabriq/index.html` をブラウザで開くだけ（ビルド不要）

---

## 🎯 何ができる

- **チャンネル** — `#general` `#momentum` `#ideas` `#random`。メッセージ投稿（端末内 localStorage に保存）。`＋`で追加。
- **プロジェクト盤** — 各プロジェクトをカードで一覧。専用チャンネルが紐づく。`＋`で追加（チャンネルも自動作成）。
- **メンバー** — 人＋AIクルー（planning / creative / backoffice）でチームを表現。

## ☄️ MOMENTUM を“最初のプロジェクト”として同梱

埋もれさせないために、MOMENTUM を **Project #1 + 専用 `#momentum` チャンネル** として最初から登録済み。

- チャンネル上部にプロジェクトがピン留めされ、**「アプリを開く ↗」** から同リポジトリの本体（`../momentum/`）へ直行。
- ステータス（開発中・Phase1完成）、オーナー、説明、関連リンクをカードで管理。

## 🎨 デザイン

MOMENTUM と同じ **“Cosmic Ascent”**（深宇宙 `#080810` ＋オーロラ violet→cyan、グラスモーフィズム、星空）。
社内ツール群としての世界観を統一。

## 🗂️ 構成

```
fabriq/
└── index.html   単一ファイル（HTML+CSS+JS）。依存ゼロ・バニラJS・localStorage 永続化。
```

## 🚀 公開（GitHub Pages）

このリポジトリは `gh-pages` ブランチを Pages に配信する設定（`.github/workflows/deploy-pages.yml`）。
`fabriq/` 一式を `gh-pages` に置けば `https://<user>.github.io/<repo>/fabriq/` で公開されます
（MOMENTUM は `…/momentum/`）。

## 🔁 本物のローカル版が出てきたら

リモート操作中のPCに既存の Fabリク実体が見つかったら、そのデータモデル／UIをこの本体に統合・差し替え可能。
現状は **動く土台（v0）** として、いつでも使える状態にしてあります。
