// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
  getAccessToken,
  withApiAuthRequired,
  getSession,
} from "@auth0/nextjs-auth0";

export default withApiAuthRequired(async function products(req, res) {
  // If your Access Token is expired and you have a Refresh Token
  // `getAccessToken` will fetch you a new one using the `refresh_token` grant
  const session = getSession(req, res);
  const { accessToken } = await getAccessToken(req, res);
  res.status(200).json({
    accessToken,
    session,
  });
});
