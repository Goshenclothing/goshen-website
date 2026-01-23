import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Products from '@/components/Products';
import Collections from '@/components/Collections';
import Reviews from '@/components/Reviews';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';
import ScrollToTop from '@/components/ScrollToTop';
import CartSidebar from '@/components/CartSidebar';

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Products />
      <Collections />
      <Reviews />
      <Contact />
      <Footer />

      {/* Interactive Floating Elements */}
      <Chatbot />
      <ScrollToTop />
      <CartSidebar />
    </main>
  );
}
