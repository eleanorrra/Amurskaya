package ru.hse.amurskaya.repository.todoList

import org.springframework.data.jdbc.repository.query.Modifying
import org.springframework.data.jdbc.repository.query.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.data.repository.query.Param
import org.springframework.transaction.annotation.Transactional
import ru.hse.amurskaya.model.entity.TodoListToUser

interface TodoListToUserRepository: CrudRepository<TodoListToUser, Long> {

    @Query(
        value = """
        INSERT INTO todo_list_to_user(todo_list_id, user_id)
        VALUES(:todoListId, :userId)
    """)
    @Modifying
    @Transactional
    fun saveTodoListToUser(@Param("todoListId") todoListId: Long, @Param("userId") userId: Long)
}
