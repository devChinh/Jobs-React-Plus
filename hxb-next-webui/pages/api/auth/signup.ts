import type { NextApiRequest, NextApiResponse } from "next";
import { HandlerError, handleLogin } from "@auth0/nextjs-auth0";
export default async function signup(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.query.connection) {
      const urlSignup = `${process.env.URL}/auth/loading`;
      await handleLogin(req, res, {
        authorizationParams: {
          connection: req.query.connection,
        },
        returnTo: urlSignup
      },);
      return;
    }
    await handleLogin(req, res);
  } catch (error) {
    throw new HandlerError(error);
  }
}
