package com.shopleech.publicapi.bll.service;

import com.shopleech.publicapi.bll.MyUserDetails;
import com.shopleech.publicapi.bll.service.model.IUserService;
import com.shopleech.publicapi.bll.util.JwtTokenUtil;
import com.shopleech.publicapi.bll.util.JwtValidator;
import com.shopleech.publicapi.dal.repository.AccountRepository;
import com.shopleech.publicapi.dal.repository.CustomerAccountRepository;
import com.shopleech.publicapi.dal.repository.CustomerRepository;
import com.shopleech.publicapi.dal.repository.UserRepository;
import com.shopleech.publicapi.domain.Account;
import com.shopleech.publicapi.domain.Customer;
import com.shopleech.publicapi.domain.CustomerAccount;
import com.shopleech.publicapi.domain.User;
import com.shopleech.publicapi.dto.v1.GoogleUserRegisterDTO;
import com.shopleech.publicapi.dto.v1.UserRegisterDTO;
import com.shopleech.publicapi.dto.v1.UserTokenDTO;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import javax.security.auth.login.CredentialException;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Objects;

/**
 * @author Ahto Jalak
 * @since 04.02.2023
 */
@Service
public class UserService implements IUserService {
    Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    UserRepository userRepository;
    @Autowired
    UserRepository roleRepository;
    @Autowired
    CustomerRepository customerRepository;
    @Autowired
    AccountRepository accountRepository;
    @Autowired
    CustomerAccountRepository customerAccountRepository;
    @Autowired
    JwtTokenUtil jwtTokenUtil;
    @Autowired
    JwtValidator jwtValidator;

    public UserTokenDTO register(UserRegisterDTO request) throws Exception {

        if (!request.isConsent()) {
            throw new Exception("consent is missing");
        }

        if (request.getEmail().isEmpty() || request.getPassword().isEmpty()) {
            throw new CredentialException("email and password is a must");
        }

        if (userRepository.isUsernameExist(request.getEmail()) > 0) {
            throw new Exception("user exists");
        }

        var user = new User();
        user.setFirstname(request.getFirstname());
        user.setLastname(request.getLastname());
        user.setEmail(request.getEmail());
        if (!request.getPassword().isEmpty()) {
            user.setPassword(new BCryptPasswordEncoder().encode(request.getPassword()));
        }
        user.setEnabled(true);

        var customer = new Customer();
        customer.setFirstName(user.getFirstname());
        customer.setLastName(user.getLastname());
        customer.setEmail(user.getEmail());
        customer.setValidFrom(Timestamp.from(Instant.now()));
        customer.setCreatedAt(Timestamp.from(Instant.now()));
        customer.setUpdatedAt(Timestamp.from(Instant.now()));
        var customerAdded = customerRepository.save(customer);

        user.setCustomer(customerAdded);
        user.setValidFrom(Timestamp.from(Instant.now()));
        user.setCreatedAt(Timestamp.from(Instant.now()));
        user.setUpdatedAt(Timestamp.from(Instant.now()));
        var userAdded = userRepository.save(user);

        var account = new Account();
        account.setValidFrom(Timestamp.from(Instant.now()));
        account.setCreatedAt(Timestamp.from(Instant.now()));
        account.setUpdatedAt(Timestamp.from(Instant.now()));
        var accountAdded = accountRepository.save(account);

        var customerAccount = new CustomerAccount();
        customerAccount.setCustomer(customerAdded);
        customerAccount.setAccount(accountAdded);
        customerAccount.setValidFrom(Timestamp.from(Instant.now()));
        customerAccount.setCreatedAt(Timestamp.from(Instant.now()));
        customerAccount.setUpdatedAt(Timestamp.from(Instant.now()));
        var customerAccountAdded = customerAccountRepository.save(customerAccount);
        logger.info(customerAccountAdded.toString());

        var userDetails = loadUserByUsername(userAdded.getEmail());

        return new UserTokenDTO(
                jwtTokenUtil.generateToken(userDetails), userAdded.getEmail());
    }

    @Override
    public User getUserByUsername(String username) {
        return userRepository.getUserByUsername(username);
    }

    @Override
    public List<User> getAll() {
        return userRepository.findAll();
    }

    @Override
    public UserDetails loadUserByUsername(String username) {

        logger.info("loadUserByUsername: " + username);

        return new MyUserDetails(userRepository.getUserByUsername(username));
    }

    @Override
    public User get(Integer id) throws Exception {
        var item = userRepository.findById(id);

        if (item.isEmpty()) {
            throw new Exception("user not found");
        }

        return item.get();
    }

    @Override
    public User add(User user) {
        return user;
    }

    @Override
    public User update(Integer id, User user) throws Exception {
        var item = get(id);
        item.setFirstname(user.getFirstname());
        return userRepository.save(item);
    }

    @Override
    public Integer remove(Integer id) throws Exception {
        userRepository.delete(get(id));
        return id;
    }

    @Override
    public User getCurrentUser() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            Object principal = authentication.getPrincipal();
            var username = ((UserDetails) principal).getUsername();
            return getUserByUsername(username);
        }
        return null;
    }

    @Override
    public Claims validateGoogleToken(String credential) {
        // Signature check
        if (!jwtValidator.validateToken(credential)) {
            logger.info("Invalid signature");
        }
        // Access claims
        Claims claims = Jwts.parser().parseClaimsJwt(credential).getBody();
        String userId = claims.getSubject();
        String userEmail = claims.get("email", String.class);
        // email match
        if (userEmail.isEmpty()) {
            logger.info("Email missing");
        }

        return claims;
    }
}
