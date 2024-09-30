package ru.hse.amurskaya.config

import com.zaxxer.hikari.HikariDataSource
import liquibase.integration.spring.SpringLiquibase
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty
import org.springframework.boot.autoconfigure.liquibase.LiquibaseProperties
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.boot.context.properties.EnableConfigurationProperties

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Primary
import org.springframework.data.jdbc.repository.config.AbstractJdbcConfiguration
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.jdbc.support.JdbcTransactionManager
import org.springframework.transaction.PlatformTransactionManager
import javax.sql.DataSource

@Configuration
@EnableConfigurationProperties(LiquibaseProperties::class)
class PersistenceConfig : AbstractJdbcConfiguration() {

    @ConfigurationProperties(prefix = "database.target.datasource")
    @Bean
    fun postgresDataSource(): DataSource {
        return HikariDataSource()
    }

    @Bean
    fun jdbcTemplate(targetDataSource: DataSource): JdbcTemplate {
        return JdbcTemplate(targetDataSource)
    }

    @Bean
    @ConditionalOnProperty(prefix = "spring.liquibase", name = ["enabled"], havingValue = "true")
    fun springLiquibase(targetDataSource: DataSource?, properties: LiquibaseProperties) =
        SpringLiquibase().apply {
            dataSource = targetDataSource
            changeLog = properties.changeLog
            contexts = properties.contexts
            defaultSchema = properties.defaultSchema
            isDropFirst = properties.isDropFirst
            setShouldRun(properties.isEnabled)
            labelFilter = properties.labelFilter
            setChangeLogParameters(properties.parameters)
            setRollbackFile(properties.rollbackFile)
        }


    @Primary
    @Bean("targetNamedParameterJdbcTemplate")
    fun targetNamedParameterJdbcTemplate(targetDataSource: DataSource): NamedParameterJdbcTemplate {
        return NamedParameterJdbcTemplate(targetDataSource)
    }

    @Bean
    fun transactionManager(targetDataSource: DataSource): PlatformTransactionManager =
        JdbcTransactionManager(targetDataSource)
}
