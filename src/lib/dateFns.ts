import { format, Locale } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { enUS, id } from 'date-fns/locale';

type SupportedLang = 'en' | 'id';

const localeMap: Record<SupportedLang, Locale> = {
  en: enUS,
  id: id,
};

export const formatDateToWIB = (
  isoString: string,
  options?: {
    withTime?: boolean;
    lang?: SupportedLang;
    formatPattern?: string;
  },
): string => {
  try {
    const { withTime = true, lang = 'id', formatPattern } = options || {};

    const timeZone = 'Asia/Jakarta';
    const date = new Date(isoString);
    const zonedDate = toZonedTime(date, timeZone);

    const defaultPattern = withTime ? 'dd MMMM yyyy HH:mm' : 'dd MMMM yyyy';
    const pattern = formatPattern || defaultPattern;

    return format(zonedDate, pattern, { locale: localeMap[lang] || id });
  } catch {
    return '-';
  }
};
