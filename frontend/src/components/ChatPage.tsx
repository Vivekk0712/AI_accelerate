import { MessageSquare, Upload, FileText } from "lucide-react"
import { Button } from "./ui/button"

export function ChatPage() {
  return (
    <div className="min-h-screen bg-background py-20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">AI Chat Assistant</h1>
            <p className="text-xl text-muted-foreground">
              Ask questions about your uploaded documents
            </p>
          </div>

          {/* Instructions */}
          <div className="bg-muted/50 p-8 rounded-lg border mb-8">
            <h2 className="text-2xl font-semibold mb-4">How to Use</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-primary">1</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Upload Your Documents</h3>
                  <p className="text-sm text-muted-foreground">
                    Go to the Admin panel and upload your PDF, DOCX, or TXT files
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-primary">2</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Open the Chat Widget</h3>
                  <p className="text-sm text-muted-foreground">
                    Click the chat icon in the bottom-right corner of the screen
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-primary">3</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Ask Questions</h3>
                  <p className="text-sm text-muted-foreground">
                    Type your question in natural language and get instant AI-powered answers
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-card p-6 rounded-lg border text-center">
              <MessageSquare className="h-10 w-10 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Natural Language</h3>
              <p className="text-sm text-muted-foreground">
                Ask questions just like you would to a human
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg border text-center">
              <FileText className="h-10 w-10 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Context-Aware</h3>
              <p className="text-sm text-muted-foreground">
                Answers are based on your uploaded documents
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg border text-center">
              <Upload className="h-10 w-10 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Multiple Files</h3>
              <p className="text-sm text-muted-foreground">
                Search across all your uploaded documents
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center bg-gradient-to-r from-primary/10 to-purple-500/10 p-8 rounded-lg border">
            <h2 className="text-2xl font-bold mb-4">Ready to Start?</h2>
            <p className="text-muted-foreground mb-6">
              Upload your first document and experience the power of AI-assisted search
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <a href="#admin">
                  <Upload className="mr-2 h-5 w-5" />
                  Upload Documents
                </a>
              </Button>
              <Button size="lg" variant="outline">
                <MessageSquare className="mr-2 h-5 w-5" />
                Open Chat Widget
              </Button>
            </div>
          </div>

          {/* Note */}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>💡 Tip: The chat widget is always available in the bottom-right corner</p>
            <p className="mt-2">AI-powered answers from your uploaded knowledge base</p>
          </div>
        </div>
      </div>
    </div>
  )
}
