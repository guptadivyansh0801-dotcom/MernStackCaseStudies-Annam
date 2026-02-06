import React, { useReducer } from 'react';

// ============================================================
// SECTION 5: STEP-BY-STEP DATA MODELING & CODE WALKTHROUGH
// ============================================================

// ------------------------------------------------------------
// A. Functional Component: Asset List
// ------------------------------------------------------------
interface Asset {
    name: string;
    symbol: string;
    value: number;
    change: number;
}

interface AssetListProps {
    assets: Asset[];
    onRemove: (symbol: string) => void;
}

const AssetList: React.FC<AssetListProps> = ({ assets, onRemove }) => (
    <ul>
        {assets.map(a => (
            <li key={a.symbol}>
                {a.name} ({a.symbol}): ${a.value} ({a.change > 0 ? '+' : ''}{a.change}%)
                <button onClick={() => onRemove(a.symbol)}>Remove</button>
            </li>
        ))}
    </ul>
);

// ------------------------------------------------------------
// B. Class Component: Asset Form
// ------------------------------------------------------------
interface AssetFormProps {
    onAdd: (asset: Asset) => void;
}

interface AssetFormState {
    name: string;
    symbol: string;
    value: string;
    change: string;
}

class AssetForm extends React.Component<AssetFormProps, AssetFormState> {
    state: AssetFormState = { name: '', symbol: '', value: '', change: '' };

    handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ [e.target.name]: e.target.value } as Pick<AssetFormState, keyof AssetFormState>);
    };

    handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        this.props.onAdd({
            name: this.state.name,
            symbol: this.state.symbol,
            value: parseFloat(this.state.value),
            change: parseFloat(this.state.change)
        });
        this.setState({ name: '', symbol: '', value: '', change: '' });
    };

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <input name="name" value={this.state.name} onChange={this.handleChange} placeholder="Name" />
                <input name="symbol" value={this.state.symbol} onChange={this.handleChange} placeholder="Symbol" />
                <input name="value" value={this.state.value} onChange={this.handleChange} type="number" placeholder="Value" />
                <input name="change" value={this.state.change} onChange={this.handleChange} type="number" placeholder="Change %" />
                <button type="submit">Add Asset</button>
            </form>
        );
    }
}

// ------------------------------------------------------------
// C. State Typing with useReducer (Portfolio Management)
// ------------------------------------------------------------
interface PortfolioState {
    assets: Asset[];
}

type PortfolioAction =
    | { type: 'add'; asset: Asset }
    | { type: 'remove'; symbol: string };

function portfolioReducer(state: PortfolioState, action: PortfolioAction): PortfolioState {
    switch (action.type) {
        case 'add':
            return { ...state, assets: [...state.assets, action.asset] };
        case 'remove':
            return { ...state, assets: state.assets.filter(a => a.symbol !== action.symbol) };
        default:
            return state;
    }
}

// Usage example:
// const [state, dispatch] = useReducer(portfolioReducer, { assets: [] });


// ============================================================
// SECTION 6: INTERACTIVE CHALLENGE / MINI-PROJECT
// ============================================================

// ------------------------------------------------------------
// Challenge 1: PortfolioSummary functional component
// - Receives a typed array of assets (Asset[]) as props
// - Renders the total value and average percentage change
// ------------------------------------------------------------
interface PortfolioSummaryProps {
    assets: Asset[];
}

const PortfolioSummary: React.FC<PortfolioSummaryProps> = ({ assets }) => {
    const totalValue = assets.reduce((sum, a) => sum + a.value, 0);
    const avgChange = assets.length > 0
        ? assets.reduce((sum, a) => sum + a.change, 0) / assets.length
        : 0;

    return (
        <div>
            <h2>Portfolio Summary</h2>
            <p>Total Value: ${totalValue.toFixed(2)}</p>
            <p>Average Change: {avgChange.toFixed(2)}%</p>
        </div>
    );
};

// ------------------------------------------------------------
// Challenge 2: AssetEditor class component
// - Has typed state for name, symbol, value, and change
// - Accepts a callback prop onUpdate (typed) to update an asset
// - Resets the form after submission
// ------------------------------------------------------------
interface AssetEditorProps {
    onUpdate: (asset: Asset) => void;
}

interface AssetEditorState {
    name: string;
    symbol: string;
    value: string;
    change: string;
}

class AssetEditor extends React.Component<AssetEditorProps, AssetEditorState> {
    state: AssetEditorState = { name: '', symbol: '', value: '', change: '' };

    handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ [e.target.name]: e.target.value } as Pick<AssetEditorState, keyof AssetEditorState>);
    };

    handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        this.props.onUpdate({
            name: this.state.name,
            symbol: this.state.symbol,
            value: parseFloat(this.state.value),
            change: parseFloat(this.state.change)
        });
        // Reset form after submission
        this.setState({ name: '', symbol: '', value: '', change: '' });
    };

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <h3>Edit Asset</h3>
                <input name="name" value={this.state.name} onChange={this.handleChange} placeholder="Name" />
                <input name="symbol" value={this.state.symbol} onChange={this.handleChange} placeholder="Symbol" />
                <input name="value" value={this.state.value} onChange={this.handleChange} type="number" placeholder="Value" />
                <input name="change" value={this.state.change} onChange={this.handleChange} type="number" placeholder="Change %" />
                <button type="submit">Update Asset</button>
            </form>
        );
    }
}

// Export all components
export { Asset, AssetList, AssetForm, PortfolioSummary, AssetEditor, portfolioReducer };
