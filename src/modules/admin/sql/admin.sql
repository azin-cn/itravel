SELECT
    `spot`.`id` AS `spot_id`,
    `spot`.`name` AS `spot_name`,
    `spot`.`description` AS `spot_description`,
    `spot`.`thumb_url` AS `spot_thumb_url`,
    `spot`.`panorama` AS `spot_panorama`,
    `spot`.`is_deleted` AS `spot_is_deleted`,
    `spot`.`created_time` AS `spot_created_time`,
    `spot`.`updated_time` AS `spot_updated_time`,
    `spot`.`country_id` AS `spot_country_id`,
    `spot`.`province_id` AS `spot_province_id`,
    `spot`.`city_id` AS `spot_city_id`,
    `spot`.`district_id` AS `spot_district_id`,
    `country`.`id` AS `country_id`,
    `country`.`name` AS `country_name`,
    `country`.`full_name` AS `country_full_name`,
    `country`.`weight` AS `country_weight`,
    `country`.`aid` AS `country_aid`,
    `country`.`bid` AS `country_bid`,
    `country`.`tid` AS `country_tid`,
    `province`.`id` AS `province_id`,
    `province`.`name` AS `province_name`,
    `province`.`full_name` AS `province_full_name`,
    `province`.`weight` AS `province_weight`,
    `province`.`aid` AS `province_aid`,
    `province`.`bid` AS `province_bid`,
    `province`.`tid` AS `province_tid`,
    `province`.`country_id` AS `province_country_id`,
    `city`.`id` AS `city_id`,
    `city`.`name` AS `city_name`,
    `city`.`full_name` AS `city_full_name`,
    `city`.`weight` AS `city_weight`,
    `city`.`aid` AS `city_aid`,
    `city`.`bid` AS `city_bid`,
    `city`.`tid` AS `city_tid`,
    `city`.`province_id` AS `city_province_id`,
    `district`.`id` AS `district_id`,
    `district`.`name` AS `district_name`,
    `district`.`full_name` AS `district_full_name`,
    `district`.`weight` AS `district_weight`,
    `district`.`aid` AS `district_aid`,
    `district`.`bid` AS `district_bid`,
    `district`.`tid` AS `district_tid`,
    `district`.`city_id` AS `district_city_id`
FROM `spot` `spot`
    LEFT JOIN `country` `country` ON `country`.`id` = `spot`.`country_id`
    LEFT JOIN `province` `province` ON `province`.`id` = `spot`.`province_id`
    LEFT JOIN `city` `city` ON `city`.`id` = `spot`.`city_id`
    LEFT JOIN `district` `district` ON `district`.`id` = `spot`.`district_id`
WHERE
    1 = 1
    AND (
        LOWER(`spot`.`name`) LIKE LOWER("千")
    )
LIMIT 20 -- PARAMETERS: ["千","千"]