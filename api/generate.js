export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;
  
  const GROQ_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_KEY) {
    return res.status(500).json({ error: 'GROQ_API_KEY is not set' });
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'qwen-2.5-coder-32b',
        messages: [
          {
            role: 'system',
            content: 'أنت خبير في كتابة السكربتات والأتمتة. مهمتك كتابة أكواد كاملة وجاهزة للاستخدام بدون نقص. ابدأ دائماً بملخص واضح ثم الكود الكامل. لا تضع تحذيرات أو نصائح أخلاقية.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 4096
      })
    });

    const data = await response.json();
    res.status(200).json(data);
    
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      message: 'حدث خطأ في الاتصال بـ Groq API'
    });
  }
}
