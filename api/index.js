const express = require("express");
const { createClient } = require("@supabase/supabase-js");

const API_CONFIG = require("../connection.js");
const { sendPortfolioMail } = require("../mailer.js");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);
const supabasePortfolio = supabase.schema("portfolio");

const responseReturn = (res, status, message, isSuccess, data = null) => {
  res.status(status).json({ message, status, isSuccess, data });
};

// Routes
app.get(API_CONFIG.ENDPOINTS.GET_PORTFOLIO_MAIL_INBOX, async (req, res) => {
  try {
    const { data, error } = await supabasePortfolio.rpc("get_portfolio_mails");
    if (error) return responseReturn(res, 500, "Database error", false);
    return responseReturn(res, 200, "Success", true, data || []);
  } catch (err) {
    console.error(err);
    return responseReturn(res, 500, "Server error", false);
  }
});

app.post(API_CONFIG.ENDPOINTS.INSERT_PORTFOLIO_MAIL_INBOX, async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message)
      return responseReturn(res, 400, "Missing fields", false);

    await sendPortfolioMail({ name, email, subject, message });

    const { data, error } = await supabasePortfolio.rpc(
      "insert_portfolio_mail",
      {
        p_name: name,
        p_email: email,
        p_subject: subject,
        p_message: message,
      }
    );

    if (error) return responseReturn(res, 500, "Insert failed", false);
    return responseReturn(res, 200, "Inserted", true, data);
  } catch (err) {
    console.error(err);
    return responseReturn(res, 500, "Server error", false);
  }
});

app.get("/", (req, res) => {
  res.send("Hello PORTFOLIO");
});

// ✅ EXPORT ONLY
module.exports = app;
