package com.shopleech.publicapi.dto.v1;

import com.shopleech.base.config.type.BarcodeTypeCode;
import com.shopleech.base.config.type.ProductTypeCode;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author Ahto Jalak
 * @since 24.01.2023
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductDTO {
    private Integer id;
    private Integer categoryId;
    private ProductTypeCode productTypeCode;
    private String barcode;
    private BarcodeTypeCode barcodeTypeCode;
    private String name;
    private String description;
    private Double minPrice;
}
