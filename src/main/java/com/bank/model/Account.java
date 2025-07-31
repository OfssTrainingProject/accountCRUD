package com.bank.model;


import java.math.BigDecimal;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "accounts")
public class Account {

    @Id
    private String accountNumber;

    private String accountHolderName;

    private BigDecimal balance;

    public Account() {}

    // Getters and setters
}
