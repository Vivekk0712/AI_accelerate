import { Button } from "./ui/button"
import { MessageSquare, Upload, Brain, Zap, Shield, Database, Sparkles, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

export function AIHomePage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-primary/5 via-purple-500/5 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-purple-500/5 via-primary/5 to-transparent rounded-full blur-3xl"
        />
      </div>
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary/10 via-background to-purple-500/10">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Powered by AI</span>
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent"
            >
              Your Own Smart AI Assistant
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-xl md:text-2xl text-muted-foreground mb-4 font-semibold"
            >
              Powered by Gemini + Elasticsearch
            </motion.p>
            
            <motion.p 
              variants={itemVariants}
              className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed"
            >
              Upload your documents, and our chatbot will answer any question using context-aware AI with semantic search.
            </motion.p>
            
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" className="text-lg px-8 py-6 shadow-lg shadow-primary/50" asChild>
                  <a href="#chat" className="group">
                    <MessageSquare className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                    Try Demo
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </a>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2" asChild>
                  <a href="#how-it-works">Learn How It Works</a>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Feature Cards */}
          <motion.div 
            className="grid md:grid-cols-3 gap-6 mt-16 max-w-5xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {[
              {
                icon: Upload,
                title: "Upload Documents",
                description: "Support for PDF, DOCX, TXT, and more. Your files are securely stored.",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: Brain,
                title: "AI-Powered Search",
                description: "Elasticsearch vector search finds the most relevant information instantly.",
                color: "from-purple-500 to-pink-500"
              },
              {
                icon: MessageSquare,
                title: "Natural Conversations",
                description: "Gemini 2.5 Pro generates accurate, contextual answers from your documents.",
                color: "from-orange-500 to-red-500"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="group bg-card p-6 rounded-2xl border shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className={`h-12 w-12 rounded-xl bg-gradient-to-br ${feature.color} p-2.5 mb-4 shadow-lg`}
                >
                  <feature.icon className="h-full w-full text-white" />
                </motion.div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="relative py-16 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Built with Industry-Leading Technology</h2>
            <p className="text-muted-foreground mb-12 text-lg">
              Combining the best tools for AI, search, and data management
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { icon: Brain, name: "Gemini 2.5 Pro", desc: "AI Generation", color: "from-blue-500 to-cyan-500" },
                { icon: Zap, name: "Elasticsearch", desc: "Vector Search", color: "from-yellow-500 to-orange-500" },
                { icon: Database, name: "Supabase", desc: "Data Storage", color: "from-green-500 to-emerald-500" },
                { icon: Shield, name: "Firebase", desc: "Authentication", color: "from-purple-500 to-pink-500" }
              ].map((tech, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                >
                  <motion.div 
                    className={`h-16 w-16 bg-gradient-to-br ${tech.color} rounded-2xl flex items-center justify-center mb-3 shadow-lg group-hover:shadow-2xl transition-shadow`}
                    whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <tech.icon className="h-8 w-8 text-white" />
                  </motion.div>
                  <h3 className="font-semibold text-sm md:text-base">{tech.name}</h3>
                  <p className="text-xs md:text-sm text-muted-foreground">{tech.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 bg-gradient-to-r from-primary via-purple-600 to-pink-600 text-white overflow-hidden">
        {/* Animated Background Elements */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-0 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"
        />
        
        <div className="container mx-auto px-4 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.h2 
              className="text-3xl md:text-5xl font-bold mb-4"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Ready to Try Your AI Assistant?
            </motion.h2>
            <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Upload your documents and start asking questions. It's that simple.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6 shadow-2xl hover:shadow-3xl transition-shadow" asChild>
                <a href="#chat" className="group">
                  <MessageSquare className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                  Start Chatting Now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
