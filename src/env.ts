import * as fs from 'fs';
import * as path from 'path';

const isProd = process.env.NODE_ENV === 'production';

/**
 * 获取配置文件
 * nestjs 默认不打包非 js、ts 文件，详情可查看 nestjs build 完成后目录结构
 * 方法一：选择 .env 类型的配置文件，（在项目根目录创建 .env 文件和 env.ts）观察 build 后 dist 结构
 * nestjs 默认会读取 根目录下 .env 文件用于配置环境
 * https://docs.nestjs.cn/9/cli?id=%e5%85%a8%e5%b1%80%e7%bc%96%e8%af%91%e5%99%a8%e9%80%89%e9%a1%b9
 *
 * 方法二：选择 js、ts、json 文件配置（推荐）
 * 优点：对象类型，拓展性更强
 * 缺点：js、ts 文件更适用于 js、ts 项目
 * 在项目根目录或者 src 目录下创建 config 文件夹，内部可选择性的创建 database.config.ts | global.config.ts 等
 *
 * 注意不能使用 __dirname，这不会上传到GitHub，只需要在部署时，复制env文件到根目录即可
 */
export function parseEnv() {
  // const localEnv = path.resolve('./.env');
  const devEnv = path.resolve('.env.development');
  const prodEnv = path.resolve('.env.production');
  // console.log('env = ', process.env.NODE_ENV);

  if (!fs.existsSync(devEnv) && !fs.existsSync(prodEnv)) {
    throw new Error('配置文件不存在，请在根目录下创建配置文件！');
  }

  const filePath = isProd && fs.existsSync(prodEnv) ? prodEnv : devEnv;

  return { path: filePath };
}

export default parseEnv();
