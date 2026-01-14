const express = require("express");
const serverless = require("serverless-http");
const { createClient } = require("@supabase/supabase-js");
const cors = require("cors");

const API_CONFIG = require("./connection.js");
const { sendPortfolioMail } = require("./mailer.js");
require("dotenv").config();

const app = express();



app.use(cors({
  origin: "*", // or your domain
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Supabase Client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const supabasePortfolio = supabase.schema("portfolio");

const responseReturn = (res, status, message, isSuccess, data = null) => {
  res.status(status).json({ message, status, isSuccess, data });
};

// Routes
app.get(`${API_CONFIG.ENDPOINTS.GET_PORTFOLIO_MAIL_INBOX}`, async (req, res) => {
  try {
    const { data, error } = await supabasePortfolio.rpc("get_portfolio_mails");
    if (error) return responseReturn(res, 500, "Database error occurred", false);
    if (!data || data.length === 0) return responseReturn(res, 401, "No mails found", false, []);
    return responseReturn(res, 200, "Data retrieved successfully", true, data);
  } catch (err) {
    console.error(err);
    return responseReturn(res, 500, "Internal Server Error", false);
  }
});

app.post(API_CONFIG.ENDPOINTS.INSERT_PORTFOLIO_MAIL_INBOX, async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message)
      return responseReturn(res, 400, "Name, email, and message are required", false);

    await sendPortfolioMail({ name, email, subject, message });

    const { data, error } = await supabasePortfolio.rpc("insert_portfolio_mail", {
      p_name: name,
      p_email: email,
      p_subject: subject,
      p_message: message,
    });

    if (error) return responseReturn(res, 500, "Failed to insert data", false);

    return responseReturn(res, 200, "Data inserted successfully", true, data);
  } catch (err) {
    console.error(err);
    return responseReturn(res, 500, "Internal server error", false);
  }
});

app.get("/", (req, res) => {
  res.send("Hello PORTFOLIO");
});

if(require.main === module){
  const PORT = process.env.PORT || 3090;
  app.listen(PORT, ()=>{
    console.log(`Local server running at http://localhost:${PORT}`)
  })
}

// ✅ Export for Vercel
module.exports = app;
module.exports.handler = serverless(app);
