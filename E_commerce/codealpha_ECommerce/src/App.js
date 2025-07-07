import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer'; // ← Import Footer
import Home from './pages/Home';
import ProductsList from './pages/ProductsList';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { AuthProvider } from './context/AuthContext';
import UsersList from './pages/UsersList';
import AdminPage from './pages/AdminPage';
import AdminProducts from './pages/AdminProducts';
import PlaceOrder from './pages/PlaceOrder';
import AdminOrders from './pages/AdminOrders';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container" style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          <Navbar />
          <div style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/admin/vieworders" element={<AdminOrders />} />
              <Route path="/admin/users" element={<UsersList />} />
              <Route path="/place-order" element={<PlaceOrder />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/products" element={<ProductsList />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
