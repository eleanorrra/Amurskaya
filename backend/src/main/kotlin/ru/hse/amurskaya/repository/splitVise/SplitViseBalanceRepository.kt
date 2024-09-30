package ru.hse.amurskaya.repository.splitVise

import org.springframework.data.jdbc.repository.query.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.data.repository.query.Param
import ru.hse.amurskaya.model.entity.SplitViseBalance
import java.math.BigDecimal

interface SplitViseBalanceRepository: CrudRepository<SplitViseBalance, Long> {


    @Query("""
        SELECT SUM(debt) FROM split_vise_balance 
            WHERE user_id_from = :userIdFrom AND user_id_to = :userIdTo
    """)
    fun findBalanceFromUserToUser(@Param("userIdFrom") userIdFrom: Long, @Param("userIdTo") userIdTo: Long): BigDecimal

    fun deleteAllBySplitViseId(splitViseId: Long)
}
