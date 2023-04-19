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
LIMIT 10;

-- PARAMETERS: ["%河南省三门峡市灵宝市%","%河南省三门峡市灵宝市%","%河南省三门峡市灵宝市%","%河南省三门峡市灵宝市%"]

SELECT
    `user`.`id` AS `user_id`,
    `user`.`username` AS `user_username`,
    `user`.`role` AS `user_role`,
    `user`.`avatar` AS `user_avatar`,
    `user`.`password` AS `user_password`,
    `user`.`description` AS `user_description`,
    `user`.`thumb_url` AS `user_thumb_url`,
    `user`.`email` AS `user_email`,
    `user`.`phone` AS `user_phone`,
    `user`.`scenic_area` AS `user_scenic_area`,
    `user`.`visitors` AS `user_visitors`,
    `user`.`last_time` AS `user_last_time`,
    `user`.`status` AS `user_status`,
    `user`.`is_deleted` AS `user_is_deleted`,
    `user`.`created_time` AS `user_created_time`,
    `user`.`updated_time` AS `user_updated_time`,
    `user`.`title_id` AS `user_title_id`
FROM `user` `user`
WHERE
    LOWER(`user`.`username`) LIKE LOWER(?)
    OR LOWER(`user`.`description`) LIKE LOWER(?)
ORDER BY
    `user`.`updated_time` ASC
LIMIT 10;

-- PARAMETERS: ["%s%","%s%"]

SELECT
    `article`.`id` AS `article_id`,
    `article`.`title` AS `article_title`,
    `article`.`thumb_url` AS `article_thumb_url`,
    `article`.`summary` AS `article_summary`,
    `article`.`view_count` AS `article_view_count`,
    `article`.`like_count` AS `article_like_count`,
    `article`.`fav_count` AS `article_fav_count`,
    `article`.`status` AS `article_status`,
    `article`.`publish_time` AS `article_publish_time`,
    `article`.`created_time` AS `article_created_time`,
    `article`.`updated_time` AS `article_updated_time`,
    `author`.`id` AS `author_id`,
    `author`.`username` AS `author_username`,
    `author`.`avatar` AS `author_avatar`,
    `author`.`description` AS `author_description`,
    `author`.`thumb_url` AS `author_thumb_url`,
    `category`.`id` AS `category_id`,
    `category`.`name` AS `category_name`,
    `tags`.`id` AS `tags_id`,
    `tags`.`name` AS `tags_name`,
    `spot`.`id` AS `spot_id`,
    `spot`.`name` AS `spot_name`,
    `spot`.`description` AS `spot_description`,
    `spot`.`thumb_url` AS `spot_thumb_url`,
    `author`.`title_id`,
    COALESCE(COUNT(`comment`.`id`), 0) AS `commentCount`
FROM `article` `article`
    LEFT JOIN `user` `author` ON `author`.`id` = `article`.`author_id`
    LEFT JOIN `category` `category` ON `category`.`id` = `article`.`category_id`
    LEFT JOIN `article_tags_tag` `article_tags` ON `article_tags`.`article_id` = `article`.`id`
    LEFT JOIN `tag` `tags` ON `tags`.`id` = `article_tags`.`tag_id`
    LEFT JOIN `comment` `comment` ON `comment`.`article_id` = `article`.`id`
    LEFT JOIN `spot` `spot` ON `spot`.`id` = `article`.`spot_id`
WHERE
    `article`.`is_deleted` = false
GROUP BY
    `article`.`id`,
    `tags`.`id`
ORDER BY
    `article`.`updated_time` ASC
LIMIT 10