import { CartProvider } from './CartContext';
import Header from './components/Header';
import Hero from './components/Hero';
import Catalog from './components/Catalog';
import CartDrawer from './components/CartDrawer';
import Catering from './components/Catering';
import Chatbot from './components/Chatbot';
import Footer from './components/Footer';

function App() {
  return (
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
  );
}

export default App;
