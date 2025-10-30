# AI API Documentation - GreenNexus

## Overview
GreenNexus integrates OpenAI's GPT-4o-mini model to provide intelligent, eco-friendly product recommendations tailored for the Kenyan market. The AI assistant helps users discover sustainable products with local availability and pricing in Kenyan Shillings (Kshs).

---

## AI Features

### 1. Eco-Product Recommendation Chat
**Endpoint:** `POST /api/chat`

**Purpose:** Provides AI-powered recommendations for sustainable products available in Kenya

**Model Used:** `gpt-4o-mini`
- Cost-effective ($0.150 per 1M input tokens, $0.600 per 1M output tokens)
- Fast response times (~1-2 seconds)
- High-quality recommendations

---

## API Endpoint Details

### POST /api/chat

**Request Format:**
```json
{
  "message": "best sustainable water bottles 2025"
}
```

**Request Headers:**
```
Content-Type: application/json
```

**Response Format:**
```json
{
  "response": "Hello! 🌿 Here are sustainable water bottles available in Kenya...\n\nSUMMARY\n...\n\nTOP 3 RECOMMENDATIONS\n\n1. Product Name\nKey Features: ...\nEco-Score: 9/10\nPrice Range: Kshs 1,500 - Kshs 3,000\nWhere to Buy: Jumia Kenya, Carrefour Nairobi\n\n..."
}
```

**Response Structure:**
The AI provides structured recommendations including:
- **Summary**: Brief overview of the product category and environmental benefits
- **Top 3 Recommendations**: Detailed product suggestions with:
  - Product name
  - Key features (2-3 bullet points)
  - Eco-Score (1-10 rating)
  - Price Range (in Kenyan Shillings)
  - Where to Buy (Kenyan retailers and locations)
- **Pro Tip**: Actionable sustainability advice for Kenyan consumers

---

## AI System Prompt

The AI assistant is configured with the following characteristics:

**Identity:** Green-Nexus AI - An eco-expert assistant based in Kenya

**Key Behaviors:**
- Focuses on products available in the Kenyan market
- Prices all products in Kenyan Shillings (Kshs)
- Recommends local retailers (Jumia, Carrefour, local eco-shops, markets)
- Considers African context and local alternatives
- Emphasizes sustainability certifications (Fair Trade, USDA Organic, B Corp)
- Uses plain text formatting (no markdown) for better readability
- Provides actionable, location-specific advice

