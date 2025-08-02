// API Base URL
const API_BASE_URL = 'http://localhost:8081/api/accounts';

// DOM Elements
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const toast = document.getElementById('toast');
const loadingOverlay = document.getElementById('loadingOverlay');

// Account Card Elements
const cardNumber = document.getElementById('cardNumber');
const cardHolderName = document.getElementById('cardHolderName');
const cardBalance = document.getElementById('cardBalance');

// Dual Card Elements
const singleCardView = document.getElementById('singleCardView');
const dualCardView = document.getElementById('dualCardView');
const fromCardNumber = document.getElementById('fromCardNumber');
const fromCardHolderName = document.getElementById('fromCardHolderName');
const fromCardBalance = document.getElementById('fromCardBalance');
const toCardNumber = document.getElementById('toCardNumber');
const toCardHolderName = document.getElementById('toCardHolderName');
const toCardBalance = document.getElementById('toCardBalance');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    initializeForms();
    initializeRealTimeCardPopulation();
});

// Tab Functionality
function initializeTabs() {
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            btn.classList.add('active');
            document.getElementById(tabId).classList.add('active');
            
            // Show appropriate card view
            if (tabId === 'transactions') {
                showDualCardView();
            } else {
                showSingleCardView();
            }
        });
    });
}

// Card View Management
function showSingleCardView() {
    singleCardView.style.display = 'block';
    dualCardView.style.display = 'none';
}

function showDualCardView() {
    singleCardView.style.display = 'none';
    dualCardView.style.display = 'block';
}

// Real-time Card Population
function initializeRealTimeCardPopulation() {
    // Account holder name inputs
    const nameInputs = [
        'newAccountHolderName',
        'updateAccountHolderName'
    ];
    
    nameInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('input', function() {
                if (this.value.trim()) {
                    updateCardHolderDisplay(this.value.trim());
                } else {
                    resetCardHolderDisplay();
                }
            });
        }
    });
    
    // Account number inputs for transfer cards
    const fromAccountInput = document.getElementById('fromAccount');
    const toAccountInput = document.getElementById('toAccount');
    
    if (fromAccountInput) {
        fromAccountInput.addEventListener('input', function() {
            if (this.value.trim()) {
                updateTransferCardNumber('from', this.value.trim());
                // Fetch account details if account number is complete
                if (this.value.length === 12) {
                    fetchAccountForTransferCard('from', this.value);
                }
            } else {
                resetTransferCard('from');
            }
        });
    }
    
    if (toAccountInput) {
        toAccountInput.addEventListener('input', function() {
            if (this.value.trim()) {
                updateTransferCardNumber('to', this.value.trim());
                // Fetch account details if account number is complete
                if (this.value.length === 12) {
                    fetchAccountForTransferCard('to', this.value);
                }
            } else {
                resetTransferCard('to');
            }
        });
    }
}

function updateCardHolderDisplay(name) {
    cardHolderName.textContent = name.toUpperCase();
    
    // Add animation effect
    const card = document.getElementById('accountCard');
    card.style.transform = 'scale(1.02)';
    setTimeout(() => {
        card.style.transform = 'scale(1)';
    }, 200);
}

function resetCardHolderDisplay() {
    cardHolderName.textContent = 'SELECT ACCOUNT';
}

function updateTransferCardNumber(cardType, accountNumber) {
    const formattedNumber = formatAccountNumberPartial(accountNumber);
    if (cardType === 'from') {
        fromCardNumber.textContent = formattedNumber;
    } else {
        toCardNumber.textContent = formattedNumber;
    }
}

async function fetchAccountForTransferCard(cardType, accountNumber) {
    try {
        const response = await fetch(`${API_BASE_URL}/${accountNumber}`);
        if (response.ok) {
            const accountData = await response.json();
            updateTransferCard(cardType, accountData);
        } else {
            resetTransferCardDetails(cardType);
        }
    } catch (error) {
        resetTransferCardDetails(cardType);
    }
}

