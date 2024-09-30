import org.springframework.security.core.userdetails.User
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import ru.hse.amurskaya.repository.auth.AmurskayaUserDetailRepository


class AmurskayaUserDetailService(private val userRepository: AmurskayaUserDetailRepository) : UserDetailsService {

    override fun loadUserByUsername(username: String): UserDetails =
        (userRepository.findByUsername(username) ?: throw UsernameNotFoundException("User not found: $username"))
            .let {
                User.withUsername(it.username)
                    .password(it.password)
                    .authorities(it.role.name)
                    .accountExpired(false)
                    .accountLocked(false)
                    .credentialsExpired(false)
                    .disabled(false)
                    .build()
            }

}
