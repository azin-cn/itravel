SELECT
    `article`.`id` AS `article_id`,
    `article`.`title` AS `article_title`,
    `article`.`content` AS `article_content`,
    `article`.`view_count` AS `article_view_count`,
    `article`.`like_count` AS `article_like_count`,
    `article`.`fav_count` AS `article_fav_count`,
    `article`.`status` AS `article_status`,
    `article`.`publish_time` AS `article_publish_time`,
    `article`.`created_time` AS `article_created_time`,
    `article`.`updated_time` AS `article_updated_time`,
    `spot`.`id` AS `spot_id`,
    `spot`.`name` AS `spot_name`,
    `spot`.`description` AS `spot_description`,
    `author`.`id` AS `author_id`,
    `author`.`username` AS `author_username`,
    `author`.`avatar` AS `author_avatar`,
    `author`.`description` AS `author_description`,
    COALESCE(COUNT(`comment`.`id`), 0) AS article_comment_count,
    `author`.`title_id`
FROM `article` `article`
    LEFT JOIN `spot` `spot` ON `spot`.`id` = `article`.`spot_id`
    LEFT JOIN `user` `author` ON `author`.`id` = `article`.`author_id`
    LEFT JOIN `comment` `comment` ON `comment`.`article_id` = `article`.`id`
WHERE
    1 = 1
    AND `article`.`status` = 1
    AND `spot`.`id` = "601fa379-8b7a-489c-8d67-def1fbe71f9b"
GROUP BY `article`.`id` -- PARAMETERS: [1,"601fa379-8b7a-489c-8d67-def1fbe71f9b"]