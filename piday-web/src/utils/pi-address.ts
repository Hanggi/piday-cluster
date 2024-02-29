export function displayPiAddress(str: string): string {
  if (!str) {
    // 如果字符串为空，直接返回空字符串
    return "";
  }

  if (str.length <= 8) {
    // 如果字符串长度小于等于8，直接返回原字符串
    return str;
  } else {
    // 提取前四位
    const start = str.slice(0, 4);
    // 提取后四位
    const end = str.slice(-4);
    // 将前四位、省略部分的表示（例如"..."）、后四位拼接起来
    return `${start}...${end}`;
  }
}
