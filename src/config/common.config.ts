import { getOrdefault } from './utils';

export const getCommonConf = () => ({
  hostname: getOrdefault('CUSTOMER_HOSTNAME', 'localhost'),
});
