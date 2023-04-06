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
order by weight desc