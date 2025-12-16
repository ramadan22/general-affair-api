import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { enUS, id } from 'date-fns/locale';
const localeMap = {
    en: enUS,
    id: id,
};
export const formatDateToWIB = (isoString, options) => {
    try {
        const { withTime = true, lang = 'id', formatPattern } = options || {};
        const timeZone = 'Asia/Jakarta';
        const date = new Date(isoString);
        const zonedDate = toZonedTime(date, timeZone);
        const defaultPattern = withTime ? 'dd MMMM yyyy HH:mm' : 'dd MMMM yyyy';
        const pattern = formatPattern || defaultPattern;
        return format(zonedDate, pattern, { locale: localeMap[lang] || id });
    }
    catch {
        return '-';
    }
};
