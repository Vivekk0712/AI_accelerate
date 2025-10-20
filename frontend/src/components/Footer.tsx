import { Button } from "./ui/button"
import { Separator } from "./ui/separator"
import { 
  Mail, 
  Phone, 
  MapPin, 
  Linkedin, 
  Github, 
  Twitter, 
  Instagram,
  ArrowUp
} from "lucide-react"

export function Footer() {
  const quickLinks = [
    { name: "Home", href: "#home" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "Use Cases", href: "#use-cases" },
    { name: "Chat", href: "#chat" }
  ]

  const resources = [
    { name: "Admin Panel", href: "#admin" },
    { name: "Profile", href: "#profile" }
  ]

  const socialLinks = [
    { name: "GitHub", icon: Github, href: "https://github.com/your-repo" },
    { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com/in/your-profile" }
  ]

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                <span className="font-bold text-primary-foreground text-sm">AI</span>
              </div>
              <span className="font-semibold text-xl">AI Assistant</span>
            </div>
            
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Your Smart AI Assistant powered by Gemini and Elasticsearch. 
              Upload documents and get instant AI-powered answers with semantic search.
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">
                  Built for Hackathon 2025
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-6">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <Button
                    key={social.name}
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0 hover:bg-accent hover:text-primary"
                    onClick={() => window.open(social.href, '_blank')}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="sr-only">{social.name}</span>
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors block py-1 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              {resources.map((item) => (
                <li key={item.name}>
                  <a 
                    href={item.href}
                    className="text-muted-foreground hover:text-primary transition-colors block py-1 text-sm"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Technology */}
          <div>
            <h3 className="font-semibold mb-4">Technology</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Gemini 2.5 Pro</li>
              <li>Elasticsearch</li>
              <li>Supabase</li>
              <li>Firebase Auth</li>
            </ul>
            
            <Button
              variant="outline"
              size="sm"
              className="mt-4 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              onClick={scrollToTop}
            >
              <ArrowUp className="h-4 w-4 mr-1" />
              Back to Top
            </Button>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            © 2025 AI Assistant. Built for Hackathon | Powered by Gemini + Elasticsearch
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <span>Made with ❤️ for innovation</span>
          </div>
        </div>
      </div>
    </footer>
  )
}