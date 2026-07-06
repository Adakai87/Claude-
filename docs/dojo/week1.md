# Godot道場 第1週 — 「箱を動かす」= ゲームループを体感する

## ゴール
Godotをインストールして、3Dの箱を矢印キーで動かす。所要 30〜45分。

## 手順
1. https://godotengine.org/download から自分のOS用の Godot 4.x をダウンロード（無料・インストール不要の実行ファイル）
2. 起動 → 「新規プロジェクト」→ 名前 `dojo1` → 作成
3. シーン画面で「3Dシーン」を選ぶ（ルートに Node3D ができる）
4. ルートを右クリック → 子ノードを追加 で以下を3つ:
   - `MeshInstance3D` … インスペクタの Mesh に「新規 BoxMesh」
   - `Camera3D` … 位置(Transform>Position)を (0, 4, 8)、回転Xを -20 くらい
   - `DirectionalLight3D` … 回転Xを -45
5. MeshInstance3D を選び、右クリック→「スクリプトをアタッチ」→ そのまま作成。中身を下に差し替え:

```gdscript
extends MeshInstance3D

const SPEED := 5.0

func _process(delta):
	var dir := Vector3.ZERO
	if Input.is_action_pressed("ui_up"):    dir.z -= 1
	if Input.is_action_pressed("ui_down"):  dir.z += 1
	if Input.is_action_pressed("ui_left"):  dir.x -= 1
	if Input.is_action_pressed("ui_right"): dir.x += 1
	position += dir.normalized() * SPEED * delta
```

6. F5（実行）→ 最初のシーンに現在のシーンを指定 → 矢印キーで箱が動けば合格！

## 今週の学びポイント
- `_process(delta)` が毎フレーム呼ばれる = これが**ゲームループ**の正体（インプット#1参照）
- `delta` は前のフレームからの経過秒。`速度 × delta` を足すことで、性能が違うPCでも同じ速さで動く——ゲーム開発の超重要イディオム
- 本線のブラウザ版でも、中身はこれと同じことをやっている

## 提出物（チャットに送ってね）
- 動いた箱のスクショ1枚
- 「ここが分からなかった/気持ち悪かった」を1個以上（質問こそが教材になる）
