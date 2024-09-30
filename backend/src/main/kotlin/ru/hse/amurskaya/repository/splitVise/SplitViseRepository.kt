package ru.hse.amurskaya.repository.splitVise

import org.springframework.data.jdbc.repository.query.Modifying
import org.springframework.data.jdbc.repository.query.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.data.repository.query.Param
import org.springframework.transaction.annotation.Transactional
import ru.hse.amurskaya.model.entity.SplitVise
import java.time.Instant

interface SplitViseRepository: CrudRepository<SplitVise, Long> {

    @Query("""
        SELECT sv.* FROM split_vise sv
            JOIN public.split_vise_to_user svtu on sv.id = svtu.split_vise_id
        WHERE user_id = :userId
    """)
    fun findAllByUserId(@Param("userId") userId: Long): List<SplitVise>

    @Modifying
    @Query("""
        INSERT INTO split_vise (name, date_created)
        VALUES (:name, :dateCreated)
        """)
    @Transactional
    fun insertSplitVise(@Param("name") name: String, @Param("dateCreated") dateCreated: Instant): Long

    @Query("""
        SELECT * FROM split_vise
        ORDER BY id desc
        LIMIT 1
        """)
    fun findSplitVise(): SplitVise

}
