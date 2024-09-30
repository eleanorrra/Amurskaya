package ru.hse.amurskaya.repository.user

import org.springframework.data.jdbc.repository.query.Modifying
import org.springframework.data.jdbc.repository.query.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.data.repository.query.Param
import org.springframework.transaction.annotation.Transactional
import ru.hse.amurskaya.model.entity.Contacts

interface ContactRepository : CrudRepository<Contacts, Contacts> {

    @Query(
        "INSERT INTO contacts(user_id, contact_id) VALUES (:userId, :contactId), (:contactId, :userId)"
    )
    @Modifying
    @Transactional
    fun saveContacts(@Param("userId") userId: Long, @Param("contactId") contactId: Long)

    @Modifying
    @Transactional
    @Query(
        "DELETE FROM contacts WHERE (user_id = :userId AND contact_id = :contactId) OR (user_id = :contactId AND contact_id = :userId) "
        )
    fun deleteContact(@Param("userId") userId: Long, @Param("contactId") contactId: Long)
}
