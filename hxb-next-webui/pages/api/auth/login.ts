import type { NextApiRequest, NextApiResponse } from "next";
import { HandlerError, handleLogin } from "@auth0/nextjs-auth0";

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.query.connection) {
      await handleLogin(req, res, {
        authorizationParams: {
          connection: req.query.connection,
        },
      });
      return;
    }
    await handleLogin(req, res);
  } catch (error) {
    console.error(error);
    throw new HandlerError(error);
  }
}
