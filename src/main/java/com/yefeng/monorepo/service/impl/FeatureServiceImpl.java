package com.yefeng.monorepo.service.impl;

import com.yefeng.monorepo.entity.Feature;
import com.yefeng.monorepo.mapper.FeatureMapper;
import com.yefeng.monorepo.service.IFeatureService;
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
public class FeatureServiceImpl extends ServiceImpl<FeatureMapper, Feature> implements IFeatureService {

}
