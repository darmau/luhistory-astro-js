// 本函数接收一个数组和一个字符串，然后在数组中找到元素的slug字段和字符串相同的元素，返回该元素的前一个和后一个的index
export default function findNextAndLast(arr: Items[], current: string) {
  return arr.findIndex((item) => item.slug === current);
}

interface Items {
  title: string,
  slug: string
}
