package com.yefeng.monorepo.service.impl;

import com.yefeng.monorepo.entity.Month;
import com.yefeng.monorepo.mapper.MonthMapper;
import com.yefeng.monorepo.service.IMonthService;
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
public class MonthServiceImpl extends ServiceImpl<MonthMapper, Month> implements IMonthService {

}
