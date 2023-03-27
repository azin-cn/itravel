import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Exclude } from 'class-transformer';
import strRandom from 'string-random';
import { Article } from './article.entity';
import { Title } from './title.entity';
import { Tag } from './tag.entity';
import { USER_ROLES } from 'src/shared/constants/user.constant';
import { Category } from './category.entity';

@Entity('user')
export class User {
  /**
   * user id
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * 用户名称
   */
  @Column({ nullable: true })
  username: string;

  /**
   * 用户角色
   * 0：普通游客
   * 1：作者
   * 2：管理员
   * 3：超级管理员
   */
  @Column('simple-enum', { enum: USER_ROLES.getAll() })
  role: number;

  /**
   * 用户头像
   */
  @Column({
    default:
      'https://th.bing.com/th/id/OIP.37mLTapohqg7soL2wzLFyQAAAA?pid=ImgDet&rs=1',
  })
  avatar: string;

  /**
   * 用户密码
   * @Exclude() 结合 ClassSerializerInterceptor 拦截器使用能将密码字段排除后返回
   * 如果注册时没有提供密码，则设置一个随机的密码作为默认密码
   */
  @Exclude()
  @Column({ nullable: true, default: strRandom(32) })
  password: string;

  /**
   *
   */
  @BeforeInsert()
  @BeforeUpdate()
  async encryptPwd() {
    if (this.password) {
      this.password = bcrypt.hashSync(this.password, 10);
    }
  }

  /**
   * 用户简介
   */
  @Column({ nullable: true })
  description: string;

  /**
   * 用户邮箱
   */
  @Column({ nullable: true })
  email: string;

  /**
   * 用户号码
   */
  @Column({ nullable: true })
  phone: string;

  /**
   * 是否为园区，0 标识普通游客，1，2，方便以后拓展景区等级
   */
  @Column({ default: 0 })
  scenicArea: number;

  /**
   * 访客数量
   */
  @Column({ default: 0 })
  visitors: number;

  /**
   * 用户头衔
   */
  @OneToOne(() => Title, (title) => title.user)
  @JoinColumn()
  title: Title;

  /**
   * 用户创建的文章分类
   */
  @OneToMany(() => Category, (category) => category.user)
  categories: Category[];

  /**
   * 用户创建的文章标签
   */
  @OneToMany(() => Tag, (tag) => tag.user)
  tags: Tag[];

  /**
   * 创建的文章
   */
  @OneToMany(() => Article, (article) => article.author) //一对多，回调返回的类型，注入关联的属性
  articles: Article[];

  /**
   * 上一次登录时间
   */
  @Column({ nullable: true, type: 'timestamp' })
  lastTime: Date;

  /**
   * 是否激活
   * 主要用于邮箱链接激活
   * 未激活：0
   * 已激活：1
   */
  @Column({ default: 1 })
  status: number;

  /**
   * 是否删除
   * @Exclude() 结合 ClassSerializerInterceptor 拦截器使用能将密码字段排除后返回
   */
  @Exclude()
  @Column({ default: false })
  isDeleted: boolean;

  /**
   * 创建时间
   */
  @CreateDateColumn({ type: 'timestamp' })
  createdTime: Date;

  /**
   * 更新时间
   */
  @UpdateDateColumn({ type: 'timestamp' })
  updatedTime: Date;
}