**Response Format Rules:**
- Plain text only (no markdown symbols like *, #, _, `)
- Clear section headers (SUMMARY, TOP 3 RECOMMENDATIONS, PRO TIP)
- Minimal emoji usage (🌿💚♻️🇰🇪)
- Structured product information with consistent formatting

---

## Example Use Cases

### Use Case 1: Sustainable Products
**User Query:** "best eco-friendly water bottles 2025"

**AI Response Includes:**
- 3 reusable water bottle recommendations
- Prices in Kshs (e.g., Kshs 1,500 - Kshs 3,000)
- Where to buy in Kenya (Jumia, Carrefour, etc.)
- Eco-scores and environmental benefits
- Pro tip on reducing plastic waste

### Use Case 2: Organic Products
**User Query:** "organic cotton t-shirts in Kenya"

**AI Response Includes:**
- Local and international organic cotton brands
- Kenyan retailers stocking these items
- Price ranges in Kshs
- Fair Trade and GOTS certifications
- Tips on identifying genuine organic products

### Use Case 3: Zero-Waste Living
**User Query:** "zero waste kitchen essentials"

**AI Response Includes:**
- Essential zero-waste products (beeswax wraps, bamboo utensils, etc.)
- Where to find them in Nairobi/Kenya
- Price comparisons in Kshs
- Environmental impact of each item
- Tips for starting a zero-waste kitchen

---

## Rate Limits & Performance

### Token Limits
- **Max tokens per request:** 800 tokens
- **Average response length:** 400-600 tokens
- **Response time:** 1-3 seconds

### Cost Estimation
Based on OpenAI's GPT-4o-mini pricing:
- **Input cost:** $0.150 per 1M tokens
- **Output cost:** $0.600 per 1M tokens
- **Average cost per query:** ~$0.0005 (less than 1 cent)
- **Estimated monthly cost (1000 queries):** ~$0.50

### Rate Limiting
Currently no rate limiting implemented. Recommended limits:
- **Per user:** 20 requests per hour
- **Global:** 1000 requests per hour
- **Implement caching** for common queries to reduce costs

---

## Error Handling

### Common Errors

**1. Missing OpenAI API Key**
```json
{
  "error": "API key not configured",
  "response": "Server configuration error. Contact admin."
}
```
**Status Code:** 500

**2. Invalid Request Format**
```json
{
  "error": "Request must be JSON",
  "response": "Please send JSON data"
}
```
**Status Code:** 400

**3. OpenAI API Error**
```json
{
  "error": "Rate limit exceeded",
  "response": "AI is taking a green break! Try again later."
}
```
**Status Code:** 500

**4. Empty Message**
```json
{
  "response": "Hello! Ask about eco-friendly products. Example: 'best sustainable water bottles 2025'"
}
```
**Status Code:** 200

---

## Environment Variables

Required environment variables in `.env`:
```bash
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxx
```

**How to obtain:**
1. Create account at https://platform.openai.com
2. Navigate to API Keys section
3. Click "Create new secret key"
4. Copy key (starts with `sk-proj-`)
5. Add to `.env` file (never commit to Git!)

---

## Health Check

### GET /api/chat/health

**Purpose:** Check if the AI service is running and properly configured

**Response:**
```json
{
  "status": "healthy",
  "service": "marketplace",
  "openai_configured": true
}
```

**Status Codes:**
- **200:** Service is healthy
- **500:** Service error

---

## Future Improvements

### Planned Features
1. **Conversation History:** Store chat context for follow-up questions
2. **User Preferences:** Remember user's location and preferences
3. **Product Database Integration:** Link recommendations to actual product listings
4. **Image Search:** Upload product images for identification
5. **Price Comparison:** Real-time price checking across Kenyan retailers
6. **Carbon Footprint Calculator:** Estimate environmental impact of purchases

### Optimization Opportunities
1. **Response Caching:** Cache common queries to reduce API calls
2. **Streaming Responses:** Stream AI responses for better UX
3. **Prompt Engineering:** A/B test different prompts for better results
4. **Fine-tuning:** Train custom model on Kenyan eco-products data
5. **Rate Limiting:** Implement per-user rate limits

---

## Security Considerations

### API Key Protection
- ✅ Store in environment variables
- ✅ Never commit to version control
- ✅ Rotate keys regularly (every 90 days)
- ✅ Use separate keys for dev/staging/production

### Input Validation
- ✅ Validate request JSON format
- ✅ Limit message length (max 500 characters)
- ✅ Sanitize user input to prevent prompt injection
- ❌ **Not implemented:** Rate limiting per user/IP

### Output Safety
- ✅ Plain text responses (no executable code)
- ✅ Context-specific system prompts
- ✅ Error messages don't expose internals

---

## Testing the AI API

### Using cURL
```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "best sustainable water bottles 2025"}'
```

### Using Swagger UI
1. Navigate to http://localhost:5000/apidocs/
2. Find "AI Marketplace" section
3. Click "POST /api/chat"
4. Click "Try it out"
5. Enter message in request body
6. Click "Execute"

### Using Postman
1. Create new POST request
2. URL: `http://localhost:5000/api/chat`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):
```json
{
  "message": "best eco-friendly products in Kenya"
}
```
5. Send request

---

## Support & Contact

For questions about the AI integration:
- **Documentation:** See `/apidocs` for interactive API testing
- **Issues:** Report bugs on GitHub repository
- **Email:** support@greennexus.com (if available)

---

**Last Updated:** January 2025  
**Version:** 1.0.0  
**Model:** OpenAI GPT-4o-mini