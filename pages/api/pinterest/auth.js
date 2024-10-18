export default function handler(req, res) {
  const pinterestAuthUrl = `https://www.pinterest.com/oauth/?client_id=${process.env.NEXT_PUBLIC_PINTEREST_APP_ID}&redirect_uri=${process.env.NEXT_PUBLIC_PINTEREST_REDIRECT_URI}&response_type=code&scope=pins:read,boards:read`;

  res.redirect(pinterestAuthUrl);
}
