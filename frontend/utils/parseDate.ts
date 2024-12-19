export const parseDate = (
  dateString: string,
): {
  dayOfWeek: string;
  month: number;
  date: number;
} => {
  // 日本語の曜日
  const daysOfWeek = ["日", "月", "火", "水", "木", "金", "土"];

  // 日付文字列をDateオブジェクトに変換
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    throw new Error("Invalid date string");
  }

  // 曜日、月、日を取得
  const dayOfWeek = daysOfWeek[date.getDay()];
  const month = date.getMonth() + 1; // JavaScriptでは0が1月
  const day = date.getDate();

  return {
    dayOfWeek,
    month,
    date: day,
  };
};

// 使用例
const result = parseDate("Wed, 18 Dec 2024 04:33:04 GMT");
console.log(result); // { dayOfWeek: '水', month: 12, date: 18 }
