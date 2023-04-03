package com.yefeng.monorepo.service.impl;

import com.yefeng.monorepo.entity.City;
import com.yefeng.monorepo.mapper.CityMapper;
import com.yefeng.monorepo.service.ICityService;
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
public class CityServiceImpl extends ServiceImpl<CityMapper, City> implements ICityService {

}
