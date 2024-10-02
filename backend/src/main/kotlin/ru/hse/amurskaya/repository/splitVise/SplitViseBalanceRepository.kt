package ru.hse.amurskaya.repository.splitVise

import org.springframework.data.jdbc.repository.query.Modifying
import org.springframework.data.jdbc.repository.query.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.data.repository.query.Param
import org.springframework.transaction.annotation.Transactional
import ru.hse.amurskaya.model.entity.SplitViseBalance
import java.math.BigDecimal

interface SplitViseBalanceRepository : CrudRepository<SplitViseBalance, Long> {


    @Query(
        """
        SELECT SUM(debt) FROM split_vise_balance 
            WHERE user_id_from = :userIdFrom AND user_id_to = :userIdTo AND split_vise_id = :splitViseId
    """
    )
    fun findBalanceFromUserToUser(@Param("userIdFrom") userIdFrom: Long, @Param("userIdTo") userIdTo: Long, @Param("splitViseId") splitViseId: Long): BigDecimal?

    fun deleteAllBySplitViseId(splitViseId: Long)

    @Query(
        """
        INSERT INTO split_vise_balance (split_vise_id, user_id_from, user_id_to, debt)
           VALUES (:splitViseId,:userIdFrom, :userIdTo, :debt)
           """
    )
    @Modifying
    @Transactional
    fun saveBalance(@Param("splitViseId") splitViseId: Long, @Param("userIdFrom") userIdFrom: Long, @Param("userIdTo") userIdTo: Long, @Param("debt") debt: BigDecimal)

    fun findAllBySplitViseId(splitViseId: Long): List<SplitViseBalance>
}
