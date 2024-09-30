package ru.hse.amurskaya.repository.splitVise

import org.springframework.data.repository.CrudRepository
import ru.hse.amurskaya.model.entity.SplitViseUserItem

interface SplitViseItemToUserRepository : CrudRepository<SplitViseUserItem, SplitViseUserItem> {

    fun deleteAllBySplitViseItemId(splitViseId: Long)
}
