
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { Auth } from './pages/Auth';
import { AdminLogin } from './pages/AdminLogin';
import { EmailVerification } from './pages/EmailVerification';
import { ForgotPassword } from './pages/ForgotPassword';
import { UserDashboard } from './pages/UserDashboard';
import { UserProfile } from './pages/UserProfile';
import { EditProfile } from './pages/EditProfile';
import { AdminDashboard } from './pages/AdminDashboard';
import { ProductDetails } from './pages/ProductDetails';
import { Cart } from './pages/Cart';
import { OrderDetails } from './pages/OrderDetails';
import { Checkout } from './pages/Checkout';
import { OrderSuccess } from './pages/OrderSuccess';
import { NotFound } from './pages/NotFound';
import { NotAuthorized } from './pages/NotAuthorized';
import { DynamicPage } from './pages/DynamicPage';
import { PageLoader } from './components/UI';

const ProtectedRoute = ({ children, requireAdmin = false }: { children: React.ReactElement, requireAdmin?: boolean }) => {
  const { currentUser, isAdmin, loading } = useAuth();

  if (loading) return <PageLoader />;

  if (!currentUser) {
    return <Navigate to={requireAdmin ? "/admin/login" : "/login"} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <NotAuthorized />;
  }

  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <CartProvider>
          <Router>
            <Routes>
              {/* ----------------------------------------------------------------------- */}
              {/* ADMIN ROUTES (No Layout, No User Navbar)                                */}
              {/* These are matched first.                                                */}
              {/* ----------------------------------------------------------------------- */}
              
              <Route path="/admin/login" element={<AdminLogin />} />
              
              <Route path="/admin" element={
                <ProtectedRoute requireAdmin={true}>
                  {/* Container added to replace Layout's padding */}
                  <div className="p-6 max-w-7xl mx-auto min-h-screen">
                    <AdminDashboard />
                  </div>
                </ProtectedRoute>
              } />

              {/* ----------------------------------------------------------------------- */}
              {/* USER ROUTES (Wrapped in Layout)                                         */}
              {/* The "/*" wildcard catches everything else and applies the User Layout.  */}
              {/* ----------------------------------------------------------------------- */}
              
              <Route path="/*" element={
                <Layout>
                  <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Auth />} />
                    <Route path="/email-verification" element={<EmailVerification />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/product/:id" element={<ProductDetails />} />
                    <Route path="/cart" element={<Cart />} />
                    
                    {/* Dynamic Content Pages */}
                    <Route path="/pages/:slug" element={<DynamicPage />} />

                    <Route path="/dashboard" element={
                      <ProtectedRoute>
                        <UserDashboard />
                      </ProtectedRoute>
                    } />

                    <Route path="/profile" element={
                      <ProtectedRoute>
                        <UserProfile />
                      </ProtectedRoute>
                    } />

                    <Route path="/profile/edit" element={
                      <ProtectedRoute>
                        <EditProfile />
                      </ProtectedRoute>
                    } />

                    <Route path="/order/:id" element={
                      <ProtectedRoute>
                        <OrderDetails />
                      </ProtectedRoute>
                    } />

                    <Route path="/checkout" element={
                      <ProtectedRoute>
                        <Checkout />
                      </ProtectedRoute>
                    } />

                    <Route path="/order-success" element={
                      <ProtectedRoute>
                        <OrderSuccess />
                      </ProtectedRoute>
                    } />

                    {/* 404 Page inside Layout */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Layout>
              } />
            </Routes>
          </Router>
        </CartProvider>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;
