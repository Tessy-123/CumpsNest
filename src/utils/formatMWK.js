/**
 * Formats a number or numeric string as Malawi Kwacha currency.
 * Example: formatMWK(65000) => "MWK 65,000"
 * Example: formatMWK(65000, { perMonth: true }) => "MWK 65,000 / month"
 * 
 * @param {number|string} amount 
 * @param {object} [options]
 * @param {boolean} [options.perMonth=false] - Appends " / month"
 * @param {boolean} [options.compact=false] - Formats large figures as 65k
 * @returns {string}
 */
export function formatMWK(amount, options = {}) {
  const numericAmount = typeof amount === 'number' ? amount : Number(amount) || 0;
  
  if (options.compact && numericAmount >= 1000) {
    const kVal = (numericAmount / 1000).toFixed(numericAmount % 1000 === 0 ? 0 : 1);
    const result = `MWK ${kVal}k`;
    return options.perMonth ? `${result} / mo` : result;
  }

  const formattedNumber = new Intl.NumberFormat('en-MW', {
    maximumFractionDigits: 0,
  }).format(numericAmount);

  const result = `MWK ${formattedNumber}`;
  return options.perMonth ? `${result} / month` : result;
}
