import * as fs from 'fs';
import * as path from 'path';

const resolve = (dir?: string): string => path.resolve(__dirname, dir || ''); // fix null

const isProd = process.env.NODE_ENV === 'production';

/**
 * 获取配置文件
 */
export function parseEnv() {
  const localEnv = resolve('../../.env');
  const prodEnv = resolve('../../.env.production');

  if (!fs.existsSync(localEnv) && !fs.existsSync(prodEnv)) {
    throw new Error('配置文件不存在，请在根目录下创建配置文件！');
  }

  const filePath = isProd && fs.existsSync(prodEnv) ? prodEnv : localEnv;

  return { path: filePath };
}

export default parseEnv();
