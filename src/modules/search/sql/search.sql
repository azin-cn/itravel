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
    COALESCE(COUNT(`comment`.`id`), 0) AS `article_comment_count`
FROM `article` `article`
    LEFT JOIN `comment` `comment` ON `comment`.`article_id` = `article`.`id`
WHERE
    LOWER(`article`.`title`) LIKE LOWER("%河南省三门峡市灵宝市%")
    OR LOWER(`article`.`summary`) LIKE LOWER("%河南省三门峡市灵宝市%")
    OR LOWER(`article`.`content`) LIKE LOWER("%河南省三门峡市灵宝市%")
    OR LOWER(`comment`.`content`) LIKE LOWER("%河南省三门峡市灵宝市%")
GROUP BY `article`.`id`
ORDER BY
    `article`.`updated_time` ASC
LIMIT 10 -- PARAMETERS: ["%河南省三门峡市灵宝市%","%河南省三门峡市灵宝市%","%河南省三门峡市灵宝市%","%河南省三门峡市灵宝市%"]