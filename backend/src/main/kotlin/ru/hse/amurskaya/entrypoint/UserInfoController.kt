package ru.hse.amurskaya.entrypoint

import org.springframework.web.bind.annotation.*
import ru.hse.amurskaya.model.entity.UserInfo
import ru.hse.amurskaya.repository.user.UserInfoRepository

@RestController
@RequestMapping(value = ["/api/user"])
class UserInfoController(private val userInfoRepository: UserInfoRepository) {

    @GetMapping("/{id}")
    fun getUser(@PathVariable("id") userId: Long): UserInfo = userInfoRepository.findById(userId).get()

    @PutMapping
    fun updateUserInfo(@RequestBody userInfo: UserInfo): UserInfo = userInfoRepository.save(userInfo).let { userInfo }

    @PostMapping
    fun createUserInfo(@RequestBody userInfo: UserInfo): UserInfo =
        userInfoRepository.insertUserInfo(userInfo).let { userInfo }

}