function updateTransferCard(cardType, accountData) {
    const formattedNumber = formatAccountNumber(accountData.accountNumber);
    
    if (cardType === 'from') {
        fromCardNumber.textContent = formattedNumber;
        fromCardHolderName.textContent = accountData.accountHolderName.toUpperCase();
        fromCardBalance.textContent = `₹${accountData.balance.toFixed(2)}`;
    } else {
        toCardNumber.textContent = formattedNumber;
        toCardHolderName.textContent = accountData.accountHolderName.toUpperCase();
        toCardBalance.textContent = `₹${accountData.balance.toFixed(2)}`;
    }
    
    // Add animation effect
    const card = document.getElementById(cardType === 'from' ? 'fromCard' : 'toCard');
    card.style.transform = 'scale(1.02)';
    setTimeout(() => {
        card.style.transform = 'scale(1)';
    }, 200);
}

function resetTransferCard(cardType) {
    if (cardType === 'from') {
        fromCardNumber.textContent = '**** **** ****';
        fromCardHolderName.textContent = 'ENTER FROM ACCOUNT';
        fromCardBalance.textContent = '₹0.00';
    } else {
        toCardNumber.textContent = '**** **** ****';
        toCardHolderName.textContent = 'ENTER TO ACCOUNT';
        toCardBalance.textContent = '₹0.00';
    }
}

function resetTransferCardDetails(cardType) {
    if (cardType === 'from') {
        fromCardHolderName.textContent = 'ACCOUNT NOT FOUND';
        fromCardBalance.textContent = '₹0.00';
    } else {
        toCardHolderName.textContent = 'ACCOUNT NOT FOUND';
        toCardBalance.textContent = '₹0.00';
    }
}

// Form Initialization
function initializeForms() {
    // Create Account Form
    document.getElementById('createAccountForm').addEventListener('submit', handleCreateAccount);
    
    // Get Account Form
    document.getElementById('getAccountForm').addEventListener('submit', handleGetAccount);
    
    // Update Account Form
    document.getElementById('updateAccountForm').addEventListener('submit', handleUpdateAccount);
    
    // Delete Account Form
    document.getElementById('deleteAccountForm').addEventListener('submit', handleDeleteAccount);
    
    // Deposit Form
    document.getElementById('depositForm').addEventListener('submit', handleDeposit);
    
    // Withdraw Form
    document.getElementById('withdrawForm').addEventListener('submit', handleWithdraw);
    
    // Transfer Form
    document.getElementById('transferForm').addEventListener('submit', handleTransfer);
}

// API Functions
async function handleCreateAccount(e) {
    e.preventDefault();
    
    const accountNumber = document.getElementById('newAccountNumber').value;
    const accountHolderName = document.getElementById('newAccountHolderName').value;
    const balance = parseFloat(document.getElementById('initialBalance').value);
    
    const accountData = {
        accountNumber,
        accountHolderName,
        balance
    };
    
    try {
        showLoading(true);
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(accountData)
        });
        
        if (response.ok) {
            const result = await response.json();
            showToast('Account created successfully!', 'success');
            updateAccountCard(result);
            document.getElementById('createAccountForm').reset();
        } else {
            const error = await response.text();
            showToast(`Error: ${error}`, 'error');
        }
    } catch (error) {
        showToast(`Network error: ${error.message}`, 'error');
    } finally {
        showLoading(false);
    }
}

async function handleGetAccount(e) {
    e.preventDefault();
    
    const accountNumber = document.getElementById('searchAccountNumber').value;
    
    try {
        showLoading(true);
        const response = await fetch(`${API_BASE_URL}/${accountNumber}`);
        
        if (response.ok) {
            const result = await response.json();
            showToast('Account found!', 'success');
            updateAccountCard(result);
        } else {
            showToast('Account not found!', 'error');
            resetAccountCard();
        }
    } catch (error) {
        showToast(`Network error: ${error.message}`, 'error');
        resetAccountCard();
    } finally {
        showLoading(false);
    }
}

