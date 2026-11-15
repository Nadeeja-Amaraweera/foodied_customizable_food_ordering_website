import AuthProvider from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import Router from "./router";

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router />
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
