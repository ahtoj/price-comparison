package com.shopleech.publicapi.domain;

import com.shopleech.base.config.FeatureTypeCode;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

/**
 * @author Ahto Jalak
 * @since 06.02.2023
 */
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "_feature")
public class Feature {

    @Id
    @GeneratedValue
    private Integer id;

    @ManyToOne
    private AccountProduct accountProduct;

    private FeatureTypeCode featureTypeCode;
    private String name;
    private String description;

    private Timestamp validFrom;
    private Timestamp validTo;
    private Timestamp createdAt;
    private String createdBy;
    private Timestamp updatedAt;
    private String updatedBy;

    public Integer getId() {
        return id;
    }

    public FeatureTypeCode getFeatureTypeCode() {
        return featureTypeCode;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setFeatureTypeCode(FeatureTypeCode featureTypeCode) {
        this.featureTypeCode = featureTypeCode;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
