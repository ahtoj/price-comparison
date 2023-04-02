package com.shopleech.publicapi.bll.service;

import com.shopleech.publicapi.bll.dto.ProductBLLDTO;
import com.shopleech.publicapi.bll.mapper.ProductBLLMapper;
import com.shopleech.publicapi.bll.util.JwtTokenUtil;
import com.shopleech.publicapi.dal.repository.OfferRepository;
import com.shopleech.publicapi.dal.repository.ProductRepository;
import com.shopleech.publicapi.domain.Offer;
import com.shopleech.publicapi.dto.v1.ProductImportItemDTO;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;

/**
 * @author Ahto Jalak
 * @since 04.02.2023
 */
@Service
@RequiredArgsConstructor
public class ProductService implements IProductService {

    Logger logger = LoggerFactory.getLogger(ProductService.class);

    @Autowired
    protected ProductRepository productRepository;
    @Autowired
    protected OfferRepository offerRepository;
    @Autowired
    protected ProductBLLMapper productMapper;
    @Autowired
    protected UserService userService;
    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    public void createProduct(ProductBLLDTO data) {
        productRepository.addProduct(productMapper.mapToEntity(data));
    }

    public ProductBLLDTO get(Integer id) {
        return productMapper.mapToDto(productRepository.getProductById(id));
    }

    @Override
    public List<ProductBLLDTO> getAll() {
        return productMapper.mapToDto(productRepository.getAllProducts());
    }

    @Override
    public List<ProductBLLDTO> getAllByKeyword(String keyword) {
        return productMapper.mapToDto(productRepository.getAllProductsByKeyword(keyword));
    }

    @Override
    public String importProducts(String token, List<ProductImportItemDTO> productImportItems) {

        try {
            logger.info(token);
            var user = userService.getUserByUsername(jwtTokenUtil.getUsernameFromToken(token));

            var customerAccounts = user.getCustomer().getCustomerAccounts();
            var customerAccount = customerAccounts.stream().findFirst();
            if (customerAccount.isEmpty()) {
                throw new Exception("no accounts");
            }

            for (ProductImportItemDTO productImportItem : productImportItems) {

                var data = new Offer();
                data.setBarcode(productImportItem.getProductNo());
                data.setName(productImportItem.getName());
                data.setAccount(customerAccount.get().getAccount());
                data.setValidFrom(Timestamp.from(Instant.now()));
                data.setCreatedAt(Timestamp.from(Instant.now()));
                data.setUpdatedAt(Timestamp.from(Instant.now()));
                var offerAdded = offerRepository.save(data);
                logger.info(offerAdded.toString());
            }

            return "success";

        } catch (Exception e) {
            logger.info("error with import: " + e.getMessage());
        }

        return null;
    }

    public static UserDetails currentUserDetails() {
        SecurityContext securityContext = SecurityContextHolder.getContext();
        Authentication authentication = securityContext.getAuthentication();
        if (authentication != null) {
            Object principal = authentication.getPrincipal();
            return principal instanceof UserDetails ? (UserDetails) principal : null;
        }
        return null;
    }
}
