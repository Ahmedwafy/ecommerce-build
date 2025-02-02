const formatCurrency = (
  amount: number,
  currencyCode: string = "GBP"
): string => {
  try {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: currencyCode.toUpperCase(),
    }).format(amount / 100);
  } catch (error) {
    // Fallback formating if currency code is invalid
    console.error("Invalid currency code", currencyCode, error);
    return `${currencyCode.toUpperCase()} ${amount.toFixed(2)}`;
  }
};

export default formatCurrency;
