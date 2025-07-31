package com.bank.service;

import com.bank.exception.AccountNotFoundException;
import com.bank.model.Account;
import com.bank.dto.TransferRequest;
import com.bank.repository.AccountRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class AccountServiceImpl implements AccountService {

    private final AccountRepository accountRepository;

    public AccountServiceImpl(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    @Override
    public Account createAccount(Account account) {
        return accountRepository.save(account);
    }

    @Override
    public Account getAccount(String accountNumber) {
        return accountRepository.findById(accountNumber)
                .orElseThrow(() -> new AccountNotFoundException(accountNumber));
    }

    @Override
    public List<Account> getAllAccounts() {
        return accountRepository.findAll();
    }

    @Override
    public Account updateAccount(String accountNumber, Account accountDetails) {
        Account acc = getAccount(accountNumber);
        acc.setAccountHolderName(accountDetails.getAccountHolderName());
        return accountRepository.save(acc);
    }

    @Override
    public void deleteAccount(String accountNumber) {
        accountRepository.deleteById(accountNumber);
    }

    @Override
    public Account deposit(String accountNumber, BigDecimal amount) {
        Account acc = getAccount(accountNumber);
        acc.setBalance(acc.getBalance().add(amount));
        return accountRepository.save(acc);
    }

    @Override
    public Account withdraw(String accountNumber, BigDecimal amount) {
        Account acc = getAccount(accountNumber);
        if (acc.getBalance().compareTo(amount) < 0) {
            throw new IllegalArgumentException("Insufficient funds");
        }
        acc.setBalance(acc.getBalance().subtract(amount));
        return accountRepository.save(acc);
    }

    @Override
    @Transactional
    public void transfer(TransferRequest request) {
        withdraw(request.getFromAccount(), request.getAmount());
        deposit(request.getToAccount(), request.getAmount());
    }
}
