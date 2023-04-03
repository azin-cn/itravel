package com.yefeng.monorepo.service.impl;

import com.yefeng.monorepo.entity.Title;
import com.yefeng.monorepo.mapper.TitleMapper;
import com.yefeng.monorepo.service.ITitleService;
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
public class TitleServiceImpl extends ServiceImpl<TitleMapper, Title> implements ITitleService {

}