async function handleUpdateAccount(e) {
    e.preventDefault();
    
    const accountNumber = document.getElementById('updateAccountNumber').value;
    const accountHolderName = document.getElementById('updateAccountHolderName').value;
    const balance = parseFloat(document.getElementById('updateBalance').value);
    
    const updateData = {
        accountNumber,
        accountHolderName,
        balance
    };
    
    try {
        showLoading(true);
        const response = await fetch(`${API_BASE_URL}/${accountNumber}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData)
        });
        
        if (response.ok) {
            const result = await response.json();
            showToast('Account updated successfully!', 'success');
            updateAccountCard(result);
            document.getElementById('updateAccountForm').reset();
        } else {
            const error = await response.text();
            showToast(`Error: ${error}`, 'error');
        }
    } catch (error) {
        showToast(`Network error: ${error.message}`, 'error');
    } finally {
        showLoading(false);
    }
}

async function handleDeleteAccount(e) {
    e.preventDefault();
    
    const accountNumber = document.getElementById('deleteAccountNumber').value;
    
    if (!confirm(`Are you sure you want to delete account ${accountNumber}? This action cannot be undone.`)) {
        return;
    }
    
    try {
        showLoading(true);
        const response = await fetch(`${API_BASE_URL}/${accountNumber}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showToast('Account deleted successfully!', 'success');
            resetAccountCard();
            document.getElementById('deleteAccountForm').reset();
        } else {
            const error = await response.text();
            showToast(`Error: ${error}`, 'error');
        }
    } catch (error) {
        showToast(`Network error: ${error.message}`, 'error');
    } finally {
        showLoading(false);
    }
}

async function handleDeposit(e) {
    e.preventDefault();
    
    const accountNumber = document.getElementById('depositAccountNumber').value;
    const amount = parseFloat(document.getElementById('depositAmount').value);
    
    try {
        showLoading(true);
        const response = await fetch(`${API_BASE_URL}/${accountNumber}/deposit?amount=${amount}`, {
            method: 'POST'
        });
        
        if (response.ok) {
            const result = await response.json();
            showToast(`Successfully deposited ₹${amount.toFixed(2)}!`, 'success');
            updateAccountCard(result);
            document.getElementById('depositForm').reset();
        } else {
            const error = await response.text();
            showToast(`Error: ${error}`, 'error');
        }
    } catch (error) {
        showToast(`Network error: ${error.message}`, 'error');
    } finally {
        showLoading(false);
    }
}

async function handleWithdraw(e) {
    e.preventDefault();
    
    const accountNumber = document.getElementById('withdrawAccountNumber').value;
    const amount = parseFloat(document.getElementById('withdrawAmount').value);
    
    try {
        showLoading(true);
        const response = await fetch(`${API_BASE_URL}/${accountNumber}/withdraw?amount=${amount}`, {
            method: 'POST'
        });
        
        if (response.ok) {
            const result = await response.json();
            showToast(`Successfully withdrew ₹${amount.toFixed(2)}!`, 'success');
            updateAccountCard(result);
            document.getElementById('withdrawForm').reset();
        } else {
            const error = await response.text();
            showToast(`Error: ${error}`, 'error');
        }
    } catch (error) {
        showToast(`Network error: ${error.message}`, 'error');
    } finally {
        showLoading(false);
    }
}

