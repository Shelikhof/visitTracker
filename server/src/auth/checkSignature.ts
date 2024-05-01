import { createHash, createHmac } from 'crypto';

//проверка подлинности хэша https://gist.github.com/Pitasi/574cb19348141d7bf8de83a0555fd2dc
function checkSignature(token, { hash, ...data }) {
  const secret = createHash('sha256').update(token).digest();
  const checkString = Object.keys(data)
    .sort()
    .map((k) => `${k}=${data[k]}`)
    .join('\n');
  const hmac = createHmac('sha256', secret).update(checkString).digest('hex');
  return hmac === hash;
}

export default checkSignature;
