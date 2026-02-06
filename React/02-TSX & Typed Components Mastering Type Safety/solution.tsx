import React from 'react';

// ============================================================
// SECTION 4: TECHNICAL DEEP DIVE (continued)
// ============================================================

// ------------------------------------------------------------
// Generic Components with Type Parameters
// ------------------------------------------------------------
type CurrencyConverterProps<T extends string> = {
    currencies: T[];
    onConvert: (amount: number, from: T, to: T) => number;
};

const CurrencyConverter = <T extends string>({
    currencies,
    onConvert
}: CurrencyConverterProps<T>) => (
    <div>
        <h3>Currency Converter</h3>
        <p>Available currencies: {currencies.join(', ')}</p>
        {/* Component logic here */}
    </div>
);

// ------------------------------------------------------------
// D. Class Components: Full Type System Integration
// ------------------------------------------------------------

// 1. Props and State Type Parameters
interface AccountProps {
    accountId: string;
}

interface AccountState {
    balance: number;
    isLocked: boolean;
}

class AccountManager extends React.Component<AccountProps, AccountState> {
    state: AccountState = { balance: 0, isLocked: false };

    // 2. Typing Lifecycle Methods
    componentDidUpdate(prevProps: AccountProps, prevState: AccountState) {
        if (this.props.accountId !== prevProps.accountId) {
            // Fetch new account data
            console.log(`Account changed from ${prevProps.accountId} to ${this.props.accountId}`);
        }
    }

    render() {
        return (
            <div>
                <h2>Account: {this.props.accountId}</h2>
                <p>Balance: ${this.state.balance}</p>
                <p>Status: {this.state.isLocked ? 'Locked' : 'Active'}</p>
            </div>
        );
    }
}


// ============================================================
// SECTION 5: STEP-BY-STEP DATA MODELING & CODE WALKTHROUGH
// ============================================================

// ------------------------------------------------------------
// A. Transaction List Component (Functional)
// ------------------------------------------------------------
interface Transaction {
    id: string;
    amount: number;
    currency: 'USD' | 'EUR';
    date: Date;
}

interface TransactionListProps {
    transactions: Transaction[];
    onSelect: (id: string) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, onSelect }) => (
    <ul>
        {transactions.map(tx => (
            <li key={tx.id} onClick={() => onSelect(tx.id)}>
                {tx.amount} {tx.currency} - {tx.date.toLocaleDateString()}
            </li>
        ))}
    </ul>
);

// ------------------------------------------------------------
// B. Transaction Form (Class Component)
// ------------------------------------------------------------
interface TransactionFormState {
    amount: string;
    currency: 'USD' | 'EUR';
}

interface TransactionFormProps {
    onSubmit: (amount: number, currency: 'USD' | 'EUR') => void;
}

class TransactionForm extends React.Component<TransactionFormProps, TransactionFormState> {
    state: TransactionFormState = { amount: '', currency: 'USD' };

    handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        this.props.onSubmit(Number(this.state.amount), this.state.currency);
    };

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <input
                    type="number"
                    value={this.state.amount}
                    onChange={e => this.setState({ amount: e.target.value })}
                    placeholder="Amount"
                />
                <select
                    value={this.state.currency}
                    onChange={e => this.setState({ currency: e.target.value as 'USD' | 'EUR' })}
                >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                </select>
                <button type="submit">Submit</button>
            </form>
        );
    }
}


// ============================================================
// SECTION 6: INTERACTIVE CHALLENGE / MINI-PROJECT
// ============================================================

// ------------------------------------------------------------
// Challenge: Build a BudgetTracker component that:
// - Tracks income and expenses in different currencies
// - Shows net balance in a selected currency
// - Uses useReducer for state management
// - Implements type-safe props for currency conversion rates
// ------------------------------------------------------------

interface IncomeEntry {
    id: string;
    amount: number;
    currency: 'USD' | 'EUR';
    description: string;
}

interface ExpenseEntry {
    id: string;
    amount: number;
    currency: 'USD' | 'EUR';
    description: string;
}

interface BudgetState {
    incomes: IncomeEntry[];
    expenses: ExpenseEntry[];
}

type BudgetAction =
    | { type: 'addIncome'; income: IncomeEntry }
    | { type: 'addExpense'; expense: ExpenseEntry };

function budgetReducer(state: BudgetState, action: BudgetAction): BudgetState {
    switch (action.type) {
        case 'addIncome':
            return { ...state, incomes: [...state.incomes, action.income] };
        case 'addExpense':
            // Prevent negative balances through type-safe checks
            const totalIncome = state.incomes.reduce((sum, i) => sum + i.amount, 0);
            const totalExpenses = state.expenses.reduce((sum, e) => sum + e.amount, 0);
            if (totalIncome - totalExpenses - action.expense.amount < 0) {
                console.warn('Cannot add expense: would result in negative balance');
                return state;
            }
            return { ...state, expenses: [...state.expenses, action.expense] };
        default:
            return state;
    }
}

interface BudgetTrackerProps {
    conversionRates: { [key: string]: number }; // e.g., { 'EUR_TO_USD': 1.1 }
}

const BudgetTracker: React.FC<BudgetTrackerProps> = ({ conversionRates }) => {
    const [state, dispatch] = React.useReducer(budgetReducer, { incomes: [], expenses: [] });

    const totalIncome = state.incomes.reduce((sum, i) => sum + i.amount, 0);
    const totalExpenses = state.expenses.reduce((sum, e) => sum + e.amount, 0);
    const netBalance = totalIncome - totalExpenses;

    return (
        <div>
            <h2>Budget Tracker</h2>
            <p>Total Income: ${totalIncome.toFixed(2)}</p>
            <p>Total Expenses: ${totalExpenses.toFixed(2)}</p>
            <p>Net Balance: ${netBalance.toFixed(2)}</p>
            <p>EUR to USD Rate: {conversionRates['EUR_TO_USD'] || 'N/A'}</p>
        </div>
    );
};

// Export all components
export {
    Transaction,
    TransactionList,
    TransactionForm,
    CurrencyConverter,
    AccountManager,
    BudgetTracker,
    budgetReducer
};
