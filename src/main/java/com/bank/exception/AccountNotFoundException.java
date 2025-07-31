package com.bank.exception;

public class AccountNotFoundException extends RuntimeException {
    public AccountNotFoundException(String accNo) {
        super("Account not found: " + accNo);
    }
}
