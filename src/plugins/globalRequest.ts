import { extend } from 'dayjs';

const request = extend({
  // @ts-ignore
  credentials: 'include', // 默认请求是否带上cookie
  prefix:
    process.env.NODE_ENV === 'production' ? 'http://124.222.46.223:8080' : 'http://localhost:8080',
});
export default request;
