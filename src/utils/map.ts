import { get } from 'https';
import { FeatureCollection } from 'typeorm';

export function getJson(url: string): Promise<FeatureCollection> {
  return new Promise((resolve, reject) => {
    const req = get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        if (res.headers['content-type'] !== 'application/json') {
          reject(data);
          return;
        }
        resolve(JSON.parse(data));
      });
      res.on('error', reject);
    });
    req.on('error', reject);
  });
}

/**
 * code 获取
 * @param code
 * @returns
 */
export function getMapJsonWithCode(code: string): Promise<FeatureCollection> {
  const url = `https://geo.datav.aliyun.com/areas_v3/bound/${code}_full.json`;
  console.log(url);
  return getJson(url);
}

export default { getJson, getMapJsonWithCode };
