SELECT
    `article`.`id` AS `article_id`,
    `article`.`title` AS `article_title`,
    `article`.`thumb_url` AS `article_thumb_url`,
    `article`.`summary` AS `article_summary`,
    `article`.`content` AS `article_content`,
    `article`.`view_count` AS `article_view_count`,
    `article`.`like_count` AS `article_like_count`,
    `article`.`fav_count` AS `article_fav_count`,
    `article`.`status` AS `article_status`,
    `article`.`publish_time` AS `article_publish_time`,
    `article`.`is_deleted` AS `article_is_deleted`,
    `article`.`created_time` AS `article_created_time`,
    `article`.`updated_time` AS `article_updated_time`,
    `article`.`author_id` AS `article_author_id`,
    `article`.`category_id` AS `article_category_id`,
    `article`.`spot_id` AS `article_spot_id`,
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
    COALESCE(COUNT(`comment`.`id`), 0) AS `article_comment_count`
FROM `article` `article`
    LEFT JOIN `spot` `spot` ON `spot`.`id` = `article`.`spot_id` AND (
        `spot`.`id` = `article`.`spot_id`
    )
    LEFT JOIN `comment` `comment` ON `comment`.`article_id` = `article`.`id`
WHERE
    1 = 1
    AND `article`.`status` = 1
    AND `spot`.`id` = '601fa379-8b7a-489c-8d67-def1fbe71f9b'
GROUP BY `article`.`id`;

-- PARAMETERS: [1,"601fa379-8b7a-489c-8d67-def1fbe71f9b"]

select * from article where status = '0' ;

SELECT COUNT(*) AS `value`
FROM (
        SELECT
            article.*,
            `author`.`id` article_author_id,
            `author`.`username` article_author_username,
            `author`.`description` article_author_description,
            `author`.`title_id` article_author_title,
            COALESCE(COUNT(`comment`.`id`), 0) AS `article_comment_count`
        FROM
            `article` `article`
            LEFT JOIN `spot` `spot` ON `spot`.`id` = `article`.`spot_id`
            AND (
                `spot`.`id` = `article`.`spot_id`
            )
            LEFT JOIN `user` `author` ON `author`.`id` = `article`.`author_id`
            AND (
                `author`.`id` = `article`.`author_id`
            )
            LEFT JOIN `comment` `comment` ON `comment`.`article_id` = `article`.`id`
        WHERE
            1 = 1
            AND `article`.`status` = 1
            AND `spot`.`id` = "601fa379-8b7a-489c-8d67-def1fbe71f9b"
        GROUP BY
            `article`.`id`
    ) `uniqueTableAlias`;

-- PARAMETERS: [1,"601fa379-8b7a-489c-8d67-def1fbe71f9b"]