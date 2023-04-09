-- 根据月份权重和、特色权重和、区域的权重的总体和的景点排序sql

select
    spot.id,
    spot.name,
    sm.smw,
    sf.sfw,
    -- ${itemArea}.weight ${itemArea}.name
    province.weight `pw`, (
        sm.smw + sf.sfw + province.weight
    ) weight,
    province.name `pname`
from spot
    left join (
        select
            spot_id,
            sum(weight) as smw
        from spot_month
        where
            month_id in (
                "0c4c32c8-5c46-457a-bb54-1bd067b635c5"
            )
        group by
            spot_id
    ) `sm` on sm.spot_id = spot.id
    left join (
        select
            spot_id,
            sum(weight) as sfw
        from spot_feature
        where
            feature_id in (
                "0c4326bb-ce1c-4cef-b9fb-bad48288f768"
            )
        group by
            spot_id
    ) `sf` on sf.spot_id = spot.id
    left join country on country.id = spot.country_id -- area
    left join province on province.id = spot.province_id -- itemArea
where
    country.name = '中国'
    AND province.`name` = '广东'
order by weight desc;

-- 指定id搜索spot

select
    spot.id,
    spot.name,
    province.id `province_id`,
    province.name `province_name`,
    city.id `city_id`,
    city.name `city_name`
from spot
    left join province on province.id = spot.province_id
    left join city on city.id = spot.city_id
where
    spot.id = '00020fcd-9bfe-4299-8ffb-93db0cccb5d8';

-- 测试

select *
from spot_month
    left join spot on spot_month.spot_id = spot.id
where
    spot.id = '00020fcd-9bfe-4299-8ffb-93db0cccb5d8';

SELECT
    `spot`.`id` AS `spot_id`,
    `spot`.`name` AS `spot_name`,
    `spot`.`description` AS `spot_description`,
    `spot`.`thumb_url` AS `spot_thumb_url`,
    `spot`.`is_deleted` AS `spot_is_deleted`,
    `spot`.`created_time` AS `spot_created_time`,
    `spot`.`updated_time` AS `spot_updated_time`,
    `spot`.`country_id` AS `spot_country_id`,
    `spot`.`province_id` AS `spot_province_id`,
    `spot`.`city_id` AS `spot_city_id`,
    `spot`.`district_id` AS `spot_district_id`,
    `sm`.`id` AS `sm_id`,
    `sm`.`weight` AS `sm_weight`,
    `sm`.`is_deleted` AS `sm_is_deleted`,
    `sm`.`created_time` AS `sm_created_time`,
    `sm`.`updated_time` AS `sm_updated_time`,
    `sm`.`spot_id` AS `sm_spot_id`,
    `sm`.`month_id` AS `sm_month_id`,
    `sf`.`id` AS `sf_id`,
    `sf`.`weight` AS `sf_weight`,
    `sf`.`is_deleted` AS `sf_is_deleted`,
    `sf`.`created_time` AS `sf_created_time`,
    `sf`.`updated_time` AS `sf_updated_time`,
    `sf`.`spot_id` AS `sf_spot_id`,
    `sf`.`feature_id` AS `sf_feature_id`
FROM `spot` `spot`
    LEFT JOIN `spot_month` `sm` ON `sm`.`spot_id` = `spot`.`id` AND (`sm`.`spot_id` = `spot`.`id`)
    LEFT JOIN `spot_feature` `sf` ON `sf`.`spot_id` = `spot`.`id` AND (`sf`.`spot_id` = `spot`.`id`)
WHERE
    `spot`.`is_deleted` = false
    AND `spot`.`id` = "074bf0bf-5f77-4440-b54e-b0d4386ed54a";

-- PARAMETERS: [false,"074bf0bf-5f77-4440-b54e-b0d4386ed54a"]

SELECT
    `spot`.`id` AS `spot_id`,
    `spot`.`name` AS `spot_name`,
    `spot`.`description` AS `spot_description`,
    `spot`.`thumb_url` AS `spot_thumb_url`,
    `spot`.`is_deleted` AS `spot_is_deleted`,
    `spot`.`created_time` AS `spot_created_time`,
    `spot`.`updated_time` AS `spot_updated_time`,
    `spot`.`country_id` AS `spot_country_id`,
    `spot`.`province_id` AS `spot_province_id`,
    `spot`.`city_id` AS `spot_city_id`,
    `spot`.`district_id` AS `spot_district_id`,
    `sm`.`id` AS `sm_id`,
    `sm`.`weight` AS `sm_weight`,
    `sm`.`is_deleted` AS `sm_is_deleted`,
    `sm`.`created_time` AS `sm_created_time`,
    `sm`.`updated_time` AS `sm_updated_time`,
    `sm`.`spot_id` AS `sm_spot_id`,
    `sm`.`month_id` AS `sm_month_id`,
    `sf`.`id` AS `sf_id`,
    `sf`.`weight` AS `sf_weight`,
    `sf`.`is_deleted` AS `sf_is_deleted`,
    `sf`.`created_time` AS `sf_created_time`,
    `sf`.`updated_time` AS `sf_updated_time`,
    `sf`.`spot_id` AS `sf_spot_id`,
    `sf`.`feature_id` AS `sf_feature_id`
FROM `spot` `spot`
    LEFT JOIN `spot_month` `sm` ON `sm`.`spot_id` = `spot`.`id` AND (`sm`.`spot_id` = `spot`.`id`)
    LEFT JOIN `spot_feature` `sf` ON `sf`.`spot_id` = `spot`.`id` AND (`sf`.`spot_id` = `spot`.`id`)
WHERE
    `spot`.`is_deleted` = ?
    AND `spot`.`id` = ?;

-- PARAMETERS: [false,"074bf0bf-5f77-4440-b54e-b0d4386ed54a"]

-- 搜索指定景点适合的月份和特色

select
    spot.id,
    spot.name,
    `month`.id,
    `month`.name, 
    feature.id,
    feature.name
from spot
    left join spot_month `sm` on sm.spot_id = spot.id 
    left join spot_feature `sf` on sf.spot_id = spot.id
    left join `month` on `month`.id = sm.month_id 
    left join feature on feature.id = sf.feature_id
where spot.id = '074bf0bf-5f77-4440-b54e-b0d4386ed54a';

select feature_id from spot_feature where spot_feature.spot_id = '074bf0bf-5f77-4440-b54e-b0d4386ed54a';