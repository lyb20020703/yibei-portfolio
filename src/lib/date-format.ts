import type { Locale } from "@/data/site";

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatProjectDate(date: string, locale: Locale) {
  if (locale === "zh") {
    return date;
  }

  const [year, month] = date.split(".");
  const monthIndex = Number(month) - 1;

  if (!year || Number.isNaN(monthIndex) || monthIndex < 0 || monthIndex > 11) {
    return date;
  }

  return `${monthNames[monthIndex]} ${year}`;
}

export function projectDateLabel(date: string, locale: Locale) {
  return locale === "zh" ? `完成时间：${date}` : `Project Date: ${formatProjectDate(date, locale)}`;
}
