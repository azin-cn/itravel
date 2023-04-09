import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { Feature } from 'src/entities/feature.entity';
import { Month } from 'src/entities/month.entity';

export class SpotBaseVO {
  /**
   * 景点id
   */
  @ApiProperty({ description: '景点id' })
  id: string = '';

  /**
   * 景点名称
   */
  @ApiProperty({ description: '景点名称' })
  name: string = '';

  /**
   * 景点简介
   */
  @ApiProperty({ description: '景点简介' })
  description: string = '';

  /**
   * 缩略图
   */
  @ApiProperty({ description: '缩略图' })
  thumbUrl: string = '';

  /**
   * 权重
   */
  @ApiProperty({ description: '权重' })
  @Transform(({ value }) => Number(value))
  weight: number;
}

export class SpotCountVO {
  /**
   * 区域id
   */
  @ApiProperty({ description: '区域id' })
  id: string;

  /**
   * 区域名称
   */
  @ApiProperty({ description: '区域名称' })
  name: string;

  /**
   * 区域全名
   */
  @ApiProperty({ description: '区域全名' })
  fullName: string;
  /**
   * 景点数量
   */
  @ApiProperty({ description: '景点数量' })
  @Transform(({ value }) => Number(value))
  value: number;
}

export class SpotBriefVO extends SpotBaseVO {
  /**
   * 区域
   */
  @ApiProperty({ description: '区域' })
  region: string;

  /**
   * 区域id
   */
  @ApiProperty({ description: '区域id' })
  regionId: string;

  /**
   * 区域等级
   */
  @ApiProperty({ description: '区域等级' })
  level: 'country' | 'province' | 'city' | 'district';

  /**
   * 创建时间
   */
  @ApiProperty({ description: '创建时间' })
  createdTime: string;

  /**
   * 更新时间
   */
  @ApiProperty({ description: '更新时间' })
  updatedTime: string;
}

/**
 * 景点的月份和特色
 */
export class SpotFMVO extends SpotBaseVO {
  /**
   * 景点月份
   */
  months: Month[];

  /**
   * 景点特色
   */
  features: Feature[];

  /**
   * 获取元数据信息
   * fields
   */
  static getMetadata<T>(instance: object): Record<string, string> {
    const metadata: Record<string, string> = {};
    /**
     * 获取实例的key，必须要显式的初始化后才能获取！
     */
    Object.keys(instance).forEach((key) => {
      metadata[key] = key;
    });
    return metadata;
  }

  /**
   * 构造对象
   */
  static mapResultSetToVO<T>(dataset: any[]): SpotFMVO {
    const instance = new SpotFMVO();

    const metadata = SpotFMVO.getMetadata(instance);
    console.log(
      metadata,
      Object.getOwnPropertyNames(SpotFMVO),
      Object.keys(Object.getOwnPropertyNames(SpotFMVO)),
      instance,
    );

    dataset?.forEach((item) => {
      /**
       * 遍历每一个数据
       */
      const month = new Month();
      const feature = new Feature();

      Object.keys(item).forEach((key) => {
        /**
         * 遍历每一个key
         */
        if (metadata[key]) {
          instance[key] = item[key];
          return;
        }

        /**
         * 当不存在key时，以特殊的分隔符作为标识
         * 可以通过反射拿到数据类型并进行构建，但是为了方便直接使用
         */
        const [prefix, postfix] = key.split('_');
        if (prefix === 'months') {
          month[postfix] = item[key];
          if (key === 'months_id') {
            /**
             * 判断是否push
             */
            instance.months = instance.months || new Array<Month>();
            const isExists = instance.months.find(
              (ins) => ins.id === item[key],
            );
            if (!isExists) instance.months.push(month);
          }
        } else if (prefix === 'features') {
          feature[postfix] = item[key];
          if (key === 'features_id') {
            instance.features = instance.features || new Array<Feature>();
            const isExists = instance.features.find(
              (ins) => ins.id === item[key],
            );
            if (!isExists) instance.features.push(feature);
          }
        }
      });
    });

    return instance;
  }
}
