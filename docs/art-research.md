# アート研究: SimCity BuildIt × Cities: Skylines（2026-07-08 実データ改訂版）

きっかけ: ゼブラ・ガードレールの「リアルさ」を詰める中で、そもそもこのゲームの絵作りの北極星を再確認したくなった（ユーザー発案）。初版（2026-07-07）は仮説ベースだったため、Wikipedia・開発者インタビュー・GDC講演の記録・レビュー記事・コミュニティガイドを一次情報として裏取りし、全面改訂した。

## SimCity BuildIt の世界観（本プロジェクトのアート北極星）

### 出自: SimCity 2013 の「ミニチュア」をそのまま持ち込んだゲーム
- BuildIt は独自の絵作りをしたのではなく、**SimCity (2013) のアセットとグラフィックをモバイル向けにダウンスケールして流用**している（Wikipedia: "It utilizes music and graphics similar to the 2013 SimCity game" / "BuildIt uses many assets from SimCity (2013)"）。つまり北極星の正体は SimCity 2013 のアートディレクションそのもの
- SimCity 2013 のビジュアルの旗印は**チルトシフト（ミニチュア写真）ルック**。クリエイティブディレクターの Ocean Quigley は GDC 2013 講演「Building SimCity: Art in the Service of Simulation」で、アートの仕事を3つに定義した: **(1) 街づくりの道具箱を提供する、(2) 生きた街の錯覚を成立させる、(3) 水面下のシミュレーションで何が起きているかを見せる**。「アートはシミュレーションに仕える」が思想の核
- エンジン設計者 Andrew Willmott の言葉: **"We try to build what you would expect to see, and that's the game"**（見えると期待するものをそのまま建てる）。渋滞・不況・公害は数値ではなく「見える現象」として描く。絵は飾りではなく情報伝達
- Quigley: 街は「機能する模型都市 (functional model city)」であり、**「街に意味を与えるのは動き回る人々」**。建物単体ではなく、動くものが世界を生かす

### レビューが証言する「見た目が最強」
- TouchArcade (4/5): **"BuildIt's strongest facet is its graphics. … Your city is also teeming with life — zoom in and you'll see cars on the street, stoplights, and even traffic jams."** さらに「タイマー待ちの間、ただ街を眺めていたくなる初めてのF2Pゲーム」— **絵そのものがリテンション装置**になっている
- Pocket Gamer (2.5/5、F2P課金は酷評): それでも絵は **"This is a fantastic looking game, with a playfield rich in detail that can be tilted and rotated as you please"** と評価。カメラの自由回転＋チルトはモバイルでも譲らなかった
- 補正すべき初版仮説: 「ディテールは上から見て読めるものだけ」「賑わいは記号的」→ 実際は**ズームインに耐える密度**（信号機・渋滞まで描く）が売り。省略の美学ではなく「寄っても嘘が破綻しないミニチュア」

### 道路と街路の文法
- BuildIt でプレイヤーが引けるのは**2車線道路のみ**。高容量道路は「新規に引く」のではなく**アップグレードで太くする**（Wikipedia）。→ 道路網のトポロジーは常に単純で、絵として破綻しない仕組み
- 母体の SimCity 2013 は**非直交・自由曲線の道路**をシリーズで初導入し、ゾーンが道路の形に沿って変形する。道路ツールは直線・矩形・円弧・円・フリーフォームの5種、**道路密度が建物密度を決める**（道路が主、建物が従）
- SimCity 2013 の実寸: **ストリート幅 24m、アベニュー幅 48m**、都市タイルは 2km 四方。ミニチュアでも道路断面には実数の規格がある
- 地形改変は「神の視点」を廃止し、**土木工学のスケール**でのみ発生（Quigley: 道路を引き、ゾーンを開発し、建物を置いた自然な結果として地形が変わる）

### ミニチュア感の技術
- リアルタイムに街全体を描くため**ファサーディング等のトリック**を多用（Quigley）。建物は単純なブロックから始めて段階的にリッチ化
- UI は **Google Maps とインフォグラフィックスにインスパイア**され、データレイヤー（水・下水・電力・警察）を開くと世界ごと色が変わる。「絵の彩度・単純化」は情報デザインの一部
- 商業的裏付け: BuildIt は Google Play だけで1億DL超、**シリーズ史上最も遊ばれた SimCity**（EA, 2018）。Metacritic 58 でも絵の評価は一貫して高い — 「かわいいミニチュア」は数字が証明した路線

## Cities: Skylines の世界観

