package com.shopleech.publicapi.bll.util;

import com.shopleech.publicapi.bll.service.UserService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtValidator {

    @Value("${google.oauth2.clientId}")
    private String clientId;

    @Value("${google.oauth2.clientSecret}")
    private String clientSecret;

    Logger logger = LoggerFactory.getLogger(JwtValidator.class);

    // Validate and parse JWT token
    public boolean validateToken(String token) {
        Key key = Keys.hmacShaKeyFor(clientSecret.getBytes());
        logger.info(key.toString());
        Claims body = Jwts.parser()
                .setSigningKey(key)
                .parseClaimsJws(token)
                .getBody();
                //Jwts.parserBuilder().setSigningKey(clientSecret).build().parseClaimsJws(token);
        logger.info(body.toString());
        logger.info(body.getExpiration().toString());

        if (body.getExpiration().before(new Date())) {
            logger.info("Token has expired");
            return false;
        }

        return true;
    }

}
