package com.yefeng.monorepo.entity;

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
@ApiModel(value = "District对象", description = "")
public class District implements Serializable {

    private static final long serialVersionUID = 1L;

    private String id;

    private String name;

    private String fullName;

    private String aid;

    private String bid;

    private String tid;

    private String cityId;

    private Integer weight;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
    public String getAid() {
        return aid;
    }

    public void setAid(String aid) {
        this.aid = aid;
    }
    public String getBid() {
        return bid;
    }

    public void setBid(String bid) {
        this.bid = bid;
    }
    public String getTid() {
        return tid;
    }

    public void setTid(String tid) {
        this.tid = tid;
    }
    public String getCityId() {
        return cityId;
    }

    public void setCityId(String cityId) {
        this.cityId = cityId;
    }
    public Integer getWeight() {
        return weight;
    }

    public void setWeight(Integer weight) {
        this.weight = weight;
    }

    @Override
    public String toString() {
        return "District{" +
            "id=" + id +
            ", name=" + name +
            ", fullName=" + fullName +
            ", aid=" + aid +
            ", bid=" + bid +
            ", tid=" + tid +
            ", cityId=" + cityId +
            ", weight=" + weight +
        "}";
    }
}
