import { getCsrfTokenHeader } from '../../getCsrfTokenHeader';

export class AuthService {
  async logout(url: string = '/sso/logout', requestOpts?: RequestInit): Promise<void> {
    try {
      const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          ...getCsrfTokenHeader()
        },
        ...requestOpts
      });

      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }

      if (response.url) {
        window.location.href = response.url;
      } else {
        window.location.reload();
      }
    } catch (error) {
      throw new Error(`Error while logging out: ${error}`);
    }
  }

}

export default AuthService;
