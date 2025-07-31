package com.bank.controller;

import com.bank.model.Account;
import com.bank.dto.TransferRequest;
import com.bank.service.AccountService;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @PostMapping
    public Account create(@RequestBody Account account) {
        return accountService.createAccount(account);
    }

    @GetMapping("/{accountNumber}")
    public Account get(@PathVariable String accountNumber) {
        return accountService.getAccount(accountNumber);
    }

    @GetMapping
    public List<Account> getAll() {
        return accountService.getAllAccounts();
    }

    @PutMapping("/{accountNumber}")
    public Account update(@PathVariable String accountNumber, @RequestBody Account account) {
        return accountService.updateAccount(accountNumber, account);
    }

    @DeleteMapping("/{accountNumber}")
    public void delete(@PathVariable String accountNumber) {
        accountService.deleteAccount(accountNumber);
    }

    @PostMapping("/{accountNumber}/deposit")
    public Account deposit(@PathVariable String accountNumber, @RequestParam BigDecimal amount) {
        return accountService.deposit(accountNumber, amount);
    }

    @PostMapping("/{accountNumber}/withdraw")
    public Account withdraw(@PathVariable String accountNumber, @RequestParam BigDecimal amount) {
        return accountService.withdraw(accountNumber, amount);
    }

    @PostMapping("/transfer")
    public void transfer(@RequestBody TransferRequest request) {
        accountService.transfer(request);
    }
}
