package com.yefeng.monorepo.entity;

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
@ApiModel(value = "Spot对象", description = "")
public class Spot implements Serializable {

    private static final long serialVersionUID = 1L;

    private String id;

    private String name;

    private String description;

    private Integer isDeleted;

    private LocalDateTime createdTime;

    private LocalDateTime updatedTime;

    private String provinceId;

    private String countryId;

    private String cityId;

    private String districtId;

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
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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
    public String getProvinceId() {
        return provinceId;
    }

    public void setProvinceId(String provinceId) {
        this.provinceId = provinceId;
    }
    public String getCountryId() {
        return countryId;
    }

    public void setCountryId(String countryId) {
        this.countryId = countryId;
    }
    public String getCityId() {
        return cityId;
    }

    public void setCityId(String cityId) {
        this.cityId = cityId;
    }
    public String getDistrictId() {
        return districtId;
    }

    public void setDistrictId(String districtId) {
        this.districtId = districtId;
    }

    @Override
    public String toString() {
        return "Spot{" +
            "id=" + id +
            ", name=" + name +
            ", description=" + description +
            ", isDeleted=" + isDeleted +
            ", createdTime=" + createdTime +
            ", updatedTime=" + updatedTime +
            ", provinceId=" + provinceId +
            ", countryId=" + countryId +
            ", cityId=" + cityId +
            ", districtId=" + districtId +
        "}";
    }
}
