package ru.hse.amurskaya.entrypoint

import org.springframework.web.bind.annotation.*
import ru.hse.amurskaya.model.entity.dto.auth.AuthRequest
import ru.hse.amurskaya.service.auth.AmurskayaUserService

@RestController
@RequestMapping(value = ["/api/auth"])
class AuthenticationController(
    private val amurskayaUserService: AmurskayaUserService
) {

    @PostMapping
    fun register(@RequestBody registerRequest: AuthRequest) {
        amurskayaUserService.register(registerRequest.username, registerRequest.password)
    }

    @PatchMapping
    fun updatePassword(@RequestBody passwordChangeRequest: AuthRequest) {
        amurskayaUserService.changePassword(passwordChangeRequest.username, passwordChangeRequest.password)
    }
}
