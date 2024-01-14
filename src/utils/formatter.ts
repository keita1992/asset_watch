export const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('ja-JP', { style: 'currency', currency: 'JPY' });
}

export const decimalToPercent = (decimal: number): string => {
  return `${(decimal * 100).toFixed(1)}%`;
}