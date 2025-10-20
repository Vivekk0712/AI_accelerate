import { GraduationCap, Briefcase, Heart, HeadphonesIcon, Building, BookOpen } from "lucide-react"
import { Button } from "./ui/button"

export function UseCasesPage() {
  const useCases = [
    {
      icon: GraduationCap,
      title: "Education",
      description: "College Notes Query Bot",
      details: "Students can upload lecture notes, textbooks, and study materials. Ask questions and get instant answers for exam preparation.",
      examples: ["What are the key concepts in Chapter 5?", "Explain the difference between X and Y", "Summarize this topic"]
    },
    {
      icon: Heart,
      title: "Healthcare",
      description: "Medical Assistant for Doctors",
      details: "Upload medical PDFs, research papers, and clinical guidelines. Quick access to medical knowledge during consultations.",
      examples: ["What are the treatment options for condition X?", "Latest research on drug Y", "Clinical guidelines for procedure Z"]
    },
    {
      icon: Briefcase,
      title: "Corporate",
      description: "HR & Policy Q&A Bot",
      details: "Upload company policies, HR documents, and employee handbooks. Employees can quickly find answers to policy questions.",
      examples: ["What is the leave policy?", "How do I apply for benefits?", "Company holiday schedule"]
    },
    {
      icon: HeadphonesIcon,
      title: "Customer Support",
      description: "Internal Knowledge Agent",
      details: "Upload product documentation, FAQs, and support guides. Support teams get instant access to accurate information.",
      examples: ["How to troubleshoot issue X?", "Product specifications", "Return policy details"]
    },
    {
      icon: Building,
      title: "Legal",
      description: "Legal Document Assistant",
      details: "Upload contracts, legal documents, and case files. Quickly search through legal documents for specific clauses or information.",
      examples: ["Find clauses related to liability", "What are the termination conditions?", "Summary of agreement"]
    },
    {
      icon: BookOpen,
      title: "Research",
      description: "Research Paper Assistant",
      details: "Upload research papers, journals, and articles. Quickly find relevant information across multiple documents.",
      examples: ["What methodology was used?", "Key findings from paper X", "Compare results across studies"]
    }
  ]

  return (
    <div className="min-h-screen bg-background py-20">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Use Cases</h1>
          <p className="text-xl text-muted-foreground">
            Discover how our AI assistant can transform your workflow across different industries
          </p>
        </div>

        {/* Use Cases Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon
            return (
              <div key={index} className="bg-card p-6 rounded-lg border hover:shadow-lg transition-shadow">
                <div className="h-14 w-14 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{useCase.title}</h3>
                <p className="text-sm font-medium text-primary mb-3">{useCase.description}</p>
                <p className="text-sm text-muted-foreground mb-4">{useCase.details}</p>
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Example Questions:</p>
                  <ul className="space-y-1">
                    {useCase.examples.map((example, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        <span>{example}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>

        {/* Scalability Section */}
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-primary/10 to-purple-500/10 p-8 md:p-12 rounded-lg border text-center">
          <h2 className="text-3xl font-bold mb-4">Built for Scale</h2>
          <p className="text-lg text-muted-foreground mb-6">
            Our architecture is designed to handle millions of documents and thousands of concurrent users
          </p>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">&lt; 50ms</div>
              <div className="text-sm text-muted-foreground">Search Latency</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">Millions</div>
              <div className="text-sm text-muted-foreground">Documents Supported</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">85-95%</div>
              <div className="text-sm text-muted-foreground">Answer Accuracy</div>
            </div>
          </div>
          <Button size="lg" asChild>
            <a href="#chat">Start Using Now</a>
          </Button>
        </div>
      </div>
    </div>
  )
}
