/**
 * Returns the localized version of the given string for the given locale.
 *
 * If either no localization pattern or no localized version is found
 * the original string is returned or an empty string is returned respectively.
 *
 * @param str The string to localize, it may contain localization
 *            patterns like "$de:German Text$en:English Text".
 * @param locale The locale to use, defaults to 'en'.
 *
 * @returns The localized string or the original string if no localization.
 */
export const getLocalizedString = (str?: string, locale = 'en') => {
  if (!str) {
    return '';
  }

  // Check if string contains localization pattern at all.
  if (!str.match(/\$([a-zA-Z]+):([^$]+)/)) {
    return str;
  }

  const regex = new RegExp(`\\$${locale}:([^$]+)`, 'g');
  const result = regex.exec(str);

  if (!result) {
    return '';
  }

  return result[1];
};

export default getLocalizedString;
