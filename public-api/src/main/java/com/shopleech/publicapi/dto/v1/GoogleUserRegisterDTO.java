package com.shopleech.publicapi.dto.v1;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author Ahto Jalak
 * @since 24.03.2024
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class GoogleUserRegisterDTO {
    private String invitation;
    private String firstname;
    private String lastname;
    private String email;
    private String credential;
    private boolean consent;
}
