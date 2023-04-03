package com.yefeng.monorepo.service.impl;

import com.yefeng.monorepo.entity.Tag;
import com.yefeng.monorepo.mapper.TagMapper;
import com.yefeng.monorepo.service.ITagService;
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
public class TagServiceImpl extends ServiceImpl<TagMapper, Tag> implements ITagService {

}
