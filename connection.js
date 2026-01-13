require("dotenv").config();
const API_CONFIG = {
  ENDPOINTS: {
  
    GET_PORTFOLIO_MAIL_INBOX: "/v1/portfolio_mail_inbox",
    INSERT_PORTFOLIO_MAIL_INBOX: "/v1/insert_portfolio_mail_inbox",
    
  },
};

module.exports = API_CONFIG;
