module.exports = {
  Dashboard: require('./pages/dashboard'),
  Customers: require('./pages/customers'),
  NotFound: require('./pages/not-found'),
  Expenses: require('./pages/expenses'),
  Expense: require('./pages/expense'),
  ExpenseInfo: require('./pages/expense/basic'),
  ExpenseAttachments: require('./pages/expense/attachments'),
  ExpenseAttachment: require('./pages/expense/attachment'),
  EmptyParent: require('./pages/empty-parent'),
  Settings: {
    Index: require('./pages/settings'),
    Maventa: require('./pages/settings/maventa'),
    User: require('./pages/settings/user'),
    Company: require('./pages/settings/company'),
    Bankson: require('./pages/settings/bankson')
  },
  Invoices: {
    List: require('./pages/invoices/list'),
    Invoice: require('./pages/invoices/invoice'),
    InvoiceInfo: require('./pages/invoices/info')
  },
  Inbox: {
    Item: require('./pages/inbox/item'),
    Body: require('./pages/inbox/body'),
    Attachment: require('./pages/inbox/attachment')
  }
};
