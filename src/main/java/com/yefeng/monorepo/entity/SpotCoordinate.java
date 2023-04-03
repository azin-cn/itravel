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
@TableName("spot_coordinate")
@ApiModel(value = "SpotCoordinate对象", description = "")
public class SpotCoordinate implements Serializable {

    private static final long serialVersionUID = 1L;

    private String id;

    private Integer point;

    private String spotId;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
    public Integer getPoint() {
        return point;
    }

    public void setPoint(Integer point) {
        this.point = point;
    }
    public String getSpotId() {
        return spotId;
    }

    public void setSpotId(String spotId) {
        this.spotId = spotId;
    }

    @Override
    public String toString() {
        return "SpotCoordinate{" +
            "id=" + id +
            ", point=" + point +
            ", spotId=" + spotId +
        "}";
    }
}
