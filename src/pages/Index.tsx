import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import QuickActions from "@/components/QuickActions";
import HeritageShowcase from "@/components/HeritageShowcase";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <QuickActions />
        <HeritageShowcase />
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
