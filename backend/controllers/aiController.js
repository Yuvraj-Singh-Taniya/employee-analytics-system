const fetch = require('node-fetch');
const Employee = require('../models/Employee');

// @desc    Get AI recommendation for one or multiple employees
// @route   POST /api/ai/recommend
const getRecommendation = async (req, res, next) => {
  try {
    const { employeeId, employeeIds } = req.body;

    let employees = [];

    if (employeeId) {
      const emp = await Employee.findById(employeeId);
      if (!emp) return res.status(404).json({ message: 'Employee not found' });
      employees = [emp];
    } else if (employeeIds && Array.isArray(employeeIds)) {
      employees = await Employee.find({ _id: { $in: employeeIds } });
    } else {
      employees = await Employee.find().sort({ performanceScore: -1 });
    }

    if (employees.length === 0) {
      return res.status(404).json({ message: 'No employees found' });
    }

    const employeeData = employees.map((e) => ({
      name: e.name,
      department: e.department,
      skills: e.skills,
      performanceScore: e.performanceScore,
      experience: e.experience,
    }));

    const prompt =
      employees.length === 1
        ? `You are an HR analytics AI assistant. Analyze the following employee data and provide:
1. Promotion recommendation (yes/no with reason)
2. Training suggestions (specific courses or skills to develop)
3. Overall AI feedback

Employee Data:
${JSON.stringify(employeeData[0], null, 2)}

Respond in a structured way with clear sections for: Promotion Recommendation, Training Suggestions, and AI Feedback.`
        : `You are an HR analytics AI assistant. Analyze the following employees and provide:
1. Ranked list from best to least performer with brief reasoning
2. Promotion candidates (performance score >= 80)
3. Employees who need improvement (performance score < 60)
4. Training suggestions for low scorers

Employee Data:
${JSON.stringify(employeeData, null, 2)}

Respond in a structured way with clear sections.`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.FRONTEND_URL || 'https://employee-analytics-system-2.onrender.com',
        'X-Title': 'Employee Analytics App',
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.1-8b-instruct:free',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000,
      }),
    });

    const data = await response.json();

    // Return the real error message so we can debug
    if (!response.ok) {
      const errMsg = data?.error?.message || JSON.stringify(data);
      return res.status(500).json({ message: errMsg });
    }

    const aiText = data.choices[0].message.content;

    res.json({
      recommendation: aiText,
      employees: employeeData,
      model: data.model,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getRecommendation };