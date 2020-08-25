import { rest } from 'msw';

const apiUrl =
  process.env.NODE_ENV === 'production'
    ? `https://grouptripper.herokuapp.com:${process.env.PORT}/api`
    : process.env.REACT_APP_API_URL;

export const handlers = [
  rest.get(`${apiUrl}/greeting`, (req, res, ctx) => {
    return res(ctx.json({ message: 'hello world' }));
  }),
];
