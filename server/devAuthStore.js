const fs = require('fs')
const fsp = require('fs').promises
const path = require('path')
const crypto = require('crypto')
const { pool } = require('./db')

const DATA_DIR = path.join(__dirname, 'data')
const DATA_FILE = path.join(DATA_DIR, 'dev-auth.json')

async function ensureFile() {
  try {
    await fsp.mkdir(DATA_DIR, { recursive: true })
    await fsp.access(DATA_FILE, fs.constants.F_OK)
  } catch {
    const initial = { users: [] }
    await fsp.writeFile(DATA_FILE, JSON.stringify(initial, null, 2), 'utf8')
  }
}

async function loadDBFile() {
  await ensureFile()
  const raw = await fsp.readFile(DATA_FILE, 'utf8')
  try { return JSON.parse(raw) } catch { return { users: [] } }
}

async function saveDBFile(db) {
  await fsp.writeFile(DATA_FILE, JSON.stringify(db, null, 2), 'utf8')
}

function hashPass(passcode, salt = crypto.randomBytes(16).toString('hex')) {
  const derived = crypto.scryptSync(passcode, salt, 64)
  return { salt, hash: derived.toString('hex'), algo: 'scrypt' }
}

function safeId(str) {
  return str.toLowerCase().trim()
}

// Create SQL table if it doesn't exist
async function ensureUsersTable() {
  if (!pool) return
  const create = `
    CREATE TABLE IF NOT EXISTS dev_users (
      id VARCHAR(64) PRIMARY KEY,
      playerName VARCHAR(255),
      playerNameId VARCHAR(255),
      email VARCHAR(255),
      emailId VARCHAR(255),
      companyName VARCHAR(255),
      cred_salt VARCHAR(128),
      cred_hash VARCHAR(256),
      createdAt BIGINT
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `
  await pool.query(create)
}

async function signup({ playerName, passcode, email, companyName }) {
  if (!playerName || !passcode) throw new Error('playerName and passcode are required')
  const idName = safeId(playerName)
  const idEmail = email ? safeId(email) : null

  if (pool) {
    await ensureUsersTable()
    const [rows] = await pool.query('SELECT id FROM dev_users WHERE playerNameId = ? OR emailId = ? LIMIT 1', [idName, idEmail])
    if (rows && rows.length) throw new Error('User already exists')
    const cred = hashPass(passcode)
    const userId = 'u_' + Date.now()
    await pool.query('INSERT INTO dev_users (id, playerName, playerNameId, email, emailId, companyName, cred_salt, cred_hash, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [userId, playerName, idName, email || null, idEmail, companyName || null, cred.salt, cred.hash, Date.now()])
    return { id: userId, playerName, email: email || null, companyName: companyName || null }
  }

  // file fallback
  const db = await loadDBFile()
  const exists = db.users.find(u => u.playerNameId === idName || (idEmail && u.emailId === idEmail))
  if (exists) throw new Error('User already exists')
  const cred = hashPass(passcode)
  const user = {
    id: 'u_' + (db.users.length + 1),
    playerName,
    playerNameId: idName,
    email: email || null,
    emailId: idEmail,
    companyName: companyName || null,
    cred,
    createdAt: Date.now()
  }
  db.users.push(user)
  await saveDBFile(db)
  return { id: user.id, playerName: user.playerName, email: user.email, companyName: user.companyName }
}

async function login({ identifier, passcode }) {
  if (!identifier || !passcode) throw new Error('identifier and passcode are required')
  const id = safeId(identifier)
  if (pool) {
    await ensureUsersTable()
    const [rows] = await pool.query('SELECT * FROM dev_users WHERE playerNameId = ? OR emailId = ? LIMIT 1', [id, id])
    if (!rows || !rows.length) return { ok: false }
    const user = rows[0]
    try {
      const salt = user.cred_salt
      const hash = user.cred_hash
      const verify = crypto.scryptSync(passcode, salt, 64).toString('hex')
      const ok = crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(verify, 'hex'))
      return ok ? { ok: true, id: user.id, playerName: user.playerName, email: user.email } : { ok: false }
    } catch (e) {
      return { ok: false }
    }
  }

  const db = await loadDBFile()
  const user = db.users.find(u => u.playerNameId === id || u.emailId === id)
  if (!user) return { ok: false }
  const { salt, hash } = user.cred
  const verify = crypto.scryptSync(passcode, salt, 64).toString('hex')
  const ok = crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(verify, 'hex'))
  return ok ? { ok: true, id: user.id, playerName: user.playerName, email: user.email } : { ok: false }
}

// Admin helpers (dev only)
async function listUsers() {
  if (pool) {
    await ensureUsersTable()
    const [rows] = await pool.query('SELECT id, playerName, email, companyName, createdAt FROM dev_users')
    return rows
  }
  const db = await loadDBFile()
  return db.users.map(u => ({ id: u.id, playerName: u.playerName, email: u.email, companyName: u.companyName, createdAt: u.createdAt }))
}

async function resetUsers() {
  if (pool) {
    await ensureUsersTable()
    await pool.query('DELETE FROM dev_users')
    return true
  }
  await saveDBFile({ users: [] })
  return true
}

module.exports = { signup, login, listUsers, resetUsers }
