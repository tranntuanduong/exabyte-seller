import { useMemo } from "react";

export function formatPrice({
  amount,
  currencyCode,
  locale,
}: {
  amount: number;
  currencyCode: string;
  locale: string;
}) {
  const formatCurrency = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
  });

  return formatCurrency.format(amount);
}

export function formatVariantPrice({
  amount,
  baseAmount,
  currencyCode,
  locale,
}: {
  baseAmount: number;
  amount: number;
  currencyCode: string;
  locale: string;
}) {
  const hasDiscount = baseAmount > amount;
  const formatDiscount = new Intl.NumberFormat(locale, { style: "percent" });
  const discount = hasDiscount
    ? formatDiscount.format((baseAmount - amount) / baseAmount)
    : null;

  const price = formatPrice({ amount, currencyCode, locale });
  const basePrice = hasDiscount
    ? formatPrice({ amount: baseAmount, currencyCode, locale })
    : null;

  return { price, basePrice, discount };
}

export default function usePrice(
  data?: {
    amount: number;
    baseAmount?: number;
    currencyCode?: string;
  } | null
) {
  const { amount, baseAmount, currencyCode = "VND" } = data ?? {};
  const locale = "vi";

  const value = useMemo(() => {
    let _amount = 0;
    if (!currencyCode) return "";
    if (typeof amount !== "number") {
      _amount = parseFloat((amount ?? "0").toString());
    } else {
      _amount = amount;
    }

    return baseAmount
      ? formatVariantPrice({
          amount: _amount,
          baseAmount,
          currencyCode,
          locale,
        })
      : formatPrice({ amount: _amount, currencyCode, locale });
  }, [amount, baseAmount, currencyCode]);

  return typeof value === "string"
    ? { price: value, basePrice: null, discount: null }
    : value;
}
