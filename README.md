## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Process

### 学习使用 TypeORM

- @Column 定义普通的列
- @OneToOne 定义一对一的关系
- @ManyToOne
- @OneToMany
- @ManyToMany
- 学习使用 `@JoinTable()`，`@JoinTable()` 是 ManyToMany

保存数据：

在保存实体时，如果使用了@JoinTable()装饰器，那么在保存关联关系时需要注意以下几点：

在插入关联数据之前，需要先保存主实体，因为需要使用 **主实体的 id** 来插入关联关系。

在保存关联数据时，需要先创建一个 **关联实体对象**，并设置好关联的外键。

在使用 save()方法保存关联实体时，如果主实体和关联实体都是新创建的，则需要先保存主实体，然后再保存关联实体，最后通过 Repository.save()方法一次性保存所有数据。

步骤：

- 先存主实体，因为主实体的 id 要作为其他实体的依赖索引
- 再次存其他实体，此时主实体就可以作为其他实体的依赖存入数据库中
- 如果

```ts
const userRepository = getRepository(User);
const roleRepository = getRepository(Role);
const user = new User();
user.username = 'test';
await userRepository.save(user);
const role = new Role();
role.name = 'admin';
role.users = [user];
await roleRepository.save(role);
```

## 记录一次 DTO，Pipe，class-validator 结合使用过程中 class-validator 不生效的原因

### 解决方法

1. 自定义 transform 方法中的 value 是一个来自前端的 `json obj`，需要将其转换成你用 `class-validator` 的装饰器修饰的 `class`，如 class UserDTO 或 class User（用 @IsNotEmpty 装饰器修饰字段/类的 class），**只有转换后校验才会生效！** 转换方法：

```ts
@Injectable()
export class TransformUserPipe implements PipeTransform {
  async transform(value: any) {
    // 将来自请求的数据进项转换
    value = plainToClass(UserDTO, value);
  }
}
```

2. 使用 `validate` 方法校验数据

```ts
@Injectable()
export class TransformUserPipe implements PipeTransform {
  async transform(value: any) {
    // 将来自请求的数据进项转换
    value = plainToClass(UserDTO, value);
    const errors = await validate(value);
    if (errors.length) {
      throw new BadRequestException('参数错误');
    }
  }
}
```

3. 如果不生效，检查一下是否加入了全局 或 Control 或 Method 或 参数

```ts
@Post()
@UsePipes(new TransformUserPipe())
async postUser(@Body() user: User): Promise<User> {
  return await this.userService.create(user);
}

@Post()
async postUser(@Body(new TransformUserPipe()) user: User): Promise<User> {
  return await this.userService.create(user);
}
```

4. 检查一下是否开启了 ValidationPipe

最好在 main.ts 中开启一下 `app.useGlobalPipes(new ValidationPipe());`，如果你能保证在每一个接口都能保持需要的数据类型，那么开不开没多大的意义。

### 详细介绍

因为刚上手 NestJS，对这个不太属性，刚开始我是直接将 DTO 对象(class) 拿到了 Control 层，这也没什么事情能够获取到数据，但是 Control 的各种判断和转换实在难看了，就想着有没有转换管道 Pipe，在查看文档之后发现是有的。

在查看了一番文档之后，便开始动手改造我的 DTO 和 Control

