module.exports = {
  "get_all_users_by_email_into_cursor": {
    "arguments": [
      "DataTypes.STRING"
    ],
    "return_type": "refcursor",
    "call_function": "get_all_users_by_email_into_cursor(?)"
  },
  "get_all_users_by_email_into_cursor_1": {
    "arguments": [
      "DataTypes.STRING",
      "DataTypes.INTEGER"
    ],
    "return_type": "refcursor",
    "call_function": "get_all_users_by_email_into_cursor_1(?,?)"
  }
}