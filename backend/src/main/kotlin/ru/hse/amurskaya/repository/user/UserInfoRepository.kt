package ru.hse.amurskaya.repository.user

import org.springframework.data.jdbc.repository.query.Query
import org.springframework.data.repository.CrudRepository
import ru.hse.amurskaya.model.entity.UserInfo

interface UserInfoRepository : CrudRepository<UserInfo, Long> {

    @Query(
        value = """
        INSERT INTO user_info(user_id, name, apartament_number, 
                              status, phone, telegram_login, 
                              vk_login)
        VALUES(:#{#userInfo.userId}, :#{#userInfo.name}, :#{#userInfo.apartamentNumber}, 
               :#{#userInfo.status}, :#{#userInfo.phone}, :#{#userInfo.telegramLogin}, 
               :#{#userInfo.vkLogin})
    """
    )
    fun insertUserInfo(userInfo: UserInfo)

    @Query(
        """
            SELECT ui.*
            FROM user_info
                     JOIN contacts c on user_info.user_id = c.user_id
                     JOIN user_info ui on c.contact_id = ui.user_id
            WHERE user_info.user_id = :userId
        """
    )
    fun findAllContacts(userId: Long): List<UserInfo>
}
