package ru.hse.amurskaya.repository.todoList

import org.springframework.data.jdbc.repository.query.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.data.repository.query.Param
import ru.hse.amurskaya.model.entity.TodoList

interface TodoListRepository : CrudRepository<TodoList, Long> {

    @Query(
        """
        SELECT * FROM todo_list
            JOIN todo_list_to_user ON todo_list.id = todo_list_to_user.todo_list_id
       WHERE todo_list_to_user.user_id = :userId  
    """
    )
    fun findAllByUserId(@Param("userId") userId: Long): List<TodoList>
}
