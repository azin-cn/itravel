import { ApiPropertyOptional } from '@nestjs/swagger';
import { Category } from 'src/entities/category.entity';
import { City } from 'src/entities/city.entity';
import { Country } from 'src/entities/country.entity';
import { District } from 'src/entities/district.entity';
import { Feature } from 'src/entities/feature.entity';
import { Month } from 'src/entities/month.entity';
import { Province } from 'src/entities/province.entity';
import { Spot } from 'src/entities/spot.entity';
import { Tag } from 'src/entities/tag.entity';
import { User } from 'src/entities/user.entity';

export class WorkspaceCounterVO {
  @ApiPropertyOptional({ description: '景点总数量' })
  spotCount: number;

  @ApiPropertyOptional({ description: '文章总数量' })
  articleCount: number;

  @ApiPropertyOptional({ description: '日新增文章数量' })
  todayArticleCount: number;

  @ApiPropertyOptional({ description: '昨日新增文章数量' })
  yesterdayArticleCount: number;

  @ApiPropertyOptional({ description: '评论总数量' })
  commentCount: number;

  @ApiPropertyOptional({ description: '日新增评论数量' })
  todayCommentCount: number;

  @ApiPropertyOptional({ description: '昨日新增评论数量' })
  yesterdayCommentCount: number;
}

export class WorkspaceVO {
  counter: WorkspaceCounterVO;
}

export class SpotVO {
  /**
   * 景点id
   */
  @ApiPropertyOptional({ description: '景点id' })
  id: string;

  /**
   * 景点名称
   */
  @ApiPropertyOptional({ description: '景点名称' })
  name: string;

  /**
   * 景点简介
   */
  @ApiPropertyOptional({ description: '景点简介' })
  description: string;

  /**
   * 缩略图
   */
  @ApiPropertyOptional({ description: '缩略图' })
  thumbUrl: string;

  /**
   * 景点全景图
   */
  @ApiPropertyOptional({ description: '景点全景图' })
  panorama: string;

  /**
   * 权重
   */
  @ApiPropertyOptional({ description: '权重' })
  weight: number;

  /**
   * 适合月份
   */
  @ApiPropertyOptional({ description: '适合月份' })
  months: Month[];

  /**
   * 景点特色
   */
  @ApiPropertyOptional({ description: '景点特色' })
  features: Feature[];

  /**
   * 所属的国家
   * TODO：未来实现不同国家
   */
  @ApiPropertyOptional({ description: '所属的国家' })
  country: Country;

  /**
   * 所属省份
   */
  @ApiPropertyOptional({ description: '所属省份' })
  province: Province;

  /**
   * 所属城市
   */
  @ApiPropertyOptional({ description: '所属城市' })
  city: City;

  /**
   * 所属县区
   */
  @ApiPropertyOptional({ description: '所属县区' })
  district: District;

  /**
   * 创建时间
   */
  @ApiPropertyOptional({ description: '创建时间' })
  createdTime: string;

  /**
   * 更新时间
   */
  @ApiPropertyOptional({ description: '更新时间' })
  updatedTime: string;
}

export class ArticleVO {
  /**
   * 文章ID
   */
  @ApiPropertyOptional({ description: '文章ID' })
  id: string;

  /**
   * 文章title
   */
  @ApiPropertyOptional({ description: '文章title' })
  title: string;

  /**
   * 文章作者
   * 将user的主键作为article中的外键
   */
  @ApiPropertyOptional({ description: '文章作者' })
  author: User;

  /**
   * 文章缩略图
   */
  @ApiPropertyOptional({ description: '文章缩略图URL' })
  thumbUrl: string;

  /**
   * 文章的简要
   */
  @ApiPropertyOptional({ description: '文章的简要' })
  summary: string;

  /**
   * 文章内容
   */
  @ApiPropertyOptional({ description: '文章内容' })
  content: string;

  /**
   * 评论数量
   * 隐藏字段，防止在查询时返回，只用作 Article 实体返回数据
   */
  @ApiPropertyOptional({ description: '评论数量' })
  commentCount: number;

  /**
   * 浏览量
   */
  @ApiPropertyOptional({ description: '浏览量' })
  viewCount: number;

  /**
   * 点赞量
   */
  @ApiPropertyOptional({ description: '点赞量' })
  likeCount: number;

  /**
   * 收藏量
   */
  @ApiPropertyOptional({ description: '收藏量' })
  favCount: number;

  /**
   * 图片集合
   */
  @ApiPropertyOptional({ description: '图片集合' })
  images: string[];

  /**
   * 文章分类
   * 将category的主键作为article中的外键
   */
  @ApiPropertyOptional({ description: '文章分类' })
  category: Category;

  /**
   * 文章标签
   */
  @ApiPropertyOptional({ description: '文章标签' })
  tags: Tag[];

  /**
   * 文章状态
   * ARTICLE.DRAFT 0 未发布、草稿箱
   * ARTICLE.PUBLISH 1 已发布
   */
  @ApiPropertyOptional({ description: '文章状态' })
  status: number;

  /**
   * 关联的景点
   */
  @ApiPropertyOptional({ description: '关联的景点' })
  spot: Spot;

  /**
   * 发布时间
   */
  @ApiPropertyOptional({ description: '发布时间' })
  publishTime: Date;

  /**
   * 是否删除
   */
  @ApiPropertyOptional({ description: '是否删除' })
  isDeleted: boolean;

  /**
   * 创建时间
   * YYYY-MM-DD HH:mm:ss
   */
  @ApiPropertyOptional({ description: '创建时间' })
  createdTime: string;

  /**
   * 更新时间
   */
  @ApiPropertyOptional({ description: '更新时间' })
  updatedTime: string;
}

export class UserVO {}
