const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

class AIService {
  constructor() {
    this.apiKey = GEMINI_API_KEY;
    this.apiUrl = GEMINI_API_URL;
  }

  async generateResponse(prompt, context = '') {
    try {
      const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${context}\n\n${prompt}`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`AI API Error: ${response.status}`);
      }

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('AI Service Error:', error);
      throw error;
    }
  }

  // Query Analysis and Suggestions
  async analyzeQuery(queryData) {
    const prompt = `Analyze this customer query and provide insights:
    
Query Description: ${queryData.description}
Status: ${queryData.status}
Customer: ${queryData.customer?.name || 'Unknown'}

Please provide:
1. Priority level (High/Medium/Low)
2. Suggested resolution approach
3. Estimated resolution time
4. Recommended next steps
5. Similar queries pattern (if any)`;

    return await this.generateResponse(prompt, 'You are a customer service AI assistant specializing in query analysis.');
  }

  // Invoice Analysis
  async analyzeInvoice(invoiceData) {
    const prompt = `Analyze this invoice and provide insights:
    
Invoice Number: ${invoiceData.number}
Client: ${invoiceData.client?.name || 'Unknown'}
Total Amount: ${invoiceData.total}
Status: ${invoiceData.status}
Items: ${JSON.stringify(invoiceData.items)}

Please provide:
1. Payment risk assessment
2. Suggested follow-up actions
3. Payment optimization recommendations
4. Client payment history analysis
5. Invoice health score (1-10)`;

    return await this.generateResponse(prompt, 'You are a financial AI assistant specializing in invoice analysis and payment optimization.');
  }

  // Customer Insights
  async generateCustomerInsights(customerData, transactions) {
    const prompt = `Analyze this customer and their transaction history:
    
Customer: ${customerData.name}
Email: ${customerData.email}
Total Transactions: ${transactions.length}
Total Spent: ${transactions.reduce((sum, t) => sum + t.total, 0)}

Please provide:
1. Customer value assessment
2. Purchase pattern analysis
3. Retention risk score
4. Upselling opportunities
5. Personalized recommendations`;

    return await this.generateResponse(prompt, 'You are a customer relationship AI assistant specializing in customer analytics and insights.');
  }

  // Query Auto-Resolution
  async suggestQueryResolution(queryData, similarQueries = []) {
    const prompt = `Based on this query and similar historical queries, suggest a resolution:
    
Current Query: ${queryData.description}
Status: ${queryData.status}

Similar Queries:
${similarQueries.map(q => `- ${q.description} (Resolution: ${q.resolution})`).join('\n')}

Please provide:
1. Suggested resolution text
2. Confidence level (1-10)
3. Reasoning for the suggestion
4. Alternative approaches
5. Follow-up questions needed`;

    return await this.generateResponse(prompt, 'You are a customer service AI assistant specializing in query resolution and customer support.');
  }

  // Dashboard Insights
  async generateDashboardInsights(dashboardData) {
    const prompt = `Analyze this dashboard data and provide business insights:
    
Total Invoices: ${dashboardData.totalInvoices}
Total Quotes: ${dashboardData.totalQueries}
Total Clients: ${dashboardData.totalClients}
Total Queries: ${dashboardData.totalQueries}
Recent Performance: ${JSON.stringify(dashboardData.performance)}

Please provide:
1. Business health assessment
2. Key performance indicators analysis
3. Growth opportunities
4. Risk factors
5. Strategic recommendations`;

    return await this.generateResponse(prompt, 'You are a business intelligence AI assistant specializing in dashboard analysis and strategic insights.');
  }

  // Email Response Generation
  async generateEmailResponse(queryData, tone = 'professional') {
    const prompt = `Generate a ${tone} email response to this customer query:
    
Customer: ${queryData.customer?.name || 'Valued Customer'}
Query: ${queryData.description}
Status: ${queryData.status}

Please generate:
1. A professional email response
2. Appropriate tone and language
3. Clear next steps
4. Contact information
5. Estimated resolution timeline`;

    return await this.generateResponse(prompt, 'You are a customer service AI assistant specializing in professional email communication.');
  }

  // Report Generation
  async generateReport(reportType, data) {
    const prompt = `Generate a comprehensive ${reportType} report based on this data:
    
${JSON.stringify(data, null, 2)}

Please provide:
1. Executive summary
2. Key findings
3. Data analysis
4. Recommendations
5. Action items`;

    return await this.generateResponse(prompt, 'You are a business intelligence AI assistant specializing in report generation and data analysis.');
  }
}

export default new AIService(); 