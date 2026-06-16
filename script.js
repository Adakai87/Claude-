/* =========================================================
   Coca-Cola × フルーティス  FIZZ診断
   16タイプ診断エンジン
   軸: K(刺激)/R(癒し) · T(定番)/B(冒険) · P(ソロ)/G(みんな) · F(直感)/D(こだわり)
   ========================================================= */
(function () {
    'use strict';

    /* ---------------- フレーバー ---------------- */
    const FLAVORS = {
        pom: { name: 'ザクロ&ブラックベリー', c1: '#E11D55', c2: '#7A0E3A', emoji: '🫐' },
        grape: { name: '国産ぶどう', c1: '#9B4DF0', c2: '#3F1A78', emoji: '🍇' },
        straw: { name: 'あまおう苺', c1: '#FF4D6D', c2: '#A11241', emoji: '🍓' },
        muscat: { name: 'マスカット', c1: '#9BE000', c2: '#3E7A00', emoji: '🍈' },
        lemon: { name: 'レモン&はちみつ', c1: '#FFC83D', c2: '#C98A00', emoji: '🍋' },
        pine: { name: 'パイナップル', c1: '#FFB733', c2: '#C97A00', emoji: '🍍' },
        berry: { name: 'ミックスベリー', c1: '#FF3DAE', c2: '#8E0A5B', emoji: '🍒' },
        peach: { name: '白桃', c1: '#FF8FA3', c2: '#D45A77', emoji: '🍑' },
        blue: { name: 'ブルーベリー', c1: '#5470FF', c2: '#1A2C8E', emoji: '🫐' },
        aoringo: { name: '王林（青りんご）', c1: '#7BE36B', c2: '#2E7A1F', emoji: '🍏' },
        yuzu: { name: 'ゆず&レモン', c1: '#E3E34D', c2: '#9AA300', emoji: '🍋' },
        banana: { name: '完熟バナナ', c1: '#FFD96B', c2: '#C9A23A', emoji: '🍌' }
    };

    /* ---------------- 設問（全10問） ---------------- */
    const QUESTIONS = [
        {
            text: '今日のしめくくり、あなたが欲しいのは？',
            options: [
                { emoji: '🔥', label: 'ガツンと刺激的な一杯で気分を切り替えたい', sub: '強めの刺激でリセット', w: { K: 2 } },
                { emoji: '🛋️', label: 'ほっと甘い一杯で、ゆるゆる脱力したい', sub: 'やさしい甘さで充電', w: { R: 2 } }
            ]
        },
        {
            text: '新しいお店、まず頼むのは？',
            options: [
                { emoji: '⭐', label: '間違いない“いつもの”王道メニュー', sub: '安定の満足を選ぶ', w: { T: 2 } },
                { emoji: '🎲', label: '名前も味も謎な、限定メニュー', sub: '知らない味に賭ける', w: { B: 2 } }
            ]
        },
        {
            text: '理想の休日の過ごし方は？',
            options: [
                { emoji: '🎧', label: '誰にも邪魔されない“ひとり時間”', sub: '自分の世界に没頭', w: { P: 2 } },
                { emoji: '🎈', label: '友達とワイワイ、予定を詰め込む', sub: 'みんなでにぎやかに', w: { G: 2 } }
            ]
        },
        {
            text: 'ドリンクや料理を作るとき、分量は？',
            options: [
                { emoji: '👃', label: 'だいたいで、その日の気分まかせ', sub: '感覚でととのえる', w: { F: 2 } },
                { emoji: '⚖️', label: 'きっちり計って、毎回同じ味に', sub: '数字で再現する', w: { D: 2 } }
            ]
        },
        {
            text: '好きな炭酸の強さは？',
            options: [
                { emoji: '⚡', label: '喉に刺さる“強炭酸”がたまらない', sub: '刺激は強いほどいい', w: { K: 2 } },
                { emoji: '🫧', label: 'やさしく弾ける“微炭酸”が好き', sub: 'ほどける泡が好き', w: { R: 2 } }
            ]
        },
        {
            text: '旅行で行きたいのは？',
            options: [
                { emoji: '🗼', label: '定番の人気スポットを全制覇', sub: 'ハズさない王道', w: { T: 2 } },
                { emoji: '🧭', label: 'ガイドに載ってない路地裏探検', sub: '未知へ踏み込む', w: { B: 2 } }
            ]
        },
        {
            text: 'SNSとの付き合い方は？',
            options: [
                { emoji: '🔖', label: '見る専・自分の記録用', sub: 'そっと楽しむ', w: { P: 2 } },
                { emoji: '📣', label: 'シェア＆コメントで盛り上げ役', sub: 'みんなと共有', w: { G: 2 } }
            ]
        },
        {
            text: '買い物の決め方は？',
            options: [
                { emoji: '💘', label: 'ピンと来たら、即決', sub: '直感を信じる', w: { F: 2 } },
                { emoji: '🔍', label: '比較とレビューを熟読してから', sub: '納得してから動く', w: { D: 2 } }
            ]
        },
        {
            text: '人生で大事にしたいのは、どっち？',
            options: [
                { emoji: '🚀', label: '刺激と挑戦、心が躍るほうへ', sub: 'ワクワク優先', w: { K: 2, B: 1 } },
                { emoji: '🌿', label: '安心と心地よさ、ととのう時間', sub: '心の平穏優先', w: { R: 2, T: 1 } }
            ]
        },
        {
            text: '乾杯の瞬間、あなたはどうしてる？',
            options: [
                { emoji: '📸', label: 'みんなのグラスを演出して、写真もばっちり', sub: '場を仕上げる', w: { G: 2, D: 1 } },
                { emoji: '😋', label: '自分のペースで「うまっ」と一口', sub: '直感で味わう', w: { P: 2, F: 1 } }
            ]
        }
    ];

    /* ---------------- 16タイプ ---------------- */
    const TYPES = {
        KTPF: {
            name: 'ご褒美ストロング', code: 'K-T-P-F', emoji: '🌙', rarity: '7%',
            tagline: '頑張った自分に、濃いめの一杯を。',
            quote: '今日のわたし、よく頑張った。',
            persona: '一日の終わりに“濃いめの満足”で自分をねぎらえる人。派手さで勝負しない、芯の通った一匹狼。静かな充実がよく似合う。',
            hidden: 'やさしくされると一瞬で陥落する、隠れ甘えん坊。',
            match: 'RTGF',
            drink: { name: 'ディープ・ルビーコーク', base: 'コカ・コーラ', flavor: 'pom', topping: null, tip: 'コーラを先に注ぎ、フルーティスは“後がけ”でルビー色のグラデーションを楽しんで。', recipe: [['氷', 'グラス8分目'], ['コカ・コーラ', '120ml'], ['ザクロ&ブラックベリー', '30ml']] }
        },
        KTPD: {
            name: '黄金比の探求者', code: 'K-T-P-D', emoji: '📐', rarity: '5%',
            tagline: '「いつもの」に、妥協はゼロ。',
            quote: '“いつもの”に、妥協はない。',
            persona: '定番を誰よりも深く極める研究者。分量・温度・注ぐ順番、すべてに理由がある。ブレない美学の持ち主。',
            hidden: 'マイルールを崩されると、内心ちょっと嬉しい天邪鬼。',
            match: 'RBGF',
            drink: { name: 'パーフェクト・レモンコーク', base: 'コカ・コーラ', flavor: 'lemon', topping: 'lemon', tip: 'レモンの薄切りを1枚浮かべると、香りが一気に立ち上がる。', recipe: [['氷', 'グラス8分目'], ['コカ・コーラ', '130ml'], ['レモン&はちみつ', '20ml']] }
        },
        KTGF: {
            name: '場をアゲる着火剤', code: 'K-T-G-F', emoji: '🎉', rarity: '8%',
            tagline: '空気は、読むより“変える”。',
            quote: 'とりあえず、乾杯しよ！',
            persona: '考えるより先に体が動く、場の点火スイッチ。いるだけで温度が上がる、天性のムードメーカー。',
            hidden: '盛り上げ役の裏で、ひとりこっそり充電している繊細さ。',
            match: 'RTPD',
            drink: { name: 'パーティ・ストロングベリー', base: 'コカ・コーラ', flavor: 'berry', topping: 'cherry', tip: '混ぜずに層のまま乾杯→一気に混ぜると、それだけでショーになる。', recipe: [['氷', 'グラス8分目'], ['コカ・コーラ', '110ml'], ['ミックスベリー', '40ml']] }
        },
        KTGD: {
            name: '乾杯の演出家', code: 'K-T-G-D', emoji: '🥂', rarity: '4%',
            tagline: '主役はみんな、仕掛けはわたし。',
            quote: '主役はみんな。段取りはわたし。',
            persona: 'グラス選びから氷の形まで、細部で場を格上げする名プロデューサー。みんなの“最高の一杯”を抜かりなく演出。',
            hidden: '段取りが命なのに、自分へのサプライズにはめっぽう弱い。',
            match: 'RBPF',
            drink: { name: 'ゴールデン・パインコーク', base: 'コカ・コーラ', flavor: 'pine', topping: 'pine', tip: 'パイナップル果肉を一切れ沈めると、“映え”も味も格上げ。', recipe: [['氷', 'グラス8分目'], ['コカ・コーラ', '120ml'], ['パイナップル', '30ml']] }
        },
        KBPF: {
            name: '実験室の変人天才', code: 'K-B-P-F', emoji: '🧪', rarity: '6%',
            tagline: '「面白そう」が、原動力。',
            quote: 'これ、混ぜたらどうなる？',
            persona: '誰も試さない組み合わせに、ひとりで突っ込んでいく直感派。常識の外側でこそ光る、愛すべき変わり者。',
            hidden: '奇抜に見えて、実はちゃっかり成功率を計算済み。',
            match: 'RTGD',
            drink: { name: 'ミッドナイト・グレープ', base: 'コカ・コーラ', flavor: 'grape', topping: null, tip: '濃いめに作って、“大人の夜”仕様に。氷は大きめがクール。', recipe: [['氷', '大きめを2〜3個'], ['コカ・コーラ', '110ml'], ['国産ぶどう', '40ml']] }
        },
        KBPD: {
            name: '孤高のミクソロジスト', code: 'K-B-P-D', emoji: '🍸', rarity: '3%',
            tagline: '正解は、自分の舌が決める。',
            quote: '正解は、自分の舌が知ってる。',
            persona: '流行を追わず、納得いくまで配合を磨く職人。自分だけの“正解”を黙々と追求する一匹狼。',
            hidden: 'SNSには出さないけれど、本当はめちゃくちゃ褒められたい。',
            match: 'RTGF',
            drink: { name: 'ブルー・エレクトリック', base: 'コカ・コーラ ゼロ', flavor: 'blue', topping: null, tip: '炭酸を逃さないよう、マドラーは2回転だけ。スッと澄んだ後味に。', recipe: [['氷', 'グラス8分目'], ['コカ・コーラ ゼロ', '130ml'], ['ブルーベリー', '25ml']] }
        },
        KBGF: {
            name: '未知数のエンタメ番長', code: 'K-B-G-F', emoji: '🎢', rarity: '5%',
            tagline: '考えるな、やってみよう。',
            quote: '考えるな、やってみよう。',
            persona: '予測不能の展開ごと楽しめる、エンタメの塊。ひと言でみんなを巻き込む、祭りの中心人物。',
            hidden: '勢い任せに見えて、誰も置き去りにしない優しさが土台にある。',
            match: 'RTPD',
            drink: { name: 'トロピカル・サンダー', base: 'コカ・コーラ', flavor: 'pine', topping: 'pine', tip: 'みんなの分はピッチャーで一気に。レモンを少し搾ると締まる。', recipe: [['氷', 'グラス8分目'], ['コカ・コーラ', '110ml'], ['パイナップル', '30ml'], ['レモン果汁', '少々']] }
        },
        KBGD: {
            name: '攻めの仕掛け人', code: 'K-B-G-D', emoji: '♟️', rarity: '4%',
            tagline: '面白いほうに、賭ける。',
            quote: '面白いほうに、賭ける。',
            persona: '新しい遊びを設計して場を巻き込む戦略家。攻めつつも詰めは丁寧、“勝てる冒険”を仕掛けるブレーン。',
            hidden: '計算高いのに、最後の最後はノリで決断するギャンブラー。',
            match: 'RBPF',
            drink: { name: 'マスカット・ハイボルテージ', base: 'コカ・コーラ', flavor: 'muscat', topping: 'mint', tip: 'ミントを1枝添えると、清涼感が一段ブースト。', recipe: [['氷', 'グラス8分目'], ['コカ・コーラ', '120ml'], ['マスカット', '30ml'], ['ミント', '1枝']] }
        },
        RTPF: {
            name: '自分時間の名人', code: 'R-T-P-F', emoji: '☕', rarity: '9%',
            tagline: 'これくらいが、ちょうどいい。',
            quote: 'これくらいが、ちょうどいい。',
            persona: 'ひとりの時間を心からおいしく味わえる達人。流行に流されず“自分のちょうどいい”を直感で選べる人。',
            hidden: 'マイペースに見えて、人の機微にはやたら敏感。',
            match: 'KTGF',
            drink: { name: 'ピーチ・リラックスコーク', base: 'コカ・コーラ ゼロ', flavor: 'peach', topping: null, tip: '多めの氷でゆっくり薄まる、やさしい口当たりに。', recipe: [['氷', 'たっぷり'], ['コカ・コーラ ゼロ', '130ml'], ['白桃', '25ml']] }
        },
        RTPD: {
            name: '丁寧な暮らしの達人', code: 'R-T-P-D', emoji: '🌿', rarity: '6%',
            tagline: '急がない。でも、ちゃんと。',
            quote: '急がない。でも、ちゃんと。',
            persona: '小さな“ちゃんと”を積み重ねられる、静かな完璧主義者。日々の心地よさを丁寧に整える人。',
            hidden: 'ていねいさの裏で、たまに全部投げ出したくなる人間味。',
            match: 'KBGF',
            drink: { name: 'ハニーレモン・スロウ', base: 'コカ・コーラ ゼロ', flavor: 'lemon', topping: 'lemon', tip: 'はちみつをほんの少し足すと、“ご自愛”度がぐっと上がる。', recipe: [['氷', 'グラス8分目'], ['コカ・コーラ ゼロ', '130ml'], ['レモン&はちみつ', '25ml']] }
        },
        RTGF: {
            name: 'みんなのオアシス', code: 'R-T-G-F', emoji: '🫧', rarity: '8%',
            tagline: 'いるだけで、場があたたかい。',
            quote: 'まあまあ、座って座って。',
            persona: '気取らない笑顔で、みんなが安心して集まれる場をつくる天然の癒し系。やわらかさで人と人をつなぐ人。',
            hidden: '癒しキャラだが、ここぞでみせる芯の強さにギャップあり。',
            match: 'KTPF',
            drink: { name: 'ストロベリー・スマイル', base: 'コカ・コーラ', flavor: 'straw', topping: 'cherry', tip: '苺を1粒グラスに入れるだけで、“かわいい”が完成。', recipe: [['氷', 'グラス8分目'], ['コカ・コーラ', '120ml'], ['あまおう苺', '30ml']] }
        },
        RTGD: {
            name: 'やさしい幹事', code: 'R-T-G-D', emoji: '📋', rarity: '5%',
            tagline: 'みんなの“居心地”、こっそり最適化。',
            quote: 'みんな、楽しめてる？',
            persona: '押しつけず、でも抜かりなく、全員がちょうどよく楽しめる場を設計する世話役。さりげない気配りの達人。',
            hidden: '気配り上手だけど、自分のことはつい後回しにしがち。',
            match: 'KBPF',
            drink: { name: '王林クリア・クーラー', base: 'コカ・コーラ ゼロ', flavor: 'aoringo', topping: null, tip: '透明感重視で、グラスは前もって冷やしておくと◎。', recipe: [['氷', 'グラス8分目'], ['コカ・コーラ ゼロ', '130ml'], ['王林（青りんご）', '25ml']] }
        },
        RBPF: {
            name: 'ゆるふわ冒険家', code: 'R-B-P-F', emoji: '🧭', rarity: '7%',
            tagline: 'なんか良さそう、で動ける。',
            quote: 'なんか良さそう、行ってみよ。',
            persona: '力を抜いたまま新しい世界へふらっと踏み出せる、しなやかな自由人。肩の力を抜いて未知を楽しめる人。',
            hidden: 'ゆるく見えて、好きなことには驚くほど一途。',
            match: 'KTGD',
            drink: { name: 'ゆずミント・フィズ', base: 'コカ・コーラ', flavor: 'yuzu', topping: 'mint', tip: 'ゆず皮を軽くひねって香りを移すと、一気に本格派の顔に。', recipe: [['氷', 'グラス8分目'], ['コカ・コーラ', '120ml'], ['ゆず&レモン', '30ml'], ['ミント', '少々']] }
        },
        RBPD: {
            name: '隠れこだわりの研究員', code: 'R-B-P-D', emoji: '🔬', rarity: '4%',
            tagline: '静かに、深く、掘る。',
            quote: '語ると長いよ、これ。',
            persona: '穏やかな顔で、好きなものを誰より深掘りするスペシャリスト。派手さはないが、探究心は底なし。',
            hidden: '物静かなのに、好きな話になると止まらなくなるオタク気質。',
            match: 'KTGF',
            drink: { name: 'バナナ・ベルベット', base: 'コカ・コーラ', flavor: 'banana', topping: null, tip: '少量の牛乳を加えると、“ベルベット食感”に化ける裏ワザ。', recipe: [['氷', 'グラス8分目'], ['コカ・コーラ', '110ml'], ['完熟バナナ', '35ml'], ['牛乳', '少々(お好み)']] }
        },
        RBGF: {
            name: 'ハッピー拡散マシン', code: 'R-B-G-F', emoji: '🌈', rarity: '6%',
            tagline: '楽しいは、シェアするもの。',
            quote: '楽しいは、シェアするもの。',
            persona: '難しいこと抜きで、その場のハッピーを最大化する陽の存在。楽しさを自然に周りへ広げていける人。',
            hidden: 'いつも明るいぶん、たまの弱音は超レアで価値が高い。',
            match: 'KBPD',
            drink: { name: 'レインボー・ベリーフロート', base: 'コカ・コーラ', flavor: 'berry', topping: 'float', tip: 'バニラアイスをのせれば、“ごほうびフロート”に即進化。', recipe: [['氷', 'たっぷり'], ['コカ・コーラ', '110ml'], ['ミックスベリー', '30ml'], ['バニラアイス', '1スクープ']] }
        },
        RBGD: {
            name: '癒しのプロデューサー', code: 'R-B-G-D', emoji: '🎐', rarity: '5%',
            tagline: '「いい時間だった」を、設計する。',
            quote: 'いい時間だったね、って言わせたい。',
            persona: 'さりげない工夫で場をやわらかく包む、癒しの総合演出家。みんなが心地よく過ごせる時間を丁寧につくれる人。',
            hidden: '全体を癒すわりに、自分の癒し方は意外と下手。',
            match: 'KBPF',
            drink: { name: 'マスカット・ピーチ・スプリッツ', base: 'コカ・コーラ ゼロ', flavor: 'muscat', topping: null, tip: '2種を重ねて注げば、“やさしい二層”のグラデーションに。', recipe: [['氷', 'グラス8分目'], ['コカ・コーラ ゼロ', '120ml'], ['マスカット', '20ml'], ['白桃', '10ml']] }
        }
    };
    const GRID_ORDER = ['KTPF', 'KTPD', 'KTGF', 'KTGD', 'KBPF', 'KBPD', 'KBGF', 'KBGD',
        'RTPF', 'RTPD', 'RTGF', 'RTGD', 'RBPF', 'RBPD', 'RBGF', 'RBGD'];

    /* ---------------- DOM ---------------- */
    const $ = (id) => document.getElementById(id);
    const screens = {
        start: $('start-screen'), question: $('question-screen'),
        loading: $('loading-screen'), result: $('result-screen')
    };
    const el = {
        startBtn: $('start-btn'), backBtn: $('back-btn'), retryBtn: $('retry-btn'),
        qNum: $('current-q-num'), totalNum: $('total-q-num'),
        progressFill: $('progress-fill'), qLiquid: $('q-liquid'), qFizz: $('q-fizz'),
        questionText: $('question-text'), options: $('options-container'),
        loadingStrong: $('loading-strong'),
        previewBanner: $('preview-banner'), previewOwnName: $('preview-own-name'), backToOwnBtn: $('back-to-own-btn'),
        rCode: $('result-code'), rName: $('result-type-name'), rTagline: $('result-tagline'),
        rQuote: $('result-quote'), rRarity: $('result-rarity'), rEmoji: $('rec-emoji'), rDrink: $('rec-drink'),
        rProduct: $('rec-product-name'), rBase: $('rec-base'), rFlavor: $('rec-flavor'),
        recipeList: $('recipe-list'), recipeTip: $('recipe-tip'), rDesc: $('result-description'),
        rHidden: $('result-hidden'), rMatchName: $('result-match-name'), rMatchDesc: $('result-match-desc'),
        typeGrid: $('type-grid'), gridProgress: $('grid-progress'),
        shareCanvas: $('share-canvas'), saveBtn: $('save-img-btn'),
        shareX: $('share-x-btn'), shareLine: $('share-line-btn'),
        soundToggle: $('sound-toggle'), bgBubbles: $('bg-bubbles'), burstLayer: $('burst-layer')
    };

    /* ---------------- State ---------------- */
    let qIndex = 0;
    let answers = [];
    let currentType = null;      // 表示中のタイプ
    let ownCode = null;          // ユーザー本来の結果
    let drawSeq = 0;
    let transitioning = false;

    /* ---------------- Sound (Web Audio) ---------------- */
    let actx = null;
    let soundOn = localStorage.getItem('fizz_sound') !== 'off';
    function ensureAudio() {
        if (!actx) {
            try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { actx = null; }
        }
        if (actx && actx.state === 'suspended') actx.resume();
    }
    function pop() {
        if (!soundOn || !actx) return;
        const t = actx.currentTime;
        const o = actx.createOscillator(), g = actx.createGain();
        o.type = 'triangle';
        o.frequency.setValueAtTime(520 + Math.random() * 320, t);
        o.frequency.exponentialRampToValueAtTime(180, t + 0.12);
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.22, t + 0.012);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
        o.connect(g).connect(actx.destination);
        o.start(t); o.stop(t + 0.18);
    }
    function fizz() {
        if (!soundOn || !actx) return;
        const t = actx.currentTime, dur = 0.7;
        const buf = actx.createBuffer(1, actx.sampleRate * dur, actx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
        const src = actx.createBufferSource(); src.buffer = buf;
        const bp = actx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 5200; bp.Q.value = 0.7;
        const g = actx.createGain();
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.28, t + 0.04);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        src.connect(bp).connect(g).connect(actx.destination);
        src.start(t);
    }
    function setSound(on) {
        soundOn = on;
        el.soundToggle.setAttribute('aria-pressed', String(on));
        localStorage.setItem('fizz_sound', on ? 'on' : 'off');
        if (on) { ensureAudio(); pop(); }
    }

    /* ---------------- Helpers ---------------- */
    function hexToRgba(hex, a) {
        const n = parseInt(hex.slice(1), 16);
        return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
    }
    function applyTheme(fl) {
        const r = document.documentElement.style;
        r.setProperty('--accent', fl.c1);
        r.setProperty('--accent-2', fl.c2);
        r.setProperty('--accent-glow', hexToRgba(fl.c1, 0.55));
    }
    function show(name) {
        Object.values(screens).forEach(s => { s.classList.remove('active'); s.classList.add('hidden'); });
        screens[name].classList.remove('hidden'); screens[name].classList.add('active');
        window.scrollTo(0, 0);
    }
    function burstAt(x, y, count) {
        for (let i = 0; i < count; i++) {
            const b = document.createElement('span');
            b.className = 'b';
            const size = 8 + Math.random() * 16;
            const ang = Math.random() * Math.PI * 2, dist = 40 + Math.random() * 120;
            b.style.cssText = `left:${x}px;top:${y}px;width:${size}px;height:${size}px;` +
                `--bx:${Math.cos(ang) * dist}px;--by:${Math.sin(ang) * dist - 30}px;`;
            el.burstLayer.appendChild(b);
            setTimeout(() => b.remove(), 950);
        }
    }

    /* ---------------- 背景の泡 ---------------- */
    function buildBgBubbles() {
        const frag = document.createDocumentFragment();
        for (let i = 0; i < 16; i++) {
            const s = document.createElement('span');
            const size = 6 + Math.random() * 16;
            s.style.cssText = `left:${Math.random() * 100}%;width:${size}px;height:${size}px;` +
                `animation-duration:${8 + Math.random() * 10}s;animation-delay:${-Math.random() * 12}s;`;
            frag.appendChild(s);
        }
        el.bgBubbles.appendChild(frag);
    }
    function buildQFizz() {
        let s = '';
        for (let i = 0; i < 5; i++) {
            const x = 22 + Math.random() * 36, r = 1.6 + Math.random() * 1.8, d = (Math.random() * 1.6).toFixed(2);
            s += `<circle class="q-fizz-b" cx="${x.toFixed(1)}" cy="82" r="${r.toFixed(1)}" style="transform-box:fill-box;transform-origin:center;animation-delay:${d}s"></circle>`;
        }
        el.qFizz.innerHTML = s;
    }

    /* ---------------- Quiz flow ---------------- */
    function setGlass(frac) {
        const f = Math.max(0, Math.min(1, frac));
        el.qLiquid.setAttribute('y', (90 - f * 82).toFixed(1));
    }
    function renderQuestion() {
        transitioning = false;
        const q = QUESTIONS[qIndex], total = QUESTIONS.length;
        el.qNum.textContent = qIndex + 1;
        el.progressFill.style.width = Math.max(6, (qIndex / total) * 100) + '%';
        setGlass(qIndex / total);
        el.questionText.textContent = q.text;
        el.backBtn.classList.toggle('hidden', qIndex === 0);

        el.options.innerHTML = '';
        q.options.forEach((opt, i) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.type = 'button';
            btn.dataset.idx = i;
            btn.style.animationDelay = (i * 0.07) + 's';
            btn.innerHTML = `<span class="opt-emoji">${opt.emoji}</span>` +
                `<span>${opt.label}<span class="opt-sub">${opt.sub}</span></span>`;
            el.options.appendChild(btn);
        });
    }
    function chooseOption(i, btn) {
        if (transitioning || btn.classList.contains('selected')) return;
        transitioning = true;
        answers[qIndex] = QUESTIONS[qIndex].options[i].w;
        Array.from(el.options.children).forEach(c => c.classList.remove('selected'));
        btn.classList.add('selected');
        pop();
        const rect = btn.getBoundingClientRect();
        burstAt(rect.left + rect.width / 2, rect.top + rect.height / 2, 7);

        setTimeout(() => {
            if (qIndex < QUESTIONS.length - 1) { qIndex++; renderQuestion(); }
            else runLoading();
        }, 280);
    }

    /* ---------------- Loading ---------------- */
    const LOADING_MSGS = ['炭酸性格を解析中…', '気分をブレンド中…', '泡をはじけさせ中…', '相性をマッチング中…'];
    function runLoading() {
        show('loading');
        let i = 0; el.loadingStrong.textContent = LOADING_MSGS[0];
        const timer = setInterval(() => {
            i = (i + 1) % LOADING_MSGS.length;
            el.loadingStrong.textContent = LOADING_MSGS[i];
        }, 620);
        setTimeout(() => { clearInterval(timer); showResult(); }, 2400);
    }

    /* ---------------- Result ---------------- */
    function computeCode() {
        const s = { K: 0, R: 0, T: 0, B: 0, P: 0, G: 0, F: 0, D: 0 };
        answers.forEach(w => { for (const k in w) s[k] += w[k]; });
        return (s.K >= s.R ? 'K' : 'R') + (s.T >= s.B ? 'T' : 'B') +
            (s.P >= s.G ? 'P' : 'G') + (s.F >= s.D ? 'F' : 'D');
    }
    function buildTypeGrid() {
        if (el.typeGrid.childElementCount) return;
        let html = '';
        GRID_ORDER.forEach(code => {
            const t = TYPES[code];
            html += `<button class="grid-cell" type="button" data-code="${code}" aria-label="${t.name}">` +
                `<span class="cell-emoji">${t.emoji}</span><span class="cell-name">${t.name}</span></button>`;
        });
        el.typeGrid.innerHTML = html;
    }
    function renderResult(type) {
        currentType = type;
        const key = type.code.replace(/-/g, '');
        const isPreview = key !== ownCode;
        const fl = FLAVORS[type.drink.flavor];
        applyTheme(fl);

        el.rCode.textContent = type.code;
        el.rName.textContent = type.name;
        el.rTagline.textContent = type.tagline;
        el.rQuote.textContent = '「' + type.quote + '」';
        el.rRarity.textContent = type.rarity;
        el.rEmoji.textContent = type.emoji;
        el.rDrink.innerHTML = drinkSVG(fl, 'r' + (++drawSeq), type.drink.topping);
        el.rProduct.textContent = type.drink.name;
        el.rBase.textContent = type.drink.base;
        el.rFlavor.textContent = 'フルーティス ' + fl.name;
        el.recipeList.innerHTML = type.drink.recipe
            .map(r => `<li><span class="ing">${r[0]}</span><span class="amt">${r[1]}</span></li>`).join('');
        el.recipeTip.textContent = type.drink.tip;
        el.rDesc.textContent = type.persona;
        el.rHidden.textContent = type.hidden;
        const m = TYPES[type.match];
        el.rMatchName.textContent = m.name;
        el.rMatchDesc.textContent = '（' + m.tagline + '）';

        // 図鑑ハイライト
        Array.from(el.typeGrid.children).forEach(c => {
            c.classList.toggle('active', c.dataset.code === key);
            c.classList.toggle('is-you', c.dataset.code === ownCode);
        });
        // プレビューバナー
        el.previewBanner.classList.toggle('hidden', !isPreview);
        if (isPreview) el.previewOwnName.textContent = TYPES[ownCode].name;

        drawShareCard(type, fl);
    }
    function showResult() {
        ownCode = computeCode();
        buildTypeGrid();
        if (el.gridProgress) el.gridProgress.textContent = 'あなたは ' + (TYPES[ownCode] || TYPES.KTPF).name;
        renderResult(TYPES[ownCode] || TYPES.KTPF);
        show('result');
        setTimeout(() => {
            fizz();
            burstAt(window.innerWidth / 2, 140, 16);
        }, 180);
    }

    /* ---------------- ドリンク作画（SVG） ---------------- */
    function toppingSVG(topping) {
        switch (topping) {
            case 'mint':
                return `<g><path d="M86 30 Q92 12 108 14 Q100 30 86 30 Z" fill="#7BE36B"/>` +
                    `<path d="M90 31 Q99 18 114 22 Q103 33 90 31 Z" fill="#4FBF53"/>` +
                    `<line x1="92" y1="30" x2="101" y2="18" stroke="#2E7A1F" stroke-width="2" stroke-linecap="round"/></g>`;
            case 'lemon':
                return `<g transform="translate(110,30)"><path d="M-13 0 A13 13 0 0 1 13 0 Z" fill="#FFD12E"/>` +
                    `<path d="M-10 0 A10 10 0 0 1 10 0 Z" fill="#FFF0A8"/>` +
                    `<line x1="0" y1="0" x2="0" y2="-10" stroke="#E0B400" stroke-width="1.4"/>` +
                    `<line x1="-7" y1="0" x2="-5" y2="-8" stroke="#E0B400" stroke-width="1.4"/>` +
                    `<line x1="7" y1="0" x2="5" y2="-8" stroke="#E0B400" stroke-width="1.4"/></g>`;
            case 'cherry':
                return `<g><line x1="112" y1="30" x2="118" y2="14" stroke="#7a3b1f" stroke-width="2" fill="none"/>` +
                    `<circle cx="113" cy="30" r="6.5" fill="#E11D3A"/><circle cx="111" cy="28" r="2" fill="#ff7a8f"/></g>`;
            case 'pine':
                return `<g><path d="M104 30 L120 16 L123 30 Z" fill="#FFC233" stroke="#C97A00" stroke-width="1.5"/>` +
                    `<path d="M118 16 l4 -8 l5 7 z" fill="#4FBF53"/></g>`;
            case 'float':
                return `<g><ellipse cx="85" cy="60" rx="33" ry="17" fill="#FFF3E0"/>` +
                    `<ellipse cx="85" cy="55" rx="24" ry="13" fill="#FFF8F0"/>` +
                    `<line x1="112" y1="40" x2="118" y2="22" stroke="#7a3b1f" stroke-width="2"/>` +
                    `<circle cx="113" cy="40" r="6" fill="#E11D3A"/></g>`;
            default: return '';
        }
    }
    function drinkSVG(fl, uid, topping) {
        uid = uid || 'd';
        let bubbles = '';
        for (let i = 0; i < 8; i++) {
            const x = 52 + Math.random() * 66, y = 80 + Math.random() * 110;
            const r = 1.6 + Math.random() * 2.6, d = (Math.random() * 3).toFixed(2);
            bubbles += `<circle class="d-bubble" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" style="transform-box:fill-box;transform-origin:center;animation-delay:${d}s"></circle>`;
        }
        const glass = 'M40 30 H130 L119 196 Q118 204 110 204 H60 Q52 204 51 196 Z';
        const garnish = topping ? toppingSVG(topping) : `<text x="122" y="40" font-size="27" text-anchor="middle">${fl.emoji}</text>`;
        return `<svg viewBox="0 0 170 220" xmlns="http://www.w3.org/2000/svg">
<defs>
  <linearGradient id="dLiq${uid}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${fl.c1}"/><stop offset="1" stop-color="${fl.c2}"/>
  </linearGradient>
  <clipPath id="dClip${uid}"><path d="${glass}"/></clipPath>
  <radialGradient id="dShine${uid}" cx="0.3" cy="0.18" r="0.9">
    <stop offset="0" stop-color="rgba(255,255,255,.45)"/><stop offset="1" stop-color="rgba(255,255,255,0)"/>
  </radialGradient>
</defs>
<rect x="96" y="4" width="9" height="160" rx="4.5" transform="rotate(11 100 84)" fill="#fff" opacity=".85"/>
<rect x="96" y="4" width="9" height="160" rx="4.5" transform="rotate(11 100 84)" fill="${fl.c2}" opacity=".35"/>
<g clip-path="url(#dClip${uid})">
  <rect x="40" y="66" width="90" height="150" fill="url(#dLiq${uid})"/>
  <rect x="55" y="92" width="34" height="34" rx="8" fill="#fff" opacity=".22" transform="rotate(-12 72 109)"/>
  <rect x="84" y="124" width="30" height="30" rx="7" fill="#fff" opacity=".18" transform="rotate(14 99 139)"/>
  <rect x="60" y="156" width="26" height="26" rx="6" fill="#fff" opacity=".15" transform="rotate(8 73 169)"/>
  ${bubbles}
  <ellipse cx="85" cy="66" rx="46" ry="8.5" fill="#fff" opacity=".7"/>
</g>
<path d="${glass}" fill="url(#dShine${uid})"/>
<path d="${glass}" fill="none" stroke="rgba(255,255,255,.92)" stroke-width="3.5"/>
<line x1="50" y1="42" x2="46" y2="182" stroke="rgba(255,255,255,.5)" stroke-width="3" stroke-linecap="round"/>
${garnish}
</svg>`;
    }

    /* ---------------- シェア画像（Canvas） ---------------- */
    function wrapText(ctx, text, maxW) {
        const lines = []; let line = '';
        for (const ch of text) {
            if (ctx.measureText(line + ch).width > maxW && line) { lines.push(line); line = ch; }
            else line += ch;
        }
        if (line) lines.push(line);
        return lines;
    }
    function drawCanvasTopping(ctx, cx, topY, w, h, topping, fl) {
        const rimY = topY, rightX = cx + w * 0.32;
        ctx.save();
        if (topping === 'mint') {
            ctx.fillStyle = '#4FBF53';
            ctx.beginPath(); ctx.ellipse(cx + 6, rimY - 16, 22, 11, -0.5, 0, 7); ctx.fill();
            ctx.fillStyle = '#7BE36B';
            ctx.beginPath(); ctx.ellipse(cx + 24, rimY - 8, 20, 10, 0.2, 0, 7); ctx.fill();
        } else if (topping === 'lemon') {
            ctx.translate(rightX, rimY);
            ctx.fillStyle = '#FFD12E'; ctx.beginPath(); ctx.arc(0, 0, 28, Math.PI, 0); ctx.fill();
            ctx.fillStyle = '#FFF0A8'; ctx.beginPath(); ctx.arc(0, 0, 21, Math.PI, 0); ctx.fill();
        } else if (topping === 'cherry') {
            ctx.strokeStyle = '#7a3b1f'; ctx.lineWidth = 4;
            ctx.beginPath(); ctx.moveTo(rightX - 6, rimY); ctx.lineTo(rightX + 6, rimY - 34); ctx.stroke();
            ctx.fillStyle = '#E11D3A'; ctx.beginPath(); ctx.arc(rightX - 6, rimY + 2, 14, 0, 7); ctx.fill();
        } else if (topping === 'pine') {
            ctx.fillStyle = '#FFC233'; ctx.beginPath();
            ctx.moveTo(rightX - 16, rimY); ctx.lineTo(rightX + 14, rimY - 30); ctx.lineTo(rightX + 18, rimY); ctx.closePath(); ctx.fill();
            ctx.fillStyle = '#4FBF53'; ctx.beginPath();
            ctx.moveTo(rightX + 10, rimY - 30); ctx.lineTo(rightX + 18, rimY - 46); ctx.lineTo(rightX + 26, rimY - 28); ctx.closePath(); ctx.fill();
        } else if (topping === 'float') {
            ctx.fillStyle = '#FFF3E0'; ctx.beginPath(); ctx.ellipse(cx, topY - 6, w * 0.42, 34, 0, 0, 7); ctx.fill();
            ctx.fillStyle = '#FFF8F0'; ctx.beginPath(); ctx.ellipse(cx, topY - 16, w * 0.3, 26, 0, 0, 7); ctx.fill();
            ctx.fillStyle = '#E11D3A'; ctx.beginPath(); ctx.arc(cx + 10, topY - 34, 13, 0, 7); ctx.fill();
        } else {
            ctx.font = '64px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText(fl.emoji, rightX + 6, rimY + 6);
        }
        ctx.restore();
    }
    function drawCanvasDrink(ctx, cx, topY, w, h, fl, topping) {
        const tw = w / 2, bw = w * 0.39;
        const lt = cx - tw, rt = cx + tw, lb = cx - bw, rb = cx + bw, by = topY + h, liq = topY + h * 0.18;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(lt, topY); ctx.lineTo(rt, topY); ctx.lineTo(rb, by); ctx.lineTo(lb, by); ctx.closePath();
        ctx.clip();
        const g = ctx.createLinearGradient(0, liq, 0, by);
        g.addColorStop(0, fl.c1); g.addColorStop(1, fl.c2);
        ctx.fillStyle = g; ctx.fillRect(lt, liq, w, h);
        ctx.fillStyle = 'rgba(255,255,255,.2)';
        const ice = (x, y, s, rot) => { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.beginPath(); ctx.rect(-s / 2, -s / 2, s, s); ctx.fill(); ctx.restore(); };
        ice(cx - w * 0.12, liq + h * 0.32, w * 0.26, -0.2);
        ice(cx + w * 0.14, liq + h * 0.52, w * 0.22, 0.25);
        ctx.fillStyle = 'rgba(255,255,255,.7)';
        for (let i = 0; i < 16; i++) {
            ctx.beginPath();
            ctx.arc(cx - w * 0.4 + Math.random() * w * 0.8, liq + Math.random() * (by - liq), 2 + Math.random() * 5, 0, 7);
            ctx.fill();
        }
        ctx.fillStyle = 'rgba(255,255,255,.75)';
        ctx.beginPath(); ctx.ellipse(cx, liq, tw * 0.95, h * 0.035, 0, 0, 7); ctx.fill();
        ctx.restore();
        ctx.strokeStyle = 'rgba(255,255,255,.92)'; ctx.lineWidth = 7; ctx.lineJoin = 'round';
        ctx.beginPath(); ctx.moveTo(lt, topY); ctx.lineTo(rt, topY); ctx.lineTo(rb, by); ctx.lineTo(lb, by); ctx.closePath(); ctx.stroke();
        ctx.save(); ctx.translate(cx + w * 0.16, topY + h * 0.4); ctx.rotate(0.18);
        ctx.fillStyle = '#fff'; ctx.fillRect(-7, -h * 0.62, 14, h * 0.9); ctx.restore();
        drawCanvasTopping(ctx, cx, topY, w, h, topping, fl);
    }
    async function drawShareCard(type, fl) {
        const c = el.shareCanvas, ctx = c.getContext('2d');
        if (!ctx) return;
        const W = c.width, H = c.height;
        try { if (document.fonts && document.fonts.ready) await document.fonts.ready; } catch (e) { }

        const bg = ctx.createLinearGradient(0, 0, 0, H);
        bg.addColorStop(0, '#191225'); bg.addColorStop(0.55, '#0B0B12'); bg.addColorStop(1, '#050509');
        ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
        const glow = ctx.createRadialGradient(W * 0.78, H * 0.1, 0, W * 0.78, H * 0.1, W * 0.75);
        glow.addColorStop(0, hexToRgba(fl.c1, 0.5)); glow.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = 'rgba(255,255,255,.06)';
        for (let i = 0; i < 26; i++) { ctx.beginPath(); ctx.arc(Math.random() * W, Math.random() * H, 3 + Math.random() * 10, 0, 7); ctx.fill(); }

        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(255,255,255,.85)';
        ctx.font = '700 32px "Zen Kaku Gothic New", sans-serif';
        ctx.fillText('Coca-Cola × フルーティス  ｜  FIZZ診断', W / 2, 86);
        ctx.strokeStyle = hexToRgba(fl.c1, 0.85); ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(W / 2 - 64, 112); ctx.lineTo(W / 2 + 64, 112); ctx.stroke();

        ctx.fillStyle = 'rgba(255,255,255,.6)';
        ctx.font = '500 28px "Zen Kaku Gothic New", sans-serif';
        ctx.fillText('あなたの炭酸性格は…', W / 2, 178);
        ctx.fillStyle = fl.c1;
        ctx.font = '42px "Anton", sans-serif';
        ctx.fillText(type.code.split('').join(' '), W / 2, 236);

        ctx.fillStyle = '#fff';
        ctx.font = '900 86px "Zen Kaku Gothic New", sans-serif';
        const nameLines = wrapText(ctx, type.name, W - 130);
        let y = 332;
        nameLines.forEach(l => { ctx.fillText(l, W / 2, y); y += 96; });

        // quote
        ctx.fillStyle = hexToRgba(fl.c1, 0.95);
        ctx.font = '700 40px "Zen Kaku Gothic New", sans-serif';
        ctx.fillText('「' + type.quote + '」', W / 2, y + 6);
        y += 56;
        ctx.fillStyle = 'rgba(255,255,255,.72)';
        ctx.font = '500 30px "Zen Kaku Gothic New", sans-serif';
        ctx.fillText(type.tagline, W / 2, y + 4);

        drawCanvasDrink(ctx, W / 2, y + 64, 300, 380, fl, type.drink.topping);
        const afterDrink = y + 64 + 380;

        ctx.fillStyle = fl.c1;
        ctx.font = '900 48px "Zen Kaku Gothic New", sans-serif';
        ctx.fillText(type.drink.name, W / 2, afterDrink + 64);
        ctx.fillStyle = 'rgba(255,255,255,.78)';
        ctx.font = '500 28px "Zen Kaku Gothic New", sans-serif';
        ctx.fillText(type.drink.base + ' × フルーティス ' + fl.name, W / 2, afterDrink + 112);

        ctx.fillStyle = 'rgba(255,255,255,.08)';
        const pillW = 300, pillX = W / 2 - pillW / 2, pillY = afterDrink + 140;
        roundRect(ctx, pillX, pillY, pillW, 62, 31); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.font = '500 26px "Zen Kaku Gothic New", sans-serif';
        ctx.fillText('出現率', pillX + 86, pillY + 41);
        ctx.fillStyle = fl.c1; ctx.font = '38px "Anton", sans-serif';
        ctx.fillText(type.rarity, pillX + 196, pillY + 45);

        ctx.fillStyle = 'rgba(255,255,255,.5)';
        ctx.font = '500 28px "Zen Kaku Gothic New", sans-serif';
        ctx.fillText('#コーラ炭酸性格診断  #フルーティス', W / 2, H - 56);
    }
    function roundRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
    }

    /* ---------------- Share / Save ---------------- */
    function shareText(type) {
        return `【炭酸性格診断】私は「${type.name}」でした${type.emoji}\n口ぐせは「${type.quote}」\nおすすめは「${type.drink.name}」🥤\nあなたの炭酸性格は？`;
    }
    function onShareX() {
        if (!currentType) return;
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText(currentType))}` +
            `&url=${encodeURIComponent(location.href)}&hashtags=${encodeURIComponent('コーラ炭酸性格診断,フルーティス')}`;
        window.open(url, '_blank', 'noopener');
    }
    function onShareLine() {
        if (!currentType) return;
        const url = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(location.href)}` +
            `&text=${encodeURIComponent(shareText(currentType))}`;
        window.open(url, '_blank', 'noopener');
    }
    function onSaveImage() {
        if (!currentType) return;
        try {
            const a = document.createElement('a');
            a.download = `fizz-${currentType.code}.png`;
            a.href = el.shareCanvas.toDataURL('image/png');
            a.click();
        } catch (e) { alert('画像の保存に失敗しました。画像を長押しして保存してください。'); }
    }

    /* ---------------- Reset ---------------- */
    function reset() {
        qIndex = 0; answers = []; currentType = null; ownCode = null;
        document.documentElement.style.setProperty('--accent', '#E4002B');
        document.documentElement.style.setProperty('--accent-2', '#9E0019');
        document.documentElement.style.setProperty('--accent-glow', 'rgba(228,0,43,.55)');
        show('start');
    }

    /* ---------------- Init ---------------- */
    function init() {
        el.totalNum.textContent = QUESTIONS.length;
        el.soundToggle.setAttribute('aria-pressed', String(soundOn));
        buildBgBubbles();
        buildQFizz();
        const heroGlass = $('hero-glass');
        if (heroGlass) heroGlass.innerHTML = drinkSVG(FLAVORS.pom, 'hero', null);

        el.startBtn.addEventListener('click', () => { ensureAudio(); pop(); qIndex = 0; answers = []; renderQuestion(); show('question'); });
        el.options.addEventListener('click', (e) => {
            const btn = e.target.closest('.option-btn');
            if (btn) chooseOption(parseInt(btn.dataset.idx, 10), btn);
        });
        el.backBtn.addEventListener('click', () => {
            if (qIndex > 0) { qIndex--; answers.length = qIndex; renderQuestion(); }
        });
        el.retryBtn.addEventListener('click', reset);
        el.saveBtn.addEventListener('click', onSaveImage);
        el.shareX.addEventListener('click', onShareX);
        el.shareLine.addEventListener('click', onShareLine);
        el.soundToggle.addEventListener('click', () => setSound(!soundOn));

        // 図鑑タップで他タイプを回遊
        el.typeGrid.addEventListener('click', (e) => {
            const cell = e.target.closest('.grid-cell');
            if (!cell) return;
            pop();
            renderResult(TYPES[cell.dataset.code]);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        el.backToOwnBtn.addEventListener('click', () => {
            if (ownCode) { renderResult(TYPES[ownCode]); window.scrollTo({ top: 0, behavior: 'smooth' }); }
        });

        // キーボード: 1/2 で選択
        document.addEventListener('keydown', (e) => {
            if (!screens.question.classList.contains('active')) return;
            if (e.key === '1' || e.key === '2') {
                const btn = el.options.children[parseInt(e.key, 10) - 1];
                if (btn) chooseOption(parseInt(btn.dataset.idx, 10), btn);
            }
        });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
