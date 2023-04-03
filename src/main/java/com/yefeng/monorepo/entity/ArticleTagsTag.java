package com.yefeng.monorepo.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import java.io.Serializable;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

/**
 * <p>
 * 
 * </p>
 *
 * @author yefeng
 * @since 2023-04-03
 */
@TableName("article_tags_tag")
@ApiModel(value = "ArticleTagsTag对象", description = "")
public class ArticleTagsTag implements Serializable {

    private static final long serialVersionUID = 1L;

    private String articleId;

    private String tagId;

    public String getArticleId() {
        return articleId;
    }

    public void setArticleId(String articleId) {
        this.articleId = articleId;
    }
    public String getTagId() {
        return tagId;
    }

    public void setTagId(String tagId) {
        this.tagId = tagId;
    }

    @Override
    public String toString() {
        return "ArticleTagsTag{" +
            "articleId=" + articleId +
            ", tagId=" + tagId +
        "}";
    }
}
