/**
 * マイドライブ直下の散乱ファイルをカテゴリ別フォルダへ自動仕分けする。
 *
 * 使い方:
 *   1. https://script.google.com/ で新規プロジェクトを作りこのコードを貼り付ける
 *   2. まず dryRunMyDrive を実行してログ（表示→ログ）で振り分け先を確認（移動しない）
 *   3. 問題なければ organizeMyDrive を実行（初回はDriveアクセスを承認）
 *
 * 仕様:
 *   - マイドライブ直下のファイルのみ対象。フォルダ・既存サブフォルダは触らない。
 *   - moveTo による「移動」（コピーではない）。削除は一切しない。
 *   - タイトル/MIMEのキーワードで上から順に最初に一致したカテゴリへ。未一致は _未分類_要確認。
 */

// 仕分けルール。上から順に最初の一致を採用。
function classify_(name, mime) {
  var t = name.toLowerCase();
  var has = function () {
    for (var i = 0; i < arguments.length; i++) {
      if (t.indexOf(arguments[i]) >= 0) return true;
    }
    return false;
  };
  if (t.indexOf('無題の') === 0) return '_未分類_要確認';
  if (has('面接', 'interview', 'ケース対策', '求められる人材', '仕事内容')) return '01_転職活動/面接対策';
  if (has('offer', 'オファー', '内定')) return '01_転職活動/オファー・内定';
  if (has('履歴書', '職務経歴書', 'resume', '自己pr', '志望理由', 'mp application')) return '01_転職活動/履歴書・職務経歴書';
  if (has('bereal')) return '02_TORIHADA業務/BeReal';
  if (has('tts', 'インサイト')) return '02_TORIHADA業務/SNS・インサイト';
  if (has('売上', '売り上げ', '実績', 'シナリオシート')) return '02_TORIHADA業務/売上・実績';
  if (has('精算', '請求', '期会')) return '02_TORIHADA業務/精算・請求';
  if (has('オリエン', '案件', 'クライアント', 'onepager', 'クリニック', 'pressplay', 'stract')) return '02_TORIHADA業務/案件・オリエン';
  if (has('越境ec', '業界', '現状と未来', '成長分析', 'リサーチ')) return '03_事業・アイデア/リサーチ・分析';
  if (has('ロードマップ', '自己研鑽', '80時間', 'ai講座', 'momentum', '思考整理')) return '03_事業・アイデア/自己研鑽・ロードマップ';
  if (has('事業', '起業', 'business_plan', '収支', 'famiverse', 'yenjoy', 'カフェ', '花火')) return '03_事業・アイデア/事業計画・起業';
  if (has('家計', '望愛')) return '04_個人・プライベート/家計・お金';
  if (mime && mime.indexOf('image/') === 0) return '04_個人・プライベート/写真・画像';
  if (has('img_', 'dsc', '.jpg', '.png', '.jpeg')) return '04_個人・プライベート/写真・画像';
  if (has('メモ', 'タスク管理', 'スケジュール', 'ブレスト', 'ガント', '当日進行', '計画')) return '04_個人・プライベート/メモ・その他';
  return '_未分類_要確認';
}

function eachRootFile_(cb) {
  var root = DriveApp.getRootFolder();
  var files = root.getFiles();
  while (files.hasNext()) {
    var f = files.next();
    cb(f, f.getName(), f.getMimeType());
  }
}

// 移動せず、振り分け先だけをログ出力する確認用。
function dryRunMyDrive() {
  var counts = {};
  eachRootFile_(function (f, name, mime) {
    var dest = classify_(name, mime);
    counts[dest] = (counts[dest] || 0) + 1;
    Logger.log(dest + '  <=  ' + name);
  });
  Logger.log('--- 集計 ---');
  Object.keys(counts).sort().forEach(function (k) {
    Logger.log(k + ' : ' + counts[k]);
  });
}

// 実際に移動する。
function organizeMyDrive() {
  var root = DriveApp.getRootFolder();
  var cache = {};
  function resolve(path) {
    var cur = root;
    path.split('/').forEach(function (p) {
      var key = cur.getId() + '/' + p;
      if (cache[key]) { cur = cache[key]; return; }
      var it = cur.getFoldersByName(p);
      cur = it.hasNext() ? it.next() : cur.createFolder(p);
      cache[key] = cur;
    });
    return cur;
  }

  // 直下ファイルを一度配列化（イテレート中の移動による取りこぼし防止）。
  var list = [];
  eachRootFile_(function (f, name, mime) {
    list.push({ f: f, name: name, mime: mime });
  });

  var moved = 0, unsorted = 0;
  list.forEach(function (o) {
    var dest = classify_(o.name, o.mime);
    try {
      o.f.moveTo(resolve(dest));
      moved++;
      if (dest === '_未分類_要確認') unsorted++;
    } catch (e) {
      Logger.log('SKIP ' + o.name + ' : ' + e.message);
    }
  });
  Logger.log('Moved: ' + moved + ' (うち未分類: ' + unsorted + ')');
}
