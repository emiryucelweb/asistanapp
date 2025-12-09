import './App.css';
import Hero from './components/Hero';
import Features from './components/Features';
import DemoSection from './components/DemoSection';
import Footer from './components/Footer';

function App() {
  return (
    <div className="app">
      <Hero />
      <Features />
      <DemoSection />
      <Footer />
    </div>
  );
}

export default App;
