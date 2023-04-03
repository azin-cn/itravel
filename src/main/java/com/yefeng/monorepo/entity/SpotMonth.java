package com.yefeng.monorepo.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import java.io.Serializable;
import java.time.LocalDateTime;
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
@TableName("spot_month")
@ApiModel(value = "SpotMonth对象", description = "")
public class SpotMonth implements Serializable {

    private static final long serialVersionUID = 1L;

    private String id;

    private Integer isDeleted;

    private LocalDateTime createdTime;

    private LocalDateTime updatedTime;

    private String spotId;

    private String monthId;

    private Integer weight;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
    public Integer getIsDeleted() {
        return isDeleted;
    }

    public void setIsDeleted(Integer isDeleted) {
        this.isDeleted = isDeleted;
    }
    public LocalDateTime getCreatedTime() {
        return createdTime;
    }

    public void setCreatedTime(LocalDateTime createdTime) {
        this.createdTime = createdTime;
    }
    public LocalDateTime getUpdatedTime() {
        return updatedTime;
    }

    public void setUpdatedTime(LocalDateTime updatedTime) {
        this.updatedTime = updatedTime;
    }
    public String getSpotId() {
        return spotId;
    }

    public void setSpotId(String spotId) {
        this.spotId = spotId;
    }
    public String getMonthId() {
        return monthId;
    }

    public void setMonthId(String monthId) {
        this.monthId = monthId;
    }
    public Integer getWeight() {
        return weight;
    }

    public void setWeight(Integer weight) {
        this.weight = weight;
    }

    @Override
    public String toString() {
        return "SpotMonth{" +
            "id=" + id +
            ", isDeleted=" + isDeleted +
            ", createdTime=" + createdTime +
            ", updatedTime=" + updatedTime +
            ", spotId=" + spotId +
            ", monthId=" + monthId +
            ", weight=" + weight +
        "}";
    }
}
