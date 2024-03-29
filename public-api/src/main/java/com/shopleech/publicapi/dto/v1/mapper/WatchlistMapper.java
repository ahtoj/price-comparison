package com.shopleech.publicapi.dto.v1.mapper;

import com.shopleech.publicapi.bll.service.ProductService;
import com.shopleech.publicapi.bll.service.UserService;
import com.shopleech.publicapi.domain.Watchlist;
import com.shopleech.publicapi.dto.v1.WatchlistDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * @author Ahto Jalak
 * @since 24.01.2023
 */
@Component
public class WatchlistMapper {
    Logger logger = LoggerFactory.getLogger(WatchlistMapper.class);

    @Autowired
    private ProductService productService;
    @Autowired
    private UserService userService;
    @Autowired
    private ProductMapper productMapper;

    public List<WatchlistDTO> mapToDto(List<Watchlist> watchlists) {
        return watchlists.stream()
                .map(this::mapToDto).collect(Collectors.toList());
    }

    public WatchlistDTO mapToDto(Watchlist c) {
        var dto = new WatchlistDTO();
        dto.setId(c.getId());
        dto.setWatchlistTypeCode(c.getWatchlistTypeCode());
        try {
            dto.setProductId(c.getProduct().getId());
            dto.setProduct(productMapper.mapToDto(
                    productService.get(c.getProduct().getId())));
        } catch (Exception e) {
            logger.error("watchlist mapper failed");
        }

        return dto;
    }

    public Watchlist mapToEntity(WatchlistDTO newWatchlist) {
        Watchlist entity = new Watchlist();
        entity.setId(newWatchlist.getId());
        entity.setCustomer(userService.getCurrentUser().getCustomer());
        try {
            entity.setProduct(productService.get(newWatchlist.getProductId()));
        } catch (Exception e) {
            logger.error("watchlist mapper failed");
        }
        entity.setWatchlistTypeCode(newWatchlist.getWatchlistTypeCode());

        return entity;
    }
}
