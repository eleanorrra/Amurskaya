package ru.hse.amurskaya.model.entity

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table
import java.time.Instant

@Table("todo_list_item")
class TodoListItem(
    @Id
    var id: Long? = null,
    val todoListId: Long,
    val userId: Long,
    val dateCreated: Instant = Instant.now(),
    val name: String,
    val done: Boolean = false,
) {}

data class TodoListItemRequest(
    val todoListId: Long?,
    val userId: Long,
    val name: String,
)

@Table("todo_list")
class TodoList(
    @Id
    var id: Long? = null,
    val name: String
) {
}

@Table("todo_list_to_user")
class TodoListToUser(
    val todoListId: Long,
    @Id
    val userId: Long
) {
}

class TodoListResponse(
    val todoList: TodoList,
    val todoListItems: List<TodoListItem>
) {
    val done = todoListItems.all { it.done }
}

class UserTodoListRequest(
    val userId: Long,
    val todoListId: Long,
)

class AddTodoListRequest(
    val name: String,
    val userId: Long
)
