# Are 湯 Ready? ♨️

湯はりか？追い焚きか？  
交互にやってくるお風呂スケジュールを管理する、シンプルな湯管理カレンダーです。

---

## 🧼 機能一覧

- カレンダー上に「湯はり／追い焚き」を交互に表示
- Firestore で変更点（checkpoints）を保存・適用
- 日付をクリックで選択、ステータス切り替え可能
- スマホ対応済み（レスポンシブ）
- PWA対応（ホーム画面に追加可）
- Favicon・タイトル（`Are 湯 Ready?`）も設定済み
- 毎日 **7:00** と **16:00**（JST）に LINE で「今日の湯」通知 ✨

---

## 📁 ファイル構成

```
/
├── index.html           # メイン画面
├── manifest.json        # PWA設定（ホーム画面追加用）
├── favicon.ico          # タブアイコン
└── icons/               # アプリアイコン（192px/512px推奨）
```

---

## 🔧 開発環境

- **HTML + Vanilla JS**
- **Cloud Firestore**（コレクション名: `checkpoints`）
- **Firebase Hosting**
- **Firebase Functions（第1世代）**
- **LINE Messaging API**
- 日付処理：`Date` + UTC対策済み

---

## ☁️ Firebase Hosting へのデプロイ手順

```bash
firebase login
firebase init hosting  # 初回のみ
firebase deploy
```

---

## 🔔 LINE通知

- 通知先：開発者の個人LINEアカウント
- 毎日16:00（JST）にその日の状態（湯はり／追い焚き）を自動送信
- Firebase Functions（`sendBathNotification`）で定時処理
- 判定ロジックは index.html と同じものを使用
- `.env` は使わず、`firebase functions:config:set` でトークン管理

設定コマンド例：

```bash
firebase functions:config:set line.token="あなたのアクセストークン"
firebase functions:config:set line.userid="あなたのユーザーID"
```

---

## 📅 今後の構想（案）

- スキップ日対応（旅行などでスケジュール飛ばす）
- 湯スケジュールの履歴エクスポート（CSV）
- Googleカレンダーへの予定反映（片方向）
- 完全オフライン対応（Service Worker）
- 多ユーザー対応（マルチアカウント）

---

## 🧠 名前の由来

> Are 湯 Ready?  
> → 「準備できた？」「お湯どっちだっけ？」という意味のダブルミーニング！

---

## 🧼 作者

しぶやん  
GitHub: [@shibuscription](https://github.com/shibuscription)

---

## 🪪 ライセンス

MIT（予定）