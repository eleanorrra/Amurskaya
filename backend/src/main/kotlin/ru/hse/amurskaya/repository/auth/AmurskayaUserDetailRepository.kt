package ru.hse.amurskaya.repository.auth

import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository
import ru.hse.amurskaya.model.entity.AmurskayaUser

@Repository
interface AmurskayaUserDetailRepository : CrudRepository<AmurskayaUser, Long> {

    fun findByUsername(userName: String): AmurskayaUser?
}
