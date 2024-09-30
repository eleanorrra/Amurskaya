package ru.hse.amurskaya.config

import AmurskayaUserDetailService
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import ru.hse.amurskaya.repository.auth.AmurskayaUserDetailRepository

@Configuration
class UserDetail {

    @Bean
    fun userDetailService(userRepository: AmurskayaUserDetailRepository): AmurskayaUserDetailService =
        AmurskayaUserDetailService(userRepository)

}
