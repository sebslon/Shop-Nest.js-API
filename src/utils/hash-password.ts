import * as crypto from 'crypto';

export const hashPassword = (p: string): string => {
  const hmac = crypto.createHmac('sha512', 'MY_SECRET_KEY');
  hmac.update(p);
  return hmac.digest('hex');
};
