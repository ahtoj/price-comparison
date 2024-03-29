package com.shopleech.publicapi.dal.repository;

import com.shopleech.publicapi.dal.dto.CustomerAccountDALDTO;
import com.shopleech.publicapi.dal.mapper.CustomerAccountDALMapper;
import com.shopleech.publicapi.domain.CustomerAccount;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

/**
 * @author Ahto Jalak
 * @since 28.03.2023
 */
@Component
public class CustomerAccountRepositoryImpl implements CustomerAccountRepositoryCustom {
}
