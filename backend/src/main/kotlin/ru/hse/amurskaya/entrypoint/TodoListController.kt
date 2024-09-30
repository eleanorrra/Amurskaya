package ru.hse.amurskaya.entrypoint

import org.springframework.web.bind.annotation.*
import ru.hse.amurskaya.model.entity.*
import ru.hse.amurskaya.repository.todoList.TodoListItemRepository
import ru.hse.amurskaya.repository.todoList.TodoListRepository
import ru.hse.amurskaya.repository.todoList.TodoListToUserRepository

@RestController
@RequestMapping(value = ["/api/todo-list"])
class TodoListController(
    private val todoListRepository: TodoListRepository,
    private val todoListItemRepository: TodoListItemRepository,
    private val todoListToUserRepository: TodoListToUserRepository
) {

    @GetMapping("/user/{id}")
    fun getUserTodoLists(@PathVariable("id") userId: Long): List<TodoListResponse> = todoListRepository
        .findAllByUserId(userId)
        .map {
            TodoListResponse(it, todoListItemRepository.findAllByTodoListId(it.id!!))
        }


    @GetMapping("/{id}")
    fun getTodoList(@PathVariable("id") id: Long): List<TodoListResponse> = todoListRepository
        .findAllById(listOf(id))
        .map {
            TodoListResponse(it, todoListItemRepository.findAllByTodoListId(it.id!!))
        }


    @PostMapping("/user")
    fun addTodoListUser(@RequestBody todoListRequest: UserTodoListRequest) =
        todoListToUserRepository.save(TodoListToUser(todoListRequest.todoListId, todoListRequest.userId))

    @PostMapping
    fun addTodoList(@RequestBody addTodoListRequest: AddTodoListRequest) =
        todoListRepository.save(TodoList(name = addTodoListRequest.name))
            .apply { todoListToUserRepository.saveTodoListToUser(this.id!!, addTodoListRequest.userId) }

    @DeleteMapping("/{id}")
    fun deleteTodoList(@PathVariable id: Long) = todoListRepository.deleteById(id)


    @PostMapping("/item")
    fun addTodoListItem(@RequestBody todoListItem: TodoListItemRequest) = todoListItemRepository.save(
        TodoListItem(todoListId = todoListItem.todoListId!!, userId = todoListItem.userId, name = todoListItem.name)
    )


    @PatchMapping("/item/{id}/status/{status}")
    fun setDoneStatus(@PathVariable id: Long, @PathVariable status: Boolean) =
        todoListItemRepository.updateStatusById(id, status)


    @DeleteMapping("/item/{id}")
    fun removeFromTodoList(@PathVariable id: Long) = todoListItemRepository.deleteById(id)

}
