package com.yefeng.monorepo.service.impl;

import com.yefeng.monorepo.entity.User;
import com.yefeng.monorepo.mapper.UserMapper;
import com.yefeng.monorepo.service.IUserService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

/**
 * <p>
 *  服务实现类
 * </p>
 *
 * @author yefeng
 * @since 2023-04-03
 */
@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements IUserService {

}
