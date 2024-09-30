package ru.hse.amurskaya.model.entity

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table
import java.math.BigDecimal
import java.time.Instant

@Table("split_vise")
class SplitVise(
    @Id
    var id: Long? = null,
    val dateCreated: Instant = Instant.now(),
    val name: String,
)

@Table("split_vise_item")
class SplitViseItem(
    @Id
    var id: Long? = null,
    val splitViseId: Long,
    val name: String,
    val userPayedId: Long,
    val price: BigDecimal,
)

@Table("split_vise_item_to_user")
class SplitViseUserItem(
    val splitViseItemId: Long,
    val userId: Long,
)

@Table("split_vise_to_user")
class SplitViseToUser(
    val splitViseId: Long,
    val userId: Long,
)

@Table("split_vise_balance")
class SplitViseBalance(
    @Id
    val id: Long,
    val splitViseId: Long,
    val userIdFrom: Long,
    val userIdTo: Long,
    val debt: BigDecimal,
)

class SplitViseResponse(
    val splitVise: SplitVise,
    val splitViseStatistic: List<SplitViseStatistic>,
    val splitViseItems: List<SplitViseItem>
)

class AddSplitViseItemRequest(
    val splitViseItem: SplitViseItem,
    val userIds: List<Long>
)

class SplitViseStatistic(
    val userFrom: UserInfo,
    val userTo: UserInfo,
    val debt: BigDecimal
)

class CreateSplitViseRequest(
    val splitVise: SplitVise,
    val userIds: List<Long>
)
