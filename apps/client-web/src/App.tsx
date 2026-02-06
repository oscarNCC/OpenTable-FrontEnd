import { OrderForm } from './features/order/OrderForm';

function App() {
  return (
    <div className="client-app">
      <header className="client-header">
        <h1 className="client-title">披薩點餐</h1>
      </header>
      <OrderForm />
    </div>
  );
}

export default App;
