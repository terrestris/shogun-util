import CsrfUtil from '@terrestris/base-util/dist/CsrfUtil/CsrfUtil';

export const getCsrfTokenHeader = (): Record<string, string> => {
  let csrfToken = CsrfUtil.getCsrfValueFromCookie();

  if (!csrfToken) {
    csrfToken = CsrfUtil.getCsrfValue();
  }

  if (!csrfToken) {
    return {};
  }

  return {
    'X-XSRF-TOKEN': csrfToken
  };
};