首先是 DTO，为了不写 if-else，我选择使用 class-validator 这个库，这个库具有非常丰富的校验装饰器，具体的可以看看 [Nest class-validator 验证修饰器中文文档](https://blog.csdn.net/qq_38734862/article/details/117265394)

修改完成之后，我的 DTO 为：

```ts
export class UserDTO {
  /**
   * uuid
   */
  @IsNotEmpty({ message: '用户ID必须存在' })
  @IsUUID(undefined, { message: '用户ID必须是UUID形式' })
  id: string;

  /**
   * 用户名称
   */
  @IsOptional()
  @IsString({ message: '用户名必须是字符串！' })
  @Length(6, 20, {
    message: '用户名长度必须为 $constraint1 到 $constraint2 之间',
  })
  username?: string;

  /**
   * 用户密码
   */
  @IsOptional()
  @IsString({ message: '密码必须是字符串！' })
  @Length(6, 20, {
    message: '密码长度必须为 $constraint1 到 $constraint2 之间',
  })
  password?: string;

  // ...
}
```

其中，ID 是必须存在的，其他可以为不传。顺便提一句，如果更新的字段值为 undefined，TypeOrm 是不会进行更新的，只有设置空（null）才会更新。

其次是 Pipe：

```ts
@Injectable()
export class TransformUserPipe implements PipeTransform {
  // 如果参数名称和原有的一样，那么可以直接使用 ClassTransformerPipe
  async transform(u: Partial<UserDTO>): Promise<User> {
    const user = new User();
    user.id = u.id;
    user.username = u.username;
    user.password = u.password;
    return user;
  }
}
```

感觉很奇怪，这种怎么会生效，再次查找之后，是需要加上 validate 进行验证，结果 class-validator 还是不生效

```ts
@Injectable()
export class TransformUserPipe implements PipeTransform {
  // 如果参数名称和原有的一样，那么可以直接使用 ClassTransformerPipe
  async transform(u: Partial<UserDTO>): Promise<User> {
    // 开始校验
    const errors = await validate(u);
    if (errors.length) {
      throw new BadRequestException('参数错误');
    }

    const user = new User();
    user.id = u.id;
    user.username = u.username;
    user.password = u.password;
    return user;
  }
}
```

再次查找之后，发现这个 u 很奇怪，按照道理这阶段是 Pipe，接受的数据应该是前端发过来的 json 数据，是我想当然的将它当成 Partial\<UserDTO\>了，它并不是一个 `class`，而是一个 `json obj`，所以应该使用 Nest.js 提供的 plainToClass 函数进行转换，最后结合校验，完成功能

```ts
@Injectable()
export class TransformUserPipe implements PipeTransform {
  async transform(u: Partial<UserDTO>): Promise<User> {
    // 将来自请求的数据进项转换
    u = plainToClass(UserDTO, u);

    // 开始校验转换类型后的数据
    const errors = await validate(u);
    if (errors.length) {
      const errMsg = errors
        .map((e) => {
          const constrains = e.constraints;
          return Object.values(constrains).join('; \n');
        })
        // 为避免返回过多数据，限制10条
        .filter((_, i) => i < 10)
        // 再次格式化换行
        .join('; \n');
      // log
      throw new BadRequestException(errMsg);
    }

    const user = new User();
    user.id = u.id;
    user.username = u.username;
    user.password = u.password;
    return user;
  }
}
```

最后，最好在 main.ts 中开启一下 `app.useGlobalPipes(new ValidationPipe());`，如果你能保证在每一个接口都能保持需要的数据类型，那么开不开没多大的意义。

## 记录数据库 TypeOrm 的使用

在个人构建一个查询时，需要查出 username、phone、email 其中配对，且并未删除的用户，刚开始看其他博客创建一个查询 handle，这里我没有指定表明，按照 TypeOrm 的默认方式查询，但是这引发了一个问题。

> 来自 chatgpt 的解释
> 在 NestJS 中使用 TypeORM 进行查询时，TypeORM 会默认自动将实体类中的属性名转换为数据库表的列名，并添加别名以便在查询结果中正确映射。例如，如果您有一个名为 User 的实体类，其中包含一个名为 username 的属性，则在查询中，TypeORM 将自动将 User.username 转换为 User_username，并将其用作查询结果的列名。
> 如果您不想使用 TypeORM 的默认列名转换逻辑，可以使用 QueryBuilder 对象手动指定要查询的列名。
>
> ```ts
> import { getRepository } from 'typeorm';
> import { User } from './user.entity';
> const userRepository = getRepository(User);
> const users = await userRepository
>   .createQueryBuilder('user')
>   .select(['user.id', 'user.name'])
>   .getMany();
> ```

也就是说如果不用 `where andWere orWhere` 这些 TypeOrm 提供的函数，而是使用自定义的 `user.username`，那么需要指定一下表明或者是选择的列。

```ts
/**
 * 通过唯一条件查找用户，管理员模式
 * @param _user
 * @param isDeleted
 * @returns
 */
async findUserByUniqueParamAdmin(_user: User, isDeleted = true) {
  const { username, phone, email } = _user;
  const handle = this.userRepository.createQueryBuilder('user');
  // .select(['username', 'phone', 'email']);
  handle.where(
    '(user.username = :username OR user.phone = :phone OR user.email = :email)',
    { username, phone, email },
  );
  if (!isDeleted) {
    // isDeleted 只在 为false时起效，不代表不查询已删除
    handle.andWhere('user.is_deleted = :isDeleted', { isDeleted });
  }
  return handle.getOne();
}
```

## class-validator 验证数据问题

```ts
import { ValidationPipe } from '@nestjs/common';

如果手动 validate，如果加上这条语句则会验证两次

app.useGlobalPipes(new ValidationPipe())
```

## 忽略全局拦截器

- 在指定的 Control 或 Route 上添加 `@SkipGlobalInterceptors()`
- 在指定的 Control 或 Route 上添加空数组覆盖全局拦截器 `@UseInterceptors([])`，如果希望加入其他的拦截器，可以有以下写法

```ts
@UseInterceptor([])
@UseInterceptor(interceptor1, interceptor2)
@Get(":id")
async getUserById() {}
```

## Nestjs 使用拦截器统一返回数据

可以选择每一个路由生成 ResultVO 对象返回，也可以使用拦截器统一的返回 ResultVO 形式

```ts
export class HttpResponseInterceptor implement NestInterceptor {
  intercept(ctc: ExecutionContext, next: CallHandle) {

  }
}
```

## Nestjs 使用 passport 和 @nestjs/passport 和 @nestjs/jwt 进行 jwt 认证

### 遇到的问题一：secretOrPrivateKey must have a value

首先寻找到的解决方法：不要在其他未导入 JwtModule 的模块中使用 JwtService

> JwtService 导入其他模块。您只能在已注册 JWTModule 的模块上使用它
> 查看链接：https://codesti.com/issue/nestjs/jwt/1063

其次寻找自身的原因：按照规范导入需要的 Module，而不是乱导入 Service。

如本人此次问题是在 UserModule 中导入了 JwtService，但是做的验证是在 AuthModule 中，所以就会出现这个问题。需要正确的依赖关系才不会出现奇奇怪怪的问题，如我需要在 AuthModule 中用到 UserService 的服务，那么有两种方式：

- 在 AuthModule 的 providers 中导入 UserService，如果使用的 UserService 使用了 TypeOrm，那么还需要在 AuthModule 的 imports 中导入 TypeOrm 的 UserModule (TypeOrmModule.forFeature([User]))，甚至 UserService 用了其他模块的 Service，那么 AuthModule 也需要导入其他模块 Service。从导入方式就可知道，这是一个非常复杂的依赖管理。
- 在各自的 Module 的 exports 中导出其他模块可能需要用的 Module 或者 Service，如 UserModule 使用了 TagModule，AuthModule 使用了 User Module 和 TagModule，只要在 TagModule 的 exports 中导出 TagService、TypeOrmModule.forFeature([Tag])，UserModule 的 exports 中导出 UserService，TypeOrmModule.forFeature([User])，无需再次导出 TagModule 或 TagService，AuthModule 只导入 UserModule 就能正常使用。特别注意，最好将每一个 entity 的 Module 的 TypeOrmModule.forFeature([Entity]) 导出，否则其他模块需要用到该模块的 Repository 时还需要导入该模块 Repository： TypeOrmModule.forFeature([xxx, yyy])

### 遇到的问题二： ERROR [ExceptionsHandler] Expected "payload" to be a plain object.

只能是一个普通的 JSON 对象，使用 instanceToPlain 即可

## Nestjs 打包问题

- 使用 webpack 进行打包，进行一定的 webpack 配置
  - https://juejin.cn/post/6937618804767719460
  - https://juejin.cn/post/7175937839069134903
- 当遇到 Can't resolve ...的问题时，可以尝试添加到 lazyImports 中。

### 使用 webpack 打包时会有很多意想不到的 bug，比如会发生依赖注入错误错误，所以还是选择默认的打包方式，用 cross-env 加以区分环境

特别注意：两条命令之间请不要加上 `&&`

```json
{
  "start": "cross-env NODE_ENV=production nest start",
  "start:prod": "cross-env NODE_ENV=production node dist/main",
  "build:prod": "cross-env NODE_ENV=production nest build"
}
```

## Nestjs 打包 .env 问题

Nestjs 不会打包非 `ts, js` 的文件，所以在选择配置文件类型时，`.env.production, .env.development` 不会被打包到 dist 目录。

- 选择 ts、js 的配置文件形式
- 或者选择修改 nest-cli:complierOptions，注意 `include` 一定要包含 `../` 否则会多出一层 config

```json
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "assets": [
      {
        "include": "../config/*.env*",
        "outDir": "./dist/config"
      }
    ]
  }
}
```

## Nestjs 的 AuthModule 和 UserModule 的模块依赖问题

在项目的配置中，个人单独将认证模块抽出形成 AuthModule 和 UserModule，但是在 AuthModule 中需要 UserModule 的服务，如 UserRepository 和 UserService 进行用户的索引和认证，因而在 AuthModule 的 imports 中必须要导入 UserModule，但是在用户信息的控制中，需要使用 Guard 进行守护，如通过 Id 获取用户信息，所以需要使用到 JwtModule 的相关装饰器/注解。

为了方便，将 JwtModule 注入 AuthModule 中进行 token 生成和认证，而在 UserModule 中用到的 `@UserGuard(AuthGuard('jwt'))` 这些装饰器，则必须要将 JwtModule、PassportModule 中注入 UserModule 中，所以需要将 AuthModule 中加入 UserModule 的 imports，当然也可以单独的将 JwtModule、PassportModule 导入 UserModule 的 imports。如果将 AuthModule 导入 UserModule，而 UserModule 之前就已经导入 AuthModule，这就会形成一个循环依赖，需要用到 NestJS 提供的 `forwardRef` 函数进行延迟导入，如 `forwardRef(() => UserModule)`

## Nestjs .env 等配置文件的加载需要使用 Async 形式，而不是.forRoot

Nestjs 加载配置文件时，如果使用的是非 .js .ts 的配置文件进行配置，那么应该使用 Async 的形式进行配置，如：

- TypeOrmModule.forRootAsync()
- JwtModule.registerAsync(),

将其传入后，使用 Async 中的 useFactory 即可异步获取配置文件信息，如何从配置文件中获取信息呢，可以使用 ConfigModule 进行获取

```ts
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (): Promise<XXXModuleOptions> => ({})
```

我通常的做法是将配置选项再次抽离，如在.env 文件中配置 DATABASE 环境，而 db.config.ts 则是获取.env 的变量，形成对应的 ModuleOptions

## Nestjs JwtModule 结合其他守卫使用

在查看他人的教程中，很多人也是一直半解，从这个博客抄到另外一个博客，没有解释清楚为什么要这样给使用，今天查了一下 JwtStrategy 中 validate 方法的参数和为什么很多例子中都会从 request 对象获取 user。

- jwtStrategy 会自动从请求头中获取 Authorization 字段，然后根据这个字段进行 token 校验解码，得到 token 的 payload，这个 payload 也就是在生成 token 的时候加入的 payload。
- 解析完成后，jwtStrategy 默认会将 payload 加入到请求对象中，属性名是 `user`，如果需要与数据库关联，需要进行数据库查询！
- validate 方法中，默认传入的参数就是 payload

## Nestjs 角色管理问题
