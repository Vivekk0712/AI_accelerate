import { Upload, FileText, Search, MessageSquare, CheckCircle, Shield, Zap, Database } from "lucide-react"
import { Button } from "./ui/button"

export function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-background py-20">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">How It Works</h1>
          <p className="text-xl text-muted-foreground">
            Understanding the technology behind your AI assistant
          </p>
        </div>

        {/* Flow Diagram */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="grid md:grid-cols-4 gap-4">
            {/* Step 1 */}
            <div className="bg-card p-6 rounded-lg border text-center relative">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">1. Upload File</h3>
              <p className="text-sm text-muted-foreground">
                Upload your documents (PDF, DOCX, TXT, etc.)
              </p>
              {/* Arrow */}
              <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                <div className="text-primary text-2xl">→</div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-card p-6 rounded-lg border text-center relative">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">2. Process & Index</h3>
              <p className="text-sm text-muted-foreground">
                Text extracted, chunked, and indexed in Elasticsearch
              </p>
              {/* Arrow */}
              <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                <div className="text-primary text-2xl">→</div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-card p-6 rounded-lg border text-center relative">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">3. Ask Question</h3>
              <p className="text-sm text-muted-foreground">
                Type your question in natural language
              </p>
              {/* Arrow */}
              <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                <div className="text-primary text-2xl">→</div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-card p-6 rounded-lg border text-center">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">4. Get Answer</h3>
              <p className="text-sm text-muted-foreground">
                Gemini generates accurate, contextual response
              </p>
            </div>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="max-w-5xl mx-auto mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Technology Stack</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Gemini */}
            <div className="bg-card p-8 rounded-lg border">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Gemini 2.5 Pro</h3>
                  <p className="text-muted-foreground mb-3">
                    Google's most advanced AI model for natural language understanding and generation.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Generates human-like responses</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Context-aware answers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Supports multiple languages</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Elasticsearch */}
            <div className="bg-card p-8 rounded-lg border">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Elasticsearch</h3>
                  <p className="text-muted-foreground mb-3">
                    Industry-leading search engine with vector similarity search capabilities.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Semantic vector search</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Hybrid search (vector + keyword)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Sub-50ms search latency</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Supabase */}
            <div className="bg-card p-8 rounded-lg border">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Database className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Supabase</h3>
                  <p className="text-muted-foreground mb-3">
                    Open-source Firebase alternative for database and file storage.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Secure file storage</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>PostgreSQL database</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Real-time capabilities</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Firebase */}
            <div className="bg-card p-8 rounded-lg border">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Firebase Authentication</h3>
                  <p className="text-muted-foreground mb-3">
                    Secure authentication system with multiple sign-in methods.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Email/Password login</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Google Sign-In</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Phone OTP authentication</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Data Privacy */}
        <div className="max-w-3xl mx-auto bg-muted/50 p-8 rounded-lg border">
          <div className="flex items-start gap-4">
            <Shield className="h-8 w-8 text-primary flex-shrink-0" />
            <div>
              <h3 className="text-xl font-semibold mb-2">Data Privacy & Security</h3>
              <p className="text-muted-foreground mb-4">
                Your data security is our top priority. Here's how we protect your information:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Your files are securely stored and encrypted</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Data is not shared with external parties</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>User-level data isolation ensures privacy</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>You can delete your data anytime</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Button size="lg" asChild>
            <a href="#chat">
              <MessageSquare className="mr-2 h-5 w-5" />
              Try It Now
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}
