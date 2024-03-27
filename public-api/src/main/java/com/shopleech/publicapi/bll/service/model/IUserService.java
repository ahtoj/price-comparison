package com.shopleech.publicapi.bll.service.model;

import com.shopleech.publicapi.domain.User;
import com.shopleech.publicapi.dto.v1.UserRegisterDTO;
import com.shopleech.publicapi.dto.v1.UserTokenDTO;
import io.jsonwebtoken.Claims;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.List;

/**
 * @author Ahto Jalak
 * @since 25.02.2023
 */
public interface IUserService extends UserDetailsService {
    UserTokenDTO register(UserRegisterDTO request) throws Exception;

    User getUserByUsername(String username) throws Exception;

    List<User> getAll();

    UserDetails loadUserByUsername(String username);

    User get(Integer id) throws Exception;

    User add(User mapToEntity);

    User update(Integer id, User mapToEntity) throws Exception;

    Integer remove(Integer id) throws Exception;

    User getCurrentUser();

    Claims validateGoogleToken(String credential);
}
