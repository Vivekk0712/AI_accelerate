# 📸 Image Upload Feature - Chat with Vision

## Overview
Users can now upload images directly in the chat and ask questions about them. The AI will analyze the image and provide detailed responses.

## ✨ Features

### User Experience
- **Image Upload Button**: Click the image icon 📷 in the chat input
- **Image Preview**: See a preview of the selected image before sending
- **Remove Image**: Click the X button to remove the selected image
- **Ask Questions**: Type a question about the image or just send the image
- **No Storage**: Images are processed in real-time and not stored

### Supported Image Formats
- JPEG/JPG
- PNG
- GIF
- WebP
- BMP
- All standard image formats

### Size Limits
- Maximum image size: **10MB**
- Recommended: Keep images under 5MB for faster processing

## 🔧 Technical Implementation

### Frontend (ChatBot.tsx)
```typescript
// Image selection
const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  // Validates file type and size
  // Creates preview
}

// Send message with image
const response = await sendMessageWithImage(message, imageFile);
```

### Backend (session.js)
```javascript
// Receives image as base64
router.post('/chat', verifySession, async (req, res) => {
  const { message, image_base64, image_mime_type } = req.body;
  // Forwards to MCP server
});
```

### MCP Server (main.py)
```python
# Processes image with Gemini Vision
@app.post("/mcp/query")
async def mcp_query(request: ChatRequest):
    if has_image:
        from ai_client import generate_with_image
        response = generate_with_image(
            message, 
            chat_history, 
            user_name, 
            image_base64, 
            image_mime_type
        )
```

### AI Client (ai_client.py)
```python
# Uses Gemini 2.0 Flash Exp for vision
vision_model = genai.GenerativeModel('gemini-2.0-flash-exp')

def generate_with_image(prompt, context, user_name, image_base64, image_mime_type):
    # Decodes base64 image
    # Creates PIL Image
    # Generates response with vision model
```

## 🎯 Use Cases

### 1. Document Analysis
**User uploads**: Photo of a document
**User asks**: "What is this document about?"
**AI responds**: Detailed analysis of the document content

### 2. Homework Help
**User uploads**: Math problem screenshot
**User asks**: "How do I solve this?"
**AI responds**: Step-by-step solution

### 3. Object Recognition
**User uploads**: Photo of an object
**User asks**: "What is this?"
**AI responds**: Identification and description

### 4. Code Review
**User uploads**: Screenshot of code
**User asks**: "What's wrong with this code?"
**AI responds**: Code analysis and suggestions

### 5. Image Description
**User uploads**: Any image
**User asks**: "Describe this image"
**AI responds**: Detailed description

## 🚀 How to Use

### For Users
1. Open the chat interface
2. Click the **image icon** (📷) next to the message input
3. Select an image from your device
4. (Optional) Type a question about the image
5. Click **Send**
6. Wait for the AI to analyze and respond

### Example Interactions

**Example 1: Simple Description**
```
User: [uploads image of a cat]
User: "What do you see?"
AI: "I see a fluffy orange tabby cat sitting on a windowsill..."
```

**Example 2: Specific Question**
```
User: [uploads image of a timetable]
User: "When is my math class?"
AI: "According to the timetable, your math class is on Monday at 10:00 AM..."
```

**Example 3: Analysis**
```
User: [uploads image of a chart]
User: "Analyze this data"
AI: "This bar chart shows sales data over 6 months. The trend indicates..."
```

## 🔒 Privacy & Security

### Data Handling
- ✅ Images are converted to base64 for transmission
- ✅ Images are processed in real-time
- ✅ **Images are NOT stored** in the database
- ✅ Only the chat message text is stored (with "[image attached]" indicator)
- ✅ Images are discarded after processing

### Security Measures
- File type validation (images only)
- File size limits (10MB max)
- Secure transmission over HTTPS
- Session-based authentication required

## 📦 Dependencies

### Python (MCP Server)
```txt
google-generativeai==0.5.4  # Gemini AI with vision
Pillow==10.3.0              # Image processing
```

### Installation
```bash
cd mcp_server
pip install Pillow
# or
pip install -r requirements-prod.txt
```

## 🧪 Testing

### Test the Feature
1. Start all servers:
   ```bash
   # Terminal 1: MCP Server
   cd mcp_server
   uvicorn main:app --reload

   # Terminal 2: Backend
   cd backend
   npm run dev

   # Terminal 3: Frontend
   cd frontend
   npm run dev
   ```

2. Open the chat interface
3. Upload a test image
4. Ask a question
5. Verify the AI responds correctly

### Test Cases
- ✅ Upload JPEG image
- ✅ Upload PNG image
- ✅ Upload large image (near 10MB limit)
- ✅ Upload invalid file type (should reject)
- ✅ Upload oversized file (should reject)
- ✅ Send image without text
- ✅ Send image with question
- ✅ Remove image before sending

## 🐛 Troubleshooting

### Image Not Uploading
- Check file size (must be < 10MB)
- Check file type (must be an image)
- Check browser console for errors

### AI Not Responding
- Check MCP server logs
- Verify Gemini API key is set
- Check if vision model is available

### Poor Image Quality
- Use higher resolution images
- Ensure good lighting in photos
- Avoid blurry or distorted images

## 🎨 UI Components

### Image Upload Button
- Icon: 📷 (ImageIcon from react-bootstrap-icons)
- Position: Left side of message input
- Style: Outline secondary button

### Image Preview
- Shows thumbnail of selected image
- Max size: 200x200px
- Includes remove button (X)
- Positioned above message input

### Chat Message Indicator
- User messages with images show: "🖼️" emoji
- Stored as: "[image attached]" in database

## 🔮 Future Enhancements

### Potential Features
- [ ] Multiple image upload
- [ ] Image editing before sending
- [ ] Image history/gallery
- [ ] OCR text extraction
- [ ] Image-to-image comparison
- [ ] Drawing/annotation on images
- [ ] Camera capture (mobile)
- [ ] Image compression options

## 📝 Notes

- Images are processed using **Gemini 2.0 Flash Exp** model
- Vision model is separate from text-only model
- Processing time depends on image size and complexity
- Best results with clear, well-lit images
- Works with both uploaded files and pasted images

---

**Ready to use! 🎉**
