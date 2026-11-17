import AuthProvider from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { CartProvider } from "./context/CartContext";
import Router from "./router";

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <CartProvider>
          <Router />
        </CartProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
