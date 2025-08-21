import { rest } from "msw";
import transactions from "./transactions.json";

export const handlers = [
  rest.get("/api/transactions", (req, res, ctx) => {
    return res(ctx.json(transactions));
  }),
];