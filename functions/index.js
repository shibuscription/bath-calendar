const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");

admin.initializeApp();
const db = admin.firestore();

const LINE_ACCESS_TOKEN = functions.config().line.token;
const LINE_USER_ID = functions.config().line.userid;

// 日付を yyyy-mm-dd に整形
function formatDate(date) {
  return date.toISOString().split("T")[0];
}

// 湯はり／追い焚きを判定
function getBathType(todayStr, checkpoints) {
  const sorted = [...checkpoints].sort((a, b) => a.date.localeCompare(b.date));
  const lastCheckpoint = [...sorted].reverse().find(cp => cp.date <= todayStr);
  if (!lastCheckpoint) return "湯はり";

  const base = new Date(`${lastCheckpoint.date}T00:00:00`);
  const target = new Date(`${todayStr}T00:00:00`);
  const diffDays = Math.floor((target - base) / (1000 * 60 * 60 * 24));
  const isEven = diffDays % 2 === 0;
  const flip = isEven ? 0 : 1;
  return lastCheckpoint.type === "湯はり"
    ? (flip === 0 ? "湯はり" : "追い焚き")
    : (flip === 0 ? "追い焚き" : "湯はり");
}

// 定時通知関数（毎日16時）
exports.sendBathNotification = functions.pubsub
  .schedule("0 7 * * *") // UTC 7時 → JST 16時
  .timeZone("Asia/Tokyo")
  .onRun(async () => {
    const todayStr = formatDate(new Date());

    // Firestore から checkpoints を取得
    const snapshot = await db.collection("checkpoints").get();
    const checkpoints = snapshot.docs.map(doc => ({
      date: doc.id,
      type: doc.data().type
    }));

    const bathType = getBathType(todayStr, checkpoints);
    const message = {
      to: LINE_USER_ID,
      messages: [{
        type: "text",
        text: `本日（${todayStr}）は「${bathType}」の日です！\nAre 湯 Ready？♨️`
      }]
    };

    try {
      await axios.post("https://api.line.me/v2/bot/message/push", message, {
        headers: {
          Authorization: `Bearer ${LINE_ACCESS_TOKEN}`,
          "Content-Type": "application/json"
        }
      });
      console.log("✅ 通知成功！");
    } catch (err) {
      console.error("❌ 通知失敗:", err.response?.data || err);
    }
  });
