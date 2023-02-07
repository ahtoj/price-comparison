package com.shopleech.publicapi.dto.v1;

import com.shopleech.base.config.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author Ahto Jalak
 * @since 24.01.2023
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {

   private Integer id;
   private String firstname;
   private String lastname;
   private String email;
   private String password;
   private Role role;
}
