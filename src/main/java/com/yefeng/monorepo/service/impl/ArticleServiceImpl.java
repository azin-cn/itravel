package com.yefeng.monorepo.service.impl;

import com.yefeng.monorepo.entity.Article;
import com.yefeng.monorepo.mapper.ArticleMapper;
import com.yefeng.monorepo.service.IArticleService;
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
public class ArticleServiceImpl extends ServiceImpl<ArticleMapper, Article> implements IArticleService {

}
