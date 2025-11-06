package com.project.packEats.controller.restaurant;

import com.project.packEats.entity.menu.MenuItem;
import com.project.packEats.entity.restaurant.Restaurant;
import com.project.packEats.entity.restaurantUser.User;
import com.project.packEats.repository.MenuItemRepository;
import com.project.packEats.repository.RestaurantRepository;
import com.project.packEats.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/menu")
@CrossOrigin(origins = "http://localhost:3000")
public class MenuController {

    private final MenuItemRepository menuItemRepository;
    private final UserRepository userRepository;
    private final RestaurantRepository restaurantRepository;

    public MenuController(MenuItemRepository menuItemRepository,
                          UserRepository userRepository,
                          RestaurantRepository restaurantRepository) {
        this.menuItemRepository = menuItemRepository;
        this.userRepository = userRepository;
        this.restaurantRepository = restaurantRepository;
    }

    // Fetch all menu items linked to staff's restaurant_id
    @GetMapping
    public List<MenuItem> getMenu(@RequestParam UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (!"restaurant_staff".equals(user.getRole())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only restaurant staff can access menu items");
        }

        UUID restaurantId = user.getRestaurantId();
        if (restaurantId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No restaurant assigned to staff");
        }

        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Restaurant not found"));

        System.out.println("Menu items: " + menuItemRepository.findByRestaurantId(restaurantId));

        return menuItemRepository.findByRestaurantId(restaurantId);
    }

    // Add new menu item (attached automatically to staff’s restaurant_id)
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MenuItem addMenuItem(@RequestParam UUID userId, @RequestBody MenuItem item) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (!"restaurant_staff".equals(user.getRole())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only restaurant staff can add menu items");
        }

        UUID restaurantId = user.getRestaurantId();
        if (restaurantId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No restaurant assigned to staff");
        }

        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Restaurant not found"));

        item.setRestaurant(restaurant);
        return menuItemRepository.save(item);
    }

    // Get single menu item by ID
    @GetMapping("/{id}")
    public MenuItem getMenuItemById(@PathVariable Long id) {
        return menuItemRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Menu item not found"));
    }

    // Update menu item
    @PutMapping("/{id}")
    public MenuItem updateMenuItem(@PathVariable Long id, @RequestBody MenuItem updatedItem) {
        MenuItem existing = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Menu item not found"));

        existing.setName(updatedItem.getName());
        existing.setDescription(updatedItem.getDescription());
        existing.setPrice(updatedItem.getPrice());
        existing.setCategory(updatedItem.getCategory());
        existing.setAvailable(updatedItem.isAvailable());
        existing.setStock(updatedItem.getStock());
        existing.setRecommendationTags(updatedItem.getRecommendationTags());

        return menuItemRepository.save(existing);
    }

    // Delete menu item by ID
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteMenuItem(@PathVariable Long id) {
        if (!menuItemRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Menu item not found");
        }
        menuItemRepository.deleteById(id);
    }
}
