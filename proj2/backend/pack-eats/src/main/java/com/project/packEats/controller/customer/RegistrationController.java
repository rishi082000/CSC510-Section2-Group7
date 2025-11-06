package com.project.packEats.controller.customer;

import com.project.packEats.entity.customer.CustomersEntity;
import com.project.packEats.payload.customer.LoginCustomerRequest;
import com.project.packEats.payload.customer.RegisterCustomerRequest;
import com.project.packEats.repository.CustomersRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class RegistrationController {

    Logger logger = LoggerFactory.getLogger(RegistrationController.class);

    @Autowired
    private CustomersRepository customersRepository;

    @PostMapping("api/customers/register")
    public ResponseEntity<String> registerUser(@RequestBody RegisterCustomerRequest registerCustomerRequest){

        if(customersRepository.findByEmail(registerCustomerRequest.getEmail()).isPresent() ||
                customersRepository.findByPhone(registerCustomerRequest.getPhone()).isPresent()){
            logger.info("The user {} already exists in the database.", registerCustomerRequest.getName());
            return new ResponseEntity("User already exists. Please login", HttpStatus.OK);
        }
        CustomersEntity customer = new CustomersEntity();
        customer.setName(registerCustomerRequest.getName());
        customer.setEmail(registerCustomerRequest.getEmail());
        customer.setPassword(registerCustomerRequest.getPassword());
        customer.setPhone(registerCustomerRequest.getPhone());

        customersRepository.save(customer);

        logger.info("User information: {}", customer.toString());

        return new ResponseEntity(customer, HttpStatusCode.valueOf(200));
    }

    @PostMapping("api/customers/login")
    public ResponseEntity<String> registerUser(@RequestBody LoginCustomerRequest loginCustomerRequest){
        String identifier = loginCustomerRequest.getIdentifier();
        String password = loginCustomerRequest.getPassword();

        Optional<CustomersEntity> customer = identifier.contains("@")
                ? customersRepository.findByEmail(identifier)
                : customersRepository.findByPhone(identifier);

        if (customer.isEmpty()) {
            logger.info("The user {} does not exist in the database.", identifier);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User not found. Please register first.");
        }

        CustomersEntity existingCustomer = customer.get();

        if (!existingCustomer.getPassword().equals(password)) {
            logger.info("The entered password for the user {} is incorrect." ,identifier);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid password.");
        }

        logger.info("The user {} has logged in successfully.", identifier);
        // If login successful
        return ResponseEntity.ok("Login successful!");
    }
}
