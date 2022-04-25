export const successResponse = (data?: any): Partial<Response> => {
  return {
    ok: true,
    status: 200,
    json: () => Promise.resolve(data)
  };
};

export const failureResponse = (data?: any): Partial<Response> => {
  return {
    ok: false,
    status: 500,
    json: () => Promise.resolve(data)
  };
};

export const fetchSpy = (response: Partial<Response>) => {
  return jest
    .spyOn(global, 'fetch')
    .mockImplementation(jest.fn(() => {
      return Promise.resolve(response);
    }) as jest.Mock);
};

export default fetchSpy;
