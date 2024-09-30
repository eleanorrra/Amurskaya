package ru.hse.amurskaya.repository.todoList

import org.springframework.data.jdbc.repository.query.Modifying
import org.springframework.data.jdbc.repository.query.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.data.repository.query.Param
import ru.hse.amurskaya.model.entity.TodoListItem

interface TodoListItemRepository : CrudRepository<TodoListItem, Long> {

    fun findAllByTodoListId(todoListId: Long): List<TodoListItem>

    @Modifying
    @Query("UPDATE todo_list_item SET done = :status WHERE id=:todoListId" )
    fun updateStatusById(@Param("todoListId") todoListId: Long, @Param("status") status: Boolean)
}
