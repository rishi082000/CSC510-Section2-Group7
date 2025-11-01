package com.project.packEats.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.packEats.entity.menu.MenuEntity;

import java.util.List;
import java.util.Optional;

@Repository
public interface MenuRepository extends JpaRepository<MenuEntity, Integer> {

    List<MenuEntity> findAll();

}
