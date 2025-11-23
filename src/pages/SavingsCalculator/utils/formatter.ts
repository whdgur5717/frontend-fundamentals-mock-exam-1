export function formatNumber(value: number, locale = 'ko-KR'): string {
  return new Intl.NumberFormat(locale).format(Math.round(value));
}

// 원화 표기: "10,000원" 형태로 반환
export function formatKRW(value: number, locale = 'ko-KR'): string {
  return `${formatNumber(value, locale)}원`;
}

export const format = {
  number: formatNumber,
  krw: formatKRW,
};
