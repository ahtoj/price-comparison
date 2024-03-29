package com.shopleech.publicapi.controller;

import com.shopleech.publicapi.bll.service.AccountService;
import com.shopleech.publicapi.bll.service.CustomerService;
import com.shopleech.publicapi.bll.service.UserService;
import com.shopleech.publicapi.bll.util.JwtTokenUtil;
import com.shopleech.publicapi.dto.v1.UserLoginDTO;
import com.shopleech.publicapi.dto.v1.UserRefreshDTO;
import com.shopleech.publicapi.dto.v1.UserRegisterDTO;
import com.shopleech.publicapi.dto.v1.UserDTO;
import com.shopleech.publicapi.dto.v1.mapper.UserMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * @author Ahto Jalak
 * @since 04.02.2023
 */
@RestController
@RequestMapping("/v1/auth")
@Tag(name = "User Controller", description = "Endpoint for user access")
public class UserController {
    Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserMapper userMapper;
    @Autowired
    private UserService userService;
    @Autowired
    private JwtTokenUtil jwtTokenUtil;
    @Autowired
    private AuthenticationManager authenticationManager;

    @Operation(
            summary = "User registration",
            responses = @ApiResponse(responseCode = "200", description = "Access token returned"))
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserRegisterDTO request) {
        logger.info("register request");

        Map<String, Object> responseMap = new HashMap<>();
        try {
            var register = userService.register(request);
            if (register != null) {
                responseMap.put("error", false);
                responseMap.put("message", "registration_success");
                responseMap.put("token", register.getToken());
                responseMap.put("refreshToken", "");
                responseMap.put("firstname", "");
                responseMap.put("lastname", "");
                responseMap.put("roles", "");
                return ResponseEntity.ok(responseMap);
            } else {
                responseMap.put("error", true);
                responseMap.put("message", "invalid_input");
                return ResponseEntity.status(401).body(responseMap);
            }
        } catch (DisabledException e) {
            responseMap.put("error", true);
            responseMap.put("message", "user_is_disabled");
            responseMap.put("message_meta", e.getMessage());
            return ResponseEntity.status(500).body(responseMap);
        } catch (BadCredentialsException e) {
            responseMap.put("error", true);
            responseMap.put("message", "invalid_credentials");
            responseMap.put("message_meta", e.getMessage());
            return ResponseEntity.status(401).body(responseMap);
        } catch (Exception e) {
            responseMap.put("error", true);
            if ("consent is missing".equals(e.getMessage())) {
                responseMap.put("message", "consent_is_missing");
                responseMap.put("message_meta", e.getMessage());
            } else {
                responseMap.put("message", "something_went_wrong");
                responseMap.put("message_meta", e.getMessage());
            }
            return ResponseEntity.status(500).body(responseMap);
        }
    }

    @Operation(
            summary = "User login",
            responses = @ApiResponse(responseCode = "200", description = "Access token returned"))
    @PostMapping("/login")
    public ResponseEntity<?> authenticate(@RequestBody UserLoginDTO request) {
        logger.info("login request + " + request.toString());

        Map<String, Object> responseMap = new HashMap<>();
        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
            if (auth.isAuthenticated()) {
                logger.info("Logged In");
                UserDetails userDetails = userService.loadUserByUsername(request.getEmail());
                String token = jwtTokenUtil.generateToken(userDetails);

                responseMap.put("error", false);
                responseMap.put("message", "logged_in_success");
                responseMap.put("token", token);
                responseMap.put("refreshToken", "");
                responseMap.put("firstname", "");
                responseMap.put("lastname", "");
                responseMap.put("roles", "");
                return ResponseEntity.ok(responseMap);
            } else {
                responseMap.put("error", true);
                responseMap.put("message", "invalid_credentials");
                return ResponseEntity.status(401).body(responseMap);
            }
        } catch (DisabledException e) {
            responseMap.put("error", true);
            responseMap.put("message", "user_is_disabled");
            responseMap.put("message_meta", e.getMessage());
            return ResponseEntity.status(500).body(responseMap);
        } catch (BadCredentialsException e) {
            responseMap.put("error", true);
            responseMap.put("message", "invalid_credentials");
            responseMap.put("message_meta", e.getMessage());
            return ResponseEntity.status(401).body(responseMap);
        } catch (Exception e) {
            responseMap.put("error", true);
            responseMap.put("message", "something_went_wrong");
            responseMap.put("message_meta", e.getMessage());
            return ResponseEntity.status(500).body(responseMap);
        }
    }

    @Operation(
            summary = "User refresh token",
            responses = @ApiResponse(responseCode = "200", description = "Access token returned"))
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody UserRefreshDTO request) {
        logger.info("refresh token request");
        logger.info(request.toString());

        Map<String, Object> responseMap = new HashMap<>();
        try {
            UserDetails userDetails = userService.loadUserByUsername(
                    jwtTokenUtil.getUsernameFromToken(request.getToken()));

            if (!userDetails.getUsername().isEmpty()) {
                logger.info("Username found from token");

                String token = jwtTokenUtil.generateToken(userDetails);

                responseMap.put("error", false);
                responseMap.put("message", "refresh_token_success");
                responseMap.put("token", token);
                responseMap.put("refreshToken", "");
                responseMap.put("firstname", "");
                responseMap.put("lastname", "");
                responseMap.put("roles", "");
                return ResponseEntity.ok(responseMap);
            } else {
                responseMap.put("error", true);
                responseMap.put("message", "invalid_credentials");
                return ResponseEntity.status(401).body(responseMap);
            }
        } catch (DisabledException e) {
            responseMap.put("error", true);
            responseMap.put("message", "user_is_disabled");
            return ResponseEntity.status(500).body(responseMap);
        } catch (BadCredentialsException e) {
            responseMap.put("error", true);
            responseMap.put("message", "invalid_credentials");
            return ResponseEntity.status(401).body(responseMap);
        } catch (Exception e) {
            responseMap.put("error", true);
            responseMap.put("message", "something_went_wrong");
            return ResponseEntity.status(500).body(responseMap);
        }
    }

    @Operation(
            summary = "User list",
            responses = @ApiResponse(responseCode = "200", description = "Success"))
    @GetMapping("/users")
    public ResponseEntity<?> getUserList() {
        logger.info("user list request");

        Map<String, Object> responseMap = new HashMap<>();
        try {
            var users = userService.getAll();
            responseMap.put("details", users);
            responseMap.put("error", false);
            return ResponseEntity.ok(responseMap);
        } catch (Exception e) {
            responseMap.put("error", true);
            responseMap.put("message", e.getMessage());
            return ResponseEntity.status(500).body(responseMap);
        }
    }

    @GetMapping
    public ResponseEntity<?> getAll() {
        Map<String, Object> responseMap = new HashMap<>();
        try {
            var item = userService.getAll();
            responseMap.put("error", false);
            responseMap.put("details", userMapper.mapToDto(item));
            return ResponseEntity.ok(responseMap);
        } catch (Exception e) {
            responseMap.put("error", true);
            responseMap.put("message", e.getMessage());
            return ResponseEntity.status(500).body(responseMap);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable(value = "id") Integer id) {
        Map<String, Object> responseMap = new HashMap<>();
        try {
            var item = userService.get(id);
            responseMap.put("error", false);
            responseMap.put("details", userMapper.mapToDto(item));
            return ResponseEntity.ok(responseMap);
        } catch (Exception e) {
            responseMap.put("error", true);
            responseMap.put("message", e.getMessage());
            return ResponseEntity.status(500).body(responseMap);
        }
    }

    @PostMapping
    public ResponseEntity<?> add(@RequestBody UserDTO userDTO) {
        Map<String, Object> responseMap = new HashMap<>();
        try {
            var item = userService.add(userMapper.mapToEntity(userDTO));
            responseMap.put("error", false);
            responseMap.put("details", userMapper.mapToDto(item));
            return ResponseEntity.ok(responseMap);
        } catch (Exception e) {
            responseMap.put("error", true);
            responseMap.put("message", e.getMessage());
            return ResponseEntity.status(500).body(responseMap);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable(value = "id") Integer id, @RequestBody UserDTO userDTO) {
        Map<String, Object> responseMap = new HashMap<>();
        try {
            var item = userService.update(id, userMapper.mapToEntity(userDTO));
            responseMap.put("error", false);
            responseMap.put("details", userMapper.mapToDto(item));
            return ResponseEntity.ok(responseMap);
        } catch (Exception e) {
            responseMap.put("error", true);
            responseMap.put("message", e.getMessage());
            return ResponseEntity.status(500).body(responseMap);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> remove(@PathVariable(value = "id") Integer id) {
        Map<String, Object> responseMap = new HashMap<>();
        try {
            var item = userService.remove(id);
            responseMap.put("error", false);
            responseMap.put("details", item);
            return ResponseEntity.ok(responseMap);
        } catch (Exception e) {
            responseMap.put("error", true);
            responseMap.put("message", e.getMessage());
            return ResponseEntity.status(500).body(responseMap);
        }
    }
}
