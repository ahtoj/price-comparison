package com.shopleech.publicapi.dal.repository;

import com.shopleech.publicapi.domain.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * @author Ahto Jalak
 * @since 06.02.2023
 */
@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer>, CategoryRepositoryCustom {

//   void add(Category category);
}