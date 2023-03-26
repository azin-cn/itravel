import { getOrdefault } from './utils';

export const getCommonConf = () => ({
  hostname: getOrdefault('HOSTNAME', 'localhost'),
});
