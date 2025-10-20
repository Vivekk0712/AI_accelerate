import { useState, useEffect, useCallback } from "react"

// New AI Assistant pages
import { AIHomePage } from "./AIHomePage"
import { HowItWorksPage } from "./HowItWorksPage"
import { UseCasesPage } from "./UseCasesPage"
import { ChatPage } from "./ChatPage"
import AdminPage from "../pages/AdminPage"
import ProfilePage from "./ProfilePage"

export type Route = 
  | "home" 
  | "how-it-works" 
  | "use-cases" 
  | "chat"
  | "admin"
  | "profile"
  // Dynamic routes (handled as strings)
  | string

interface RouterProps {
  onRouteChange?: (route: Route) => void
}

export function Router({ onRouteChange }: RouterProps) {
  const [currentRoute, setCurrentRoute] = useState<Route>("home")

  const handleRouteChange = useCallback((newRoute: Route) => {
    setCurrentRoute(newRoute)
    onRouteChange?.(newRoute)
  }, [onRouteChange])

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) as Route
      const route = hash || "home"
      handleRouteChange(route)
    }

    // Set initial route
    const initialHash = window.location.hash.slice(1) as Route
    const initialRoute = initialHash || "home"
    handleRouteChange(initialRoute)

    // Listen for hash changes
    window.addEventListener("hashchange", handleHashChange)
    
    return () => {
      window.removeEventListener("hashchange", handleHashChange)
    }
  }, [handleRouteChange])

  const renderPage = () => {
    switch (currentRoute) {
      case "home":
        return <AIHomePage />
      
      case "how-it-works":
        return <HowItWorksPage />
      
      case "use-cases":
        return <UseCasesPage />
      
      case "chat":
        return <ChatPage />
      
      case "admin":
        return <AdminPage />
      
      case "profile":
        return <ProfilePage />
      
      default:
        return (
          <div className="py-24 bg-background">
            <div className="container mx-auto px-4 lg:px-8 text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
                Page Not Found
              </h1>
              <p className="text-muted-foreground mb-8">
                The page you're looking for doesn't exist.
              </p>
              <a 
                href="#home" 
                className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Go Home
              </a>
            </div>
          </div>
        )
    }
  }

  return renderPage()
}

// Navigation helper function
export const navigateTo = (route: Route) => {
  window.location.hash = route === "home" ? "" : route
}

// Get current route helper
export const getCurrentRoute = (): Route => {
  const hash = window.location.hash.slice(1) as Route
  return hash || "home"
}