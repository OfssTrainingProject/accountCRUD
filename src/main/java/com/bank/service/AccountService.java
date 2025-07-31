package com.bank.service;

import com.bank.model.Account;
import com.bank.dto.TransferRequest;

import java.math.BigDecimal;
import java.util.List;

public interface AccountService {
    Account createAccount(Account account);
    Account getAccount(String accountNumber);
    List<Account> getAllAccounts();
    Account updateAccount(String accountNumber, Account account);
    void deleteAccount(String accountNumber);
    Account deposit(String accountNumber, BigDecimal amount);
    Account withdraw(String accountNumber, BigDecimal amount);
    void transfer(TransferRequest transferRequest);
}
