import TransactionTable from "../components/TransactionTable";

function Transactions() {
  return (
    <div>
      <h1>Transactions</h1>
      <p className="page-subtitle">
        View and filter all user transactions.
      </p>

      <TransactionTable />
    </div>
  );
}

export default Transactions;