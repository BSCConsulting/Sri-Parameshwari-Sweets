import { CartProvider } from './CartContext';
import { CatalogProvider } from './CatalogContext';
import Header from './components/Header';
import Hero from './components/Hero';
import Catalog from './components/Catalog';
import CartDrawer from './components/CartDrawer';
import Catering from './components/Catering';
import Chatbot from './components/Chatbot';
import Footer from './components/Footer';
import AdminApp from './admin/AdminApp';

function Shop() {
  return (
    <CatalogProvider>
      <CartProvider>
        <div className="min-h-screen bg-cream-50">
          <Header />
          <main>
            <Hero />
            <Catalog />
            <Catering />
          </main>
          <Footer />
          <CartDrawer />
          <Chatbot />
        </div>
      </CartProvider>
    </CatalogProvider>
  );
}

function App() {
  if (window.location.pathname.startsWith('/admin')) {
    return <AdminApp />;
  }
  return <Shop />;
}

export default App;
