package ru.hse.amurskaya.model.entity

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table

@Table("user_info")
class UserInfo(
    @Id
    val userId: Long,
    val name: String,
    val apartamentNumber: String,
    val status: String,
    val phone: String?,
    val telegramLogin: String?,
    val vkLogin: String?
)

@Table("contacts")
class Contacts(
    @Id
    val userId: Long,
    val contactId: Long
)