### 「道路がゲームの背骨」という設計思想
- Colossal Order は交通シミュレータ Cities in Motion の開発元で、Skylines はその延長。開発目標は**最大100万人の市民の日課をシミュレートし、それを単純な絵でプレイヤーに読ませる**こと
- 開発中の発見: **「街の成長と成功は道路網の敷き方に根本的に紐づく」**。渋滞の視覚表示は「都市設計の問題を最も理解しやすく示すサイン」として意図的に前面化（Wikipedia 開発欄）
- 交通は物理も見る: **坂での速度変化、きついカーブでの減速**までモデル化。その結果、SPUI（シングルポイント都市IC）やDDI（ダイバージングダイヤモンドIC）のような**実在の変則インターチェンジの効率が、ゲーム内で実際に再現される**
- 現実との往復が起きた: ストックホルム市が交通計画に Skylines を使用。ポーランドでは YouTuber がクラクフ近郊の計画中ICをゲームで再現して渋滞・車線変更問題を示し、**道路公団が追加分析の末に実物の設計を変更**した。「ゲーム内の道路文法」が実物の土木に通用した実例

### 絵作り: ベースは漫画寄り、リアリズムは構造で出す
- コミュニティ側の証言（Love Cities: Skylines）: **"By default, Cities: Skylines has quite a cartoony look, probably inspired by 2013's SimCity."** — Skylines 自身も SimCity 2013 のミニチュア路線の子孫。写実はMod（アセット・カラー補正）の領分で、バニラの目標は "realistic" ではなく **"authentic"（本物らしさ）**
- 道路は直線・カーブ・フリーフォームの3ツールで、**ゾーングリッドが道路の形に適応**する（正方格子の義務なし）。並木や防音壁つきのバリアント道路が騒音・地価に効く — 見た目の装飾が同時にゲームメカニクス
- Mod文化が絵を完成させる: リリース1ヶ月で2万アセット、2020年時点で20万超。Node Controller や Precision Engineering のような「**交差点の形を土木的に正しくするためだけのMod**」に需要がある

### コミュニティの「自然に見せるコツ」（定石集）
Love Cities: Skylines のガイドから、バニラで使える定石:
- **地形に従わせる**: 制約のある地形を選び、街を「環境の産物」に見せる（平原に降ってきた宇宙船にしない）
- **グリッドを崩す**: 格子の腕を間引く「alternating grid」、フリーハンドで引く「curved grid」、完全ランダム。均一な 4x4 ブロックの連続を避け、区画サイズを 2x2/3x3/4x2 で揺らす
- **隙間を埋める**: 建物と道路の間に木と岩をばらまくだけで「かなり本物に見える」。公園・小道で均質さを断ち切る
- **勾配の規格**: 橋・トンネルの取り付けは**12ユニット（=最大勾配が滑らかになる距離）を測って引く**。エレベーションステップを下げて自然なランプに
- **高速道路・トンネル・橋は控えめに**: 現実では高価なので乱発しない。「橋の上の橋」は大型IC以外では過剰
- **不完全さを受け入れる**: 実際の街は妥協の産物。作り直さず周囲を馴染ませた方が自然に見える
- 高速の描線規格(Steam定番ガイド): **平行する本線の間隔は4ユニット**（詰めても3）、カーブは「2本の接線の交点」を制御点にした**単一の滑らかな円弧**で引く、ランプは**直結型(Directional)・準直結型(Semi-Directional)・ループ(270°転回)**の3分類で使い分け、トランペットICはこの3種が全部入った教材。きつい曲率は速度低下で罰される

## 本プロジェクトへの示唆（調査で確定した構図）

「BuildIt の見た目 × Skylines の構造」というハイブリッド仮説は、調査の結果**むしろ由緒正しい**ことが分かった。BuildIt も Skylines も同じ祖先（SimCity 2013 のミニチュア路線）を持ち、分岐したのは「絵に何を仕えさせるか」だけ。よって:

