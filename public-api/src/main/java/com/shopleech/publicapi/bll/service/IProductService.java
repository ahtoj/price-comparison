package com.shopleech.publicapi.bll.service;

import com.shopleech.publicapi.bll.dto.ProductBLLDTO;
import com.shopleech.publicapi.dto.v1.ProductImportItemDTO;

import java.util.List;

/**
 * @author Ahto Jalak
 * @since 04.03.2023
 */
public interface IProductService {

    List<ProductBLLDTO> getAll();

    List<ProductBLLDTO> getAllByKeyword(String keyword);

    String importProducts(String token, List<ProductImportItemDTO> productImportItems);


}
