package ru.hse.amurskaya.repository.splitVise

import org.springframework.data.jdbc.repository.query.Modifying
import org.springframework.data.jdbc.repository.query.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.data.repository.query.Param
import org.springframework.transaction.annotation.Transactional
import ru.hse.amurskaya.model.entity.SplitViseToUser

interface SplitViseToUserRepository : CrudRepository<SplitViseToUser, SplitViseToUser> {

    @Query(
        """
        SELECT user_id FROM split_vise_to_user
        WHERE split_vise_id = :splitViseId
    """
    )
    fun findAllBySplitViseId(@Param("splitViseId") splitViseId: Long): List<Long>

    @Query(
        value = """
        INSERT INTO split_vise_to_user(split_vise_id, user_id)
        VALUES (:splitViseId, :userId)
    """
    )
    @Modifying
    @Transactional
    fun insertSplitViseToUser(@Param("splitViseId") splitViseId: Long, @Param("userId") userId: Long)

    fun deleteAllBySplitViseId(splitViseId: Long)
}