1. **「ミニチュアの街に、本物の土木の文法」は矛盾しない** — SimCity 2013 自体が「チルトシフトのミニチュア」と「24m/48mの道路規格・土木スケールの地形」を同居させていた。本家がやっていた同居を、道路側だけ Skylines 水準に深掘りするのが本プロジェクト
2. **絵はシミュレーション（=状態）に仕えさせる** — Quigley の3原則を借りる: 道具箱・生きた街の錯覚・状態の可視化。渋滞や賑わいは「数値でなく見える現象」として描く。動くもの（車・人）こそが街に意味を与える
3. **ズームインに耐えるミニチュア** — BuildIt の絵の強さは省略ではなく「寄っても破綻しない密度」（信号機・渋滞・停止線まで描いて、なお可愛い）。初版仮説の「標示はほぼ描かない」は誤りで、**標示は描いてよい。ただし彩度と丸みの統率下で**
4. **道路はスプラインが正解（裏取り済み）** — SimCity 2013 の5種道路ツールも Skylines の3種ツールも、すべて曲線プリミティブから道路・ゾーン・標示を生成する。板を並べる発想はどの本家にもない。2026-07-07 のレールリボン化は正しい方向
5. **数値に落ちる規格**（今後の実装の物差し）:
   - 道路断面: 生活道路≒24m級 / 幹線≒48m級の2階級を明確に分ける（SimCity 2013 準拠）
   - 高速の平行本線間隔・ランプ分類（直結/準直結/ループ270°）・単一円弧のカーブは Skylines コミュニティ規格に従う（トランペットICは既に文法どおり）
   - 勾配は「12ユニット則」に相当する**一定距離で測った滑らかな取り付け**をランプ・橋に適用
6. **「自然に見せる」最後のひと押しは道路以外にある** — グリッドの間引き・木と岩・不完全さの許容。道路の正確さを上げるほど、周囲の「揺らぎ」がないと模型っぽさが CG っぽさに転ぶ
7. **世界の端・カメラ**: BuildIt が譲らなかったのは「自由回転＋チルトできる、眺めていたくなる盤面」。端の処理より先に「眺める価値のある動き」（車・信号・人）への投資が効く

## 次アクション候補
- [ ] 道路階層「大通り」(road-design.md の宿題): 24m級/48m級の2階級制を導入し、幹線=植樹帯つきバリアント（Skylines 式に「見た目が地価・騒音に効く」体裁）
- [ ] 建物の比率を BuildIt 準拠に再点検（ずんぐり比率は一次情報が薄いままなので、BuildIt のスクリーンショット実測で裏取りしてから）
- [ ] 動くものへの投資: 信号機の点灯サイクル・交差点の停止線で「ズームインに耐える密度」を上げる（TouchArcade が絶賛した要素そのもの）
- [ ] グリッド崩しと植生: 街路の腕の間引き＋建物間の木・岩の散布で「模型のCG化」を防ぐ
- [ ] ランプ・橋の取り付け勾配を「一定距離で滑らかに」の規格化（12ユニット則の移植）
- [ ] チルトシフト風の被写界深度（ズームイン時のみ）— SimCity 2013 の旗印であり優先度維持

## 参照ソース
- SimCity: BuildIt — Wikipedia: https://en.wikipedia.org/wiki/SimCity:_BuildIt
- Cities: Skylines — Wikipedia（開発欄・交通シミュレーション・実世界での利用）: https://en.wikipedia.org/wiki/Cities:_Skylines
- SimCity (2013 video game) — Wikipedia（GlassBox・道路ツール・24m/48m規格・UI設計）: https://en.wikipedia.org/wiki/SimCity_(2013_video_game)
- Video: On SimCity and designing art in service of simulation — Game Developer（Quigley GDC 2013 講演の紹介）: https://www.gamedeveloper.com/design/video-on-i-simcity-i-and-designing-art-in-service-of-simulation
- Building SimCity: Art in the Service of Simulation — GDC Vault: https://gdcvault.com/play/1017823/Building-SimCity-Art-in-the
- Sim City Ocean Quigley Interview — PC Invasion (2013): https://www.pcinvasion.com/sim-city-ocean-quigley-interview/
- 'SimCity BuildIt' Review — TouchArcade (Eric Ford, 2014): https://toucharcade.com/2014/12/23/simcity-buildit-review/
- SimCity BuildIt Review — Pocket Gamer (Matt Thrower, 2014): https://www.pocketgamer.com/simcity-buildit/review/
- Creating Natural, Authentic Looking Cities — Love Cities: Skylines (SEPECAT, 2018): https://www.lovecitiesskylines.com/making-natural-looking-cities/
- How to Draw and Design Highway and Interchange — Steam Community Guide: https://steamcommunity.com/sharedfiles/filedetails/?id=505033395
- Fake Cities, Real Lessons — Nate's Notes (Substack, 2025): https://ntgr.substack.com/p/fake-cities-real-lessons
- Perfect your Cities: Skylines roads with the Node Controller mod — PC Gamer: https://www.pcgamer.com/perfect-your-cities-skylines-roads-with-the-node-controller-mod/

（2024年時点のWikipedia本文はWayback Machine経由で取得。403となるサイトは https://web.archive.org/web/2024/<URL> で参照した）
