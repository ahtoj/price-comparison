package com.shopleech.publicapi.dto.v1;

import com.shopleech.base.config.type.WatchlistTypeCode;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author Ahto Jalak
 * @since 24.01.2023
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WatchlistDTO {
    private Integer id;
    private WatchlistTypeCode watchlistTypeCode;
    private Integer productId;
    private ProductDTO product;
}
