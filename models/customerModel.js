const db = require('./db');

async function createCustomer(customerData) {
  const connection = await db.connect();
  try {
    const sql = `INSERT INTO customers SET ?`;
    await connection.execute(sql, [customerData]);
  } finally {
    await connection.end();
  }
}

async function getCustomer(customerUUID) {
  const connection = await db.connect();
  try {
    const sql = `SELECT * FROM customers WHERE CustomerUUID = ?`;
    const [rows] = await connection.execute(sql, [customerUUID]);
    return rows[0];
  } finally {
    await connection.end();
  }
}

async function updateCustomer(customerUUID, updateData) {
  const connection = await db.connect();
  try {
    const sql = `UPDATE customers SET ? WHERE CustomerUUID = ?`;
    await connection.execute(sql, [updateData, customerUUID]);
  } finally {
    await connection.end();
  }
}

async function deleteCustomer(customerUUID) {
  const connection = await db.connect();
  try {
    const sql = `DELETE FROM customers WHERE CustomerUUID = ?`;
    await connection.execute(sql, [customerUUID]);
  } finally {
    await connection.end();
  }
}

async function listCustomers() {
  const connection = await db.connect();
  try {
    const sql = `SELECT * FROM customers`;
    const [rows] = await connection.execute(sql);
    return rows;
  } finally {
    await connection.end();
  }
}

module.exports = {
  createCustomer,
  getCustomer,
  updateCustomer,
  deleteCustomer,
  listCustomers
};
