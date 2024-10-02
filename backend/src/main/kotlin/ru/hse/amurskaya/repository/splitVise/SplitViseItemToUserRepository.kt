package ru.hse.amurskaya.repository.splitVise

import org.springframework.data.jdbc.repository.query.Modifying
import org.springframework.data.jdbc.repository.query.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.data.repository.query.Param
import org.springframework.transaction.annotation.Transactional
import ru.hse.amurskaya.model.entity.SplitViseToUser
import ru.hse.amurskaya.model.entity.SplitViseUserItem
import ru.hse.amurskaya.model.entity.UserInfo

interface SplitViseItemToUserRepository : CrudRepository<SplitViseUserItem, Long> {

    fun deleteAllBySplitViseItemId(splitViseItemId: Long)

    @Query("""
        INSERT INTO split_vice_item_to_user (split_vise_item_id, user_id)
        VALUES (:splitViseItemId, :userId)
        """)
    @Modifying
    @Transactional
    fun insertSplitViseItemToUser(@Param("splitViseItemId") splitViseItemId: Long, @Param("userId") userId: Long)
}
