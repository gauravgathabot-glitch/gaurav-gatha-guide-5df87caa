import Navbar from "@/components/Navbar";
import ChatInterface from "@/components/ChatInterface";
import Footer from "@/components/Footer";

const Chat = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20 pb-8">
        <div className="container mx-auto px-4 h-full">
          <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)]">
            <div className="text-center mb-6">
              <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
                AI <span className="text-gradient-gold">Guide</span>
              </h1>
              <p className="text-sm text-muted-foreground">
                Ask about heritage sites, local tourism, or army history
              </p>
            </div>
            <ChatInterface />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chat;
