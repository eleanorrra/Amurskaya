package ru.hse.amurskaya.repository.splitVise

import org.springframework.data.jdbc.repository.query.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.data.repository.query.Param
import ru.hse.amurskaya.model.entity.SplitViseItem
import java.math.BigDecimal

interface SplitViseItemRepository: CrudRepository<SplitViseItem, Long> {

    @Query(
        """
            SELECT * FROM split_vise_item
                WHERE split_vise_id = :splitViseId
        """
    )
    fun findAllBySplitViseId(@Param("splitViseId") splitViseId: Long): List<SplitViseItem>

    @Query(
        """    WITH split_vise_item_ids AS (SELECT DISTINCT split_vise_item_id
                             FROM split_vise_item svi
                                      LEFT JOIN public.split_vice_item_to_user svitu
                                                on svi.id = svitu.split_vise_item_id
                             WHERE svi.user_payed_id = :userIdFrom
                               AND :userIdTo IN (user_id)),
                    svi_items_price AS (SELECT svi.price / (count(user_id)) as price
                         FROM split_vice_item_to_user svitu
                                  LEFT JOIN public.split_vise_item svi on svi.id = svitu.split_vise_item_id
                                  JOIN split_vise_item_ids ON svi.id = split_vise_item_ids.split_vise_item_id
                         GROUP BY svi.id, svi.price)
                SELECT sum(price) from svi_items_price
        """
    )
    fun getSumOfDebt(@Param("userIdFrom") userIdFrom: Long, @Param("userIdTo") userIdTo: Long): BigDecimal?

    fun deleteAllBySplitViseId(splitViseId: Long)
}
