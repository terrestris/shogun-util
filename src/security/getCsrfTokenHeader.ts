import CsrfUtil from '@terrestris/base-util/dist/CsrfUtil/CsrfUtil';

export interface CsrfTokenHeader {
  'X-XSRF-TOKEN': string;
}

export const getCsrfTokenHeader = (): CsrfTokenHeader | undefined => {
  let csrfToken = CsrfUtil.getCsrfValueFromCookie();

  if (!csrfToken) {
    csrfToken = CsrfUtil.getCsrfValue();
  }

  if (!csrfToken) {
    return;
  }

  return {
    'X-XSRF-TOKEN': csrfToken
  };
};
