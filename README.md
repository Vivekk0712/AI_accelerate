# 🤖 MCP-Based Contextual Chatbot with Retrieval-Augmented Generation

> **Powered by Gemini AI + Elasticsearch + Model Context Protocol (MCP)**

A modern AI-powered RAG chatbot that lets you upload documents and ask questions. Get instant, accurate answers using advanced semantic search, vector embeddings, and the Model Context Protocol architecture.

![Tech Stack](https://img.shields.io/badge/React-18-blue) ![Node.js](https://img.shields.io/badge/Node.js-18-green) ![Python](https://img.shields.io/badge/Python-3.11-yellow) ![Firebase](https://img.shields.io/badge/Firebase-Auth-orange) ![Elasticsearch](https://img.shields.io/badge/Elasticsearch-8.12-purple)

---

## 🎥 Demo

**[📺 Watch Demo Video](https://www.youtube.com/watch?v=pGwVfDRDL5k)**

**[🚀 Live Demo](https://ai-assistant-mcp-ten.vercel.app)**

### 🔑 Demo Credentials

**Admin Access:**
- Email: `vegitofssb@gmail.com`
- Password: `Vegito@123`
- Access admin panel at: `/admin`

**Regular User:**
- Sign up with any email or use Google Sign-In

---

---

## ✨ Features

### 🤖 AI Chat Assistant
- **Gemini 2.5 Pro** for natural language understanding
- **Gemini 2.0 Flash Exp** for vision (image analysis)
- Context-aware conversations with chat history
- Upload images and ask questions about them
- Real-time responses with typing indicators

### 📄 Document Processing
- **Supported formats**: PDF, DOCX, XLSX, TXT, HTML, JSON, CSV, XML
- Automatic text extraction and chunking
- **Elasticsearch vector search** for semantic similarity
- 384-dimensional embeddings (Sentence Transformers)
- Hybrid search (vector + keyword matching)

### 🔐 Authentication
- **Firebase Authentication** with multiple methods:
  - Email/Password with strength validation
  - Google Sign-In
  - Phone OTP (with reCAPTCHA)
- Secure session cookies (HttpOnly, Secure, SameSite)
- Account linking support

### 🎨 Modern UI/UX
- Beautiful animations with Framer Motion
- Smooth page transitions
- Dark/Light mode support
- Responsive design (mobile-first)
- Glass morphism effects
- Gradient backgrounds

### 👨‍💼 Admin Dashboard
- File management
- User management
- System statistics
- Admin-only routes

---

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast builds
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Lucide React** for icons
- **React Bootstrap** for UI components

### Backend
- **Node.js + Express** for API server
- **Firebase Admin SDK** for authentication
- **Supabase** for database and file storage
- **Axios** for HTTP requests

### MCP Server (AI Engine)
- **Python FastAPI** for API
- **Google Generative AI** (Gemini)
- **Elasticsearch** for vector search
- **Sentence Transformers** for embeddings
- **PyPDF2, python-docx, openpyxl** for file processing
- **Pillow** for image processing

---

## 📋 Prerequisites

- **Node.js** >= 18
- **Python** 3.10+
- **Firebase Project** (for authentication)
- **Supabase Account** (for database)
- **Elasticsearch** (Cloud or self-hosted)
- **Gemini API Key** (from Google AI Studio)

---

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd NovaFuze_Website
```

### 2. Setup Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication (Email, Google, Phone)
4. Download `serviceAccount.json` → Place in `backend/`
5. Get your web config → Add to `frontend/.env`

### 3. Setup Supabase

1. Go to [Supabase](https://supabase.com/)
2. Create a new project
3. Get your URL and Service Role Key
4. Add to `.env` files

### 4. Setup Elasticsearch

**Option A: Elasticsearch Cloud (Recommended)**
1. Go to [Elastic Cloud](https://cloud.elastic.co/)
2. Create a deployment
3. Get your Cloud ID and API Key

**Option B: Self-Hosted**
```bash
docker run -d -p 9200:9200 -e "discovery.type=single-node" elasticsearch:8.12.0
```

### 5. Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key
3. Add to `mcp_server/.env`

### 6. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

**MCP Server:**
```bash
cd mcp_server
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements-prod.txt
```

### 7. Configure Environment Variables

**Backend (.env):**
```env
PORT=4000
FIREBASE_PROJECT_ID=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=./serviceAccount.json
SESSION_COOKIE_NAME=__session
SESSION_EXPIRES_IN=432000000
NODE_ENV=development
MCP_SERVER_URL=http://localhost:8000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Frontend (.env):**
```env
VITE_API_BASE_URL=http://localhost:4000
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

**MCP Server (.env):**
```env
GEMINI_API_KEY=your-gemini-api-key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET_KEY=your-secret-key

# Elasticsearch (choose one)
# Option A: Serverless
ELASTICSEARCH_ENDPOINT=https://your-project.es.region.gcp.elastic.cloud:443
ELASTICSEARCH_API_KEY=your-api-key

# Option B: Cloud
ELASTICSEARCH_CLOUD_ID=your-cloud-id
ELASTICSEARCH_API_KEY=your-api-key

# Option C: Self-hosted
ELASTICSEARCH_HOSTS=http://localhost:9200
```

### 8. Configure Embedding Model (Optional)

The MCP server uses Sentence Transformers for semantic search. You can choose between two models based on your needs:

**Option 1: Lighter Model (Default - Recommended for Free Tier)**
- Model: `paraphrase-MiniLM-L3-v2`
- Memory: ~250MB
- Speed: Fast
- Accuracy: Good
- Best for: Free hosting (Render free tier), demos, development

**Option 2: Better Accuracy (Recommended for Production)**
- Model: `all-MiniLM-L6-v2`
- Memory: ~400MB
- Speed: Medium
- Accuracy: High
- Best for: Production with paid hosting (Render Starter $7/month)

**To switch models:**

Edit `mcp_server/embeddings.py`:
```python
# Line 18-19
EMBEDDING_MODEL_NAME = 'paraphrase-MiniLM-L3-v2'  # Lighter model
# OR
EMBEDDING_MODEL_NAME = 'all-MiniLM-L6-v2'  # Better accuracy
```

**Note:** If your MCP server crashes or restarts frequently, use the lighter model or upgrade your hosting plan.

---

### 9. Run the Application

**Terminal 1 - MCP Server:**
```bash
cd mcp_server
source venv/bin/activate  # On Windows: venv\Scripts\activate
uvicorn main:app --reload
```

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 3 - Frontend:**
```bash
cd frontend
npm run dev
```

### 10. Access the Application

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:4000
- **MCP Server**: http://localhost:8000

---

## 📚 Usage Guide

### Upload Documents
1. Sign in with your account
2. Go to Chat page
3. Click "Upload File" button
4. Select PDF, DOCX, or other supported files
5. Wait for processing (automatic indexing)

### Chat with AI
1. Type your question in the chat input
2. AI searches your documents for relevant context
3. Get accurate, contextual answers
4. Continue the conversation naturally

### Upload Images
1. Click the 📷 icon in chat
2. Select an image (max 10MB)
3. Ask a question about the image
4. Get AI-powered image analysis

### Admin Features
1. Go to `/admin` route
2. Login with admin credentials
3. View all files and users
4. Manage system resources

---

## 🔧 Advanced Configuration

### Elasticsearch Migration

If you have existing data in Supabase, migrate to Elasticsearch:

```bash
cd mcp_server
python migrate_to_elasticsearch.py
```

This will:
- Fetch all file chunks from Supabase
- Generate embeddings
- Index in Elasticsearch
- Verify migration

### Create Admin User

```bash
cd mcp_server
python -c "from tools.admin_tools import create_admin_user; create_admin_user('admin@example.com', 'password123', 'Admin Name')"
```

### Test Elasticsearch Connection

```bash
cd mcp_server
python test_elasticsearch_integration.py
```

---

## 📁 Project Structure

```
NovaFuze_Website/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── middleware/     # Auth middleware
│   ├── serviceAccount.json # Firebase credentials
│   └── .env
│
├── frontend/               # React + TypeScript
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── hooks/         # Custom hooks
│   │   └── styles/        # CSS files
│   └── .env
│
├── mcp_server/            # Python FastAPI (AI Engine)
│   ├── tools/            # AI tools
│   │   ├── chat_tools.py
│   │   ├── file_tools.py
│   │   ├── user_tools.py
│   │   └── admin_tools.py
│   ├── ai_client.py      # Gemini integration
│   ├── elasticsearch_client.py
│   ├── supabase_client.py
│   ├── main.py           # FastAPI app
│   └── .env
│
└── docs/                 # Documentation
    ├── README.md
    ├── IMAGE_UPLOAD_FEATURE.md
    ├── CLEANUP_SUMMARY.md
    └── FRONTEND_ENHANCEMENTS.md
```

---

## 🔒 Security

- **Authentication**: Firebase Auth with session cookies
- **Authorization**: Role-based access control
- **Data Isolation**: User-level data separation
- **Encryption**: HTTPS, encrypted storage
- **Input Validation**: Server-side validation
- **Rate Limiting**: API rate limits
- **CORS**: Configured for specific origins

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port
# Windows:
netstat -ano | findstr :4000
taskkill /PID <PID> /F

# Linux/Mac:
lsof -ti:4000 | xargs kill -9
```

### Firebase Auth Not Working
- Check Firebase config in `.env`
- Verify `serviceAccount.json` is in `backend/`
- Enable auth methods in Firebase Console

### Elasticsearch Connection Failed
- Verify Elasticsearch is running
- Check credentials in `.env`
- Test connection: `curl -X GET "localhost:9200"`

### Image Upload Too Large
- Backend has 50MB limit
- Frontend validates 10MB
- Compress images before uploading

---

## 📊 Performance

- **Search Latency**: < 50ms (Elasticsearch)
- **AI Response**: 2-5 seconds (Gemini)
- **File Upload**: Depends on size
- **Embedding Generation**: ~100ms per chunk

---

## 🚢 Deployment

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy dist/ folder
```

### Backend (Heroku/Railway)
```bash
cd backend
# Add Procfile: web: node src/index.js
git push heroku main
```

### MCP Server (Railway/Render)
```bash
cd mcp_server
# Add Procfile: web: uvicorn main:app --host 0.0.0.0 --port $PORT
```

---

## 📝 API Documentation

### Chat Endpoint
```http
POST /api/chat
Content-Type: application/json

{
  "message": "What is machine learning?",
  "image_base64": "optional-base64-string",
  "image_mime_type": "image/jpeg"
}
```

### File Upload
```http
POST /api/upload-pdf
Content-Type: multipart/form-data

file: <binary-data>
```

### Admin Login
```http
POST /api/admin/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

---

## 🙏 Acknowledgments

- **Google Gemini** for AI capabilities
- **Elasticsearch** for vector search
- **Firebase** for authentication
- **Supabase** for database
- **Framer Motion** for animations

---

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Check existing documentation
- Review troubleshooting section

---

## 🎯 Roadmap

- [ ] Multi-language support
- [ ] Voice input/output
- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] Team collaboration features
- [ ] API rate limiting
- [ ] Caching layer
- [ ] WebSocket for real-time updates

---

**Built with ❤️ for the AI community**
