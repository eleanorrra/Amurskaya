package ru.hse.amurskaya.model.entity

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table

@Table("users")
class AmurskayaUser(
    @Id val id: Long? = null,
    val username: String,
    val password: String,
    val role: USER_ROLE = USER_ROLE.USER,
)

enum class USER_ROLE {
    USER,
    ADMIN
}
