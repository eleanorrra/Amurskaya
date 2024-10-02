package ru.hse.amurskaya.entrypoint

import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import ru.hse.amurskaya.model.entity.Contacts
import ru.hse.amurskaya.model.entity.UserInfo
import ru.hse.amurskaya.repository.user.ContactRepository
import ru.hse.amurskaya.repository.user.UserInfoRepository

@RestController
@RequestMapping(value = ["/api/contacts"])
class ContactController(
    private val contactRepository: ContactRepository,
    private val userInfoRepository: UserInfoRepository
) {

    @GetMapping("/user/{id}")
    fun getContacts(@PathVariable("id") userId: Long): List<UserInfo> = userInfoRepository.findAllContacts(userId)

    @PostMapping("{contact-id}/user/{id}")
    fun addContact(@PathVariable("id") userId: Long, @PathVariable("contact-id") contactId: Long) {
        contactRepository.saveContacts(userId, contactId)
    }


    @DeleteMapping("{contact-id}/user/{id}")
    fun deleteContact(@PathVariable("id") userId: Long, @PathVariable("contact-id") contactId: Long) {
        contactRepository.deleteContact(userId, contactId)
    }
}
