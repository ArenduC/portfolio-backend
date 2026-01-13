const express = require("express");
const { createClient } = require("@supabase/supabase-js");


const API_CONFIG = require("./connection.js");
const { sendPortfolioMail } = require("./mailer.js");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT || 8000;



// Initialize the supabase Client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

const supabasePortfolio = supabase.schema('portfolio');


const responseReturn = (res, status, message, isSuccess, data = null) => {
  res.status(status).json({
    message,
    status,
    isSuccess,
    data,
  });
};










app.get(`${API_CONFIG.ENDPOINTS.GET_PORTFOLIO_MAIL_INBOX}`, async (req, res) => {
  try {
    // Call Supabase function using RPC
    const { data, error } = await supabasePortfolio.rpc("get_portfolio_mails");

    if (error) {
      console.error("Supabase function error:", error);
      return responseReturn(res, 500, "Database error occurred", false, null);
    }

    if (!data || data.length === 0) {
      return responseReturn(res, 401, "Invalid credentials", false, []);
    }

    console.log("SERVER: Data retrieved successfully");

    return responseReturn(res, 200, "Data retrieved successfully", true, data);
  } catch (err) {
    console.error("Server error:", err);
    return responseReturn(res, 500, "Internal Server Error", false, null);
  }
});

app.post(API_CONFIG.ENDPOINTS.INSERT_PORTFOLIO_MAIL_INBOX, async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    await sendPortfolioMail({ name, email, subject, message });


    // Basic validation
    if (!name || !email || !message) {
      return responseReturn(
        res,
        400,
        "Name, email and message are required",
        false,
        []
      );
    }

    const { data, error } = await supabasePortfolio.rpc(
      'insert_portfolio_mail',
      {
        p_name: name,
        p_email: email,
        p_subject: subject,
        p_message: message,
      },
     
    );

    if (error) {
      console.error("Insert error:", error);
      return responseReturn(
        res,
        500,
        "Failed to insert data",
        false,
        []
      );
    }

    return responseReturn(
      res,
      200,
      "Data inserted successfully",
      true,
      data
    );

  } catch (err) {
    console.error("Server error:", err);
    return responseReturn(
      res,
      500,
      "Internal server error",
      false,
      []
    );
  }
});






app.get("/", (req, res) => {
  res.send("Hello PORTFOLIO");
});

// Start the server
app.listen(3090, '0.0.0.0',() => {
  console.log(`The server is running on http://localhost:${port}`);
});

module.exports = app;
