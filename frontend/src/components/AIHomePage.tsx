import { Button } from "./ui/button"
import { MessageSquare, Upload, Brain, Zap, Shield, Database } from "lucide-react"

export function AIHomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-primary/10 via-background to-purple-500/10">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Your Own Smart AI Assistant
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-4">
              Powered by Gemini + Elasticsearch
            </p>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Upload your documents, and our chatbot will answer any question using context-aware AI with semantic search.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6" asChild>
                <a href="#chat">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Try Demo
                </a>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
                <a href="#how-it-works">Learn How It Works</a>
              </Button>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-16 max-w-5xl mx-auto">
            <div className="bg-card p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
              <Upload className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Upload Documents</h3>
              <p className="text-sm text-muted-foreground">
                Support for PDF, DOCX, TXT, and more. Your files are securely stored.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
              <Brain className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">AI-Powered Search</h3>
              <p className="text-sm text-muted-foreground">
                Elasticsearch vector search finds the most relevant information instantly.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
              <MessageSquare className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Natural Conversations</h3>
              <p className="text-sm text-muted-foreground">
                Gemini 2.5 Pro generates accurate, contextual answers from your documents.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Built with Industry-Leading Technology</h2>
            <p className="text-muted-foreground mb-12">
              Combining the best tools for AI, search, and data management
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <Brain className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold">Gemini 2.5 Pro</h3>
                <p className="text-sm text-muted-foreground">AI Generation</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold">Elasticsearch</h3>
                <p className="text-sm text-muted-foreground">Vector Search</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <Database className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold">Supabase</h3>
                <p className="text-sm text-muted-foreground">Data Storage</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold">Firebase</h3>
                <p className="text-sm text-muted-foreground">Authentication</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-purple-600 text-white">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Try Your AI Assistant?
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Upload your documents and start asking questions. It's that simple.
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
            <a href="#chat">
              <MessageSquare className="mr-2 h-5 w-5" />
              Start Chatting Now
            </a>
          </Button>
        </div>
      </section>
    </div>
  )
}
