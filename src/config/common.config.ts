import { getOrdefault } from './utils';

export const getCommonConf = () => ({
  hostname: getOrdefault('CUSTOMER_HOSTNAME', 'localhost'),
  authPrefix: getOrdefault('AUTH_HTTP_PREFIX', 'localhost'),
});
