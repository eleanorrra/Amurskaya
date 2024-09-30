package ru.hse.amurskaya.service.auth

import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import ru.hse.amurskaya.model.entity.AmurskayaUser
import ru.hse.amurskaya.repository.auth.AmurskayaUserDetailRepository

@Service
class AmurskayaUserService(val userRepository: AmurskayaUserDetailRepository) {

    @Transactional
    fun register(username: String, password: String): AmurskayaUser =
        userRepository.save(
            AmurskayaUser(
                username = username,
                password = password
            )
        )

    @Transactional
    fun changePassword(username: String, newPassword: String) =
        (userRepository.findByUsername(username) ?: throw UsernameNotFoundException("User is not found"))
            .let {
                userRepository.save(
                    AmurskayaUser(
                        id = it.id,
                        username = it.username,
                        password = newPassword
                    )
                )
            }

}
