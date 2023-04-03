package com.yefeng.monorepo.service.impl;

import com.yefeng.monorepo.entity.Comment;
import com.yefeng.monorepo.mapper.CommentMapper;
import com.yefeng.monorepo.service.ICommentService;
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
public class CommentServiceImpl extends ServiceImpl<CommentMapper, Comment> implements ICommentService {

}
