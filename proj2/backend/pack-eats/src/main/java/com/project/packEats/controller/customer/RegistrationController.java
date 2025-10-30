package com.project.packEats.controller.customer;

import com.project.packEats.entity.customer.CustomersEntity;
import com.project.packEats.model.customer.User;
import com.project.packEats.payload.customer.RegisterCustomerRequest;
import com.project.packEats.payload.customer.RegisterCustomerResponse;
import com.project.packEats.repository.CustomersRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class RegistrationController {

    Logger logger = LoggerFactory.getLogger(RegistrationController.class);

    @Autowired
    private CustomersRepository customersRepository;

    @PostMapping("api/customers/register")
    public ResponseEntity<User> registerUser(@RequestBody RegisterCustomerRequest registerCustomerRequest){
        CustomersEntity customer = new CustomersEntity();
        customer.setName(registerCustomerRequest.getName());
        customer.setEmail(registerCustomerRequest.getEmail());
        customer.setPassword(registerCustomerRequest.getPassword());
        customer.setPhone(registerCustomerRequest.getPhone());

        customersRepository.save(customer);

        logger.info("User information: {}", customer.toString());

        return new ResponseEntity(customer, HttpStatusCode.valueOf(200));
    }
}
