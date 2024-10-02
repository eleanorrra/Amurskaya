package ru.hse.amurskaya.entrypoint

import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import ru.hse.amurskaya.model.entity.*
import ru.hse.amurskaya.repository.splitVise.*
import ru.hse.amurskaya.repository.user.UserInfoRepository
import java.math.BigDecimal


@RestController
@RequestMapping(value = ["/api/split-vise"])
class SplitViseController(
    private val splitViseRepository: SplitViseRepository,
    private val splitViseItemRepository: SplitViseItemRepository,
    private val splitViseToUserRepository: SplitViseToUserRepository,
    private val splitViseBalanceRepository: SplitViseBalanceRepository,
    private val userInfoRepository: UserInfoRepository,
    private val splitViseItemToUserRepository: SplitViseItemToUserRepository
) {

    @GetMapping("/user/{user-id}")
    fun getSplitViseForUser(@PathVariable("user-id") userId: Long): List<SplitViseResponse> {
        return getSplitViseResponse(userId, null)
    }

    @GetMapping("/{id}/user/{user-id}")
    fun getSplitVise(
        @PathVariable("user-id") userId: Long,
        @PathVariable("id") splitViseId: Long
    ): List<SplitViseResponse> {
        return getSplitViseResponse(userId, splitViseId)
    }

    private fun getSplitViseResponse(userId: Long, splitViseId: Long?) =
        if (splitViseId == null) {
            splitViseRepository.findAll().map {
                SplitViseResponse(
                    splitVise = it,
                    splitViseItems = splitViseItemRepository.findAllBySplitViseId(it.id!!),
                    splitViseStatistic = if (splitViseItemRepository.findAllBySplitViseId(it.id!!).isNotEmpty()) {
                        splitViseToUserRepository.findAllBySplitViseId(it.id!!)
                            .filter { splitViseUserId -> splitViseUserId != userId }
                            .map { splitViseUserId ->
                                getSplitViseStatistic(
                                    userId,
                                    splitViseUserId,
                                    splitViseId = it.id!!
                                )
                            }
                    } else emptyList()
                )
            }
        } else {
            listOf(splitViseRepository.findById(splitViseId).get().let { splitVise ->
                SplitViseResponse(
                    splitVise = splitVise,
                    splitViseItems = splitViseItemRepository.findAllBySplitViseId(splitVise.id!!),
                    splitViseStatistic = if (splitViseItemRepository.findAllBySplitViseId(splitVise.id!!).isNotEmpty()) {
                        splitViseToUserRepository.findAllBySplitViseId(splitVise.id!!)
                            .filter { splitViseUserId -> splitViseUserId != userId }
                            .map { splitViseUserId ->
                                getSplitViseStatistic(
                                    userId,
                                    splitViseUserId,
                                    splitVise.id!!
                                )
                            }
                    } else emptyList()
                )
            })
        }

    private fun getSplitViseStatistic(userIdFrom: Long, userIdTo: Long, splitViseId: Long): SplitViseStatistic {
        val userFromItemPrice = splitViseItemRepository.getSumOfDebt(userIdFrom, userIdTo) ?: BigDecimal.ZERO
        val userToItemPrice = splitViseItemRepository.getSumOfDebt(userIdTo, userIdFrom) ?: BigDecimal.ZERO
        val userFromBalancePrice =
            splitViseBalanceRepository.findBalanceFromUserToUser(userIdFrom, userIdTo, splitViseId) ?: BigDecimal.ZERO
        val userToBalancePrice =
            splitViseBalanceRepository.findBalanceFromUserToUser(userIdTo, userIdFrom, splitViseId) ?: BigDecimal.ZERO
        val debt = userFromBalancePrice + userFromItemPrice - userToItemPrice - userToBalancePrice
        return if (debt > BigDecimal.ZERO) {
            SplitViseStatistic(
                userFrom = userInfoRepository.findById(userIdFrom).get(),
                userTo = userInfoRepository.findById(userIdTo).get(),
                debt = debt
            )
        } else {
            SplitViseStatistic(
                userFrom = userInfoRepository.findById(userIdTo).get(),
                userTo = userInfoRepository.findById(userIdFrom).get(),
                debt = -debt
            )
        }
    }

    @PostMapping
    fun createSplitVise(@RequestBody createSplitViseRequest: CreateSplitViseRequest) {
        splitViseRepository.insertSplitVise(
            createSplitViseRequest.splitVise.name,
            createSplitViseRequest.splitVise.dateCreated
        )
        val splitVise = splitViseRepository.findSplitVise()
        createSplitViseRequest.userIds.forEach {
            splitViseToUserRepository.insertSplitViseToUser(splitVise.id!!, it)
        }
    }

    @DeleteMapping("/{id}")
    fun deleteSplitVise(@PathVariable("id") id: Long) {
        splitViseRepository.findById(id).get()
            .let {
                splitViseRepository.deleteById(it.id!!)
                splitViseItemRepository.findAllBySplitViseId(it.id!!)
                    .onEach { splitViseItem -> splitViseItemToUserRepository.deleteAllBySplitViseItemId(splitViseItem.id!!) }
                splitViseItemRepository.deleteAllBySplitViseId(it.id!!)
                splitViseToUserRepository.deleteAllBySplitViseId(it.id!!)
                splitViseBalanceRepository.deleteAllBySplitViseId(it.id!!)
            }
    }

    @PostMapping("/item")
    fun addItemToSplitVise(
        @RequestBody splitViseItem: AddSplitViseItemRequest
    ): SplitViseResponse {
        splitViseItem.apply {
            splitViseItemRepository.save(this.splitViseItem)
            this.userIds.forEach {
                splitViseItemToUserRepository.insertSplitViseItemToUser(
                    splitViseItem.splitViseItem.id!!,
                    it
                )
            }
        }
        return splitViseItem
            .let {
                getSplitViseResponse(it.splitViseItem.userPayedId, it.splitViseItem.splitViseId)
            }.first()
    }

    @PostMapping("/{id}/balance")
    fun addBalanceToSplitVise(@RequestBody balance: SplitViseBalance, @PathVariable("id") id: Long) =
        splitViseBalanceRepository.saveBalance(balance.splitViseId, balance.userIdFrom, balance.userIdTo, balance.debt)

    @DeleteMapping("/balance/{id}")
    fun deleteBalanceFromSplitVise(@PathVariable("id") id: Long) =
        splitViseBalanceRepository.deleteById(id)

    @GetMapping("/{id}/balance")
    fun getBalancesBySplitWiseId(@PathVariable("id") splitViseId: Long) =
        splitViseBalanceRepository.findAllBySplitViseId(splitViseId)

    @DeleteMapping("/{id}/item/{item-id}")
    fun deleteItemFromSplitVise(
        @PathVariable("id") splitViseId: Long,
        @PathVariable("item-id") itemId: Long
    ) {
        splitViseItemRepository.deleteById(itemId)
    }
}