async function handleTransfer(e) {
    e.preventDefault();
    
    const fromAccount = document.getElementById('fromAccount').value;
    const toAccount = document.getElementById('toAccount').value;
    const amount = parseFloat(document.getElementById('transferAmount').value);
    
    const transferData = {
        fromAccount,
        toAccount,
        amount
    };
    
    try {
        showLoading(true);
        const response = await fetch(`${API_BASE_URL}/transfer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(transferData)
        });
        
        if (response.ok) {
            showToast(`Successfully transferred ₹${amount.toFixed(2)} from ${fromAccount} to ${toAccount}!`, 'success');
            document.getElementById('transferForm').reset();
            
            // Refresh both transfer cards with updated balances
            await refreshTransferCards(fromAccount, toAccount);
            
            // Reset the transfer cards after showing updated balances for 3 seconds
            setTimeout(() => {
                resetTransferCard('from');
                resetTransferCard('to');
            }, 3000);
        } else {
            const error = await response.text();
            showToast(`Error: ${error}`, 'error');
        }
    } catch (error) {
        showToast(`Network error: ${error.message}`, 'error');
    } finally {
        showLoading(false);
    }
}

async function refreshTransferCards(fromAccount, toAccount) {
    try {
        // Fetch updated data for both accounts
        const [fromResponse, toResponse] = await Promise.all([
            fetch(`${API_BASE_URL}/${fromAccount}`),
            fetch(`${API_BASE_URL}/${toAccount}`)
        ]);
        
        if (fromResponse.ok) {
            const fromData = await fromResponse.json();
            updateTransferCard('from', fromData);
        }
        
        if (toResponse.ok) {
            const toData = await toResponse.json();
            updateTransferCard('to', toData);
        }
    } catch (error) {
        console.error('Error refreshing transfer cards:', error);
    }
}

// Utility Functions
function updateAccountCard(accountData) {
    const formattedNumber = formatAccountNumber(accountData.accountNumber);
    cardNumber.textContent = formattedNumber;
    cardHolderName.textContent = accountData.accountHolderName.toUpperCase();
    cardBalance.textContent = `₹${accountData.balance.toFixed(2)}`;
    
    // Add animation effect
    const card = document.getElementById('accountCard');
    card.style.transform = 'scale(1.02)';
    setTimeout(() => {
        card.style.transform = 'scale(1)';
    }, 200);
}

function resetAccountCard() {
    cardNumber.textContent = '**** **** ****';
    cardHolderName.textContent = 'SELECT ACCOUNT';
    cardBalance.textContent = '₹0.00';
}

function formatAccountNumber(accountNumber) {
    // Format account number as **** **** **XX (showing last 2 digits)
    const str = accountNumber.toString();
    const lastTwo = str.slice(-2);
    return `**** **** **${lastTwo}`;
}

// function formatAccountNumberPartial(accountNumber) {
//     // Format partial account number as user types
//     const str = accountNumber.toString();
//     if (str.length <= 2) {
//         return `**** **** **${str.padEnd(2, '*')}`;
//     } else if (str.length <= 4) {
//         return `**** **** ${str.slice(-4).padEnd(4, '*')}`;
//     } else if (str.length <= 8) {
//         return `**** ${str.slice(-8).padEnd(8, '*')}`;
//     } else {
//         return `${str.slice(0, 4)} ${str.slice(4, 8)} ${str.slice(8)}`.padEnd(19, '*');
//     }
// }

function formatAccountNumberPartial(accountNumber) {
    const str = accountNumber.toString().slice(0, 12); // ensure max length is 12

    if (str.length <= 2) {
        return `**********${str.padEnd(2, '*')}`;
    } else if (str.length <= 4) {
        return `********${str.padEnd(4, '*')}`;
    } else if (str.length <= 8) {
        return `****${str.padEnd(8, '*')}`;
    } else {
        // Show full formatted style for 9–12 characters
        return `${str.slice(0, 4)} ${str.slice(4, 8)} ${str.slice(8)}`.padEnd(14, '*');
    }
}

function showToast(message, type = 'success') {
    const toastIcon = toast.querySelector('.toast-icon');
    const toastMessage = toast.querySelector('.toast-message');
    
    // Set icon based on type
    if (type === 'success') {
        toastIcon.className = 'toast-icon fas fa-check-circle';
        toast.className = 'toast success';
    } else {
        toastIcon.className = 'toast-icon fas fa-exclamation-circle';
        toast.className = 'toast error';
    }
    
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    // Auto hide after 4 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

function showLoading(show) {
    if (show) {
        loadingOverlay.classList.add('show');
    } else {
        loadingOverlay.classList.remove('show');
    }
}

// Input Validation
document.addEventListener('input', function(e) {
    if (e.target.type === 'text' && e.target.id.includes('AccountNumber')) {
        // Only allow numbers for account number fields
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
    }
    
    if (e.target.type === 'number') {
        // Ensure positive numbers for amount fields
        if (parseFloat(e.target.value) < 0) {
            e.target.value = '';
        }
    }
});

// Add smooth scrolling for better UX
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function() {
        // Scroll to top of the form on submit
        this.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});