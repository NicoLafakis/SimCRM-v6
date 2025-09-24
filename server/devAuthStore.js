const fs = require('fs')
const fsp = require('fs').promises
const path = require('path')
const crypto = require('crypto')

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

async function loadDB() {
  await ensureFile()
  const raw = await fsp.readFile(DATA_FILE, 'utf8')
  try { return JSON.parse(raw) } catch { return { users: [] } }
}

async function saveDB(db) {
  await fsp.writeFile(DATA_FILE, JSON.stringify(db, null, 2), 'utf8')
}

function hashPass(passcode, salt = crypto.randomBytes(16).toString('hex')) {
  const derived = crypto.scryptSync(passcode, salt, 64)
  return { salt, hash: derived.toString('hex'), algo: 'scrypt' }
}

function safeId(str) {
  return str.toLowerCase().trim()
}

async function signup({ playerName, passcode, email, companyName }) {
  if (!playerName || !passcode) throw new Error('playerName and passcode are required')
  const db = await loadDB()
  const idName = safeId(playerName)
  const idEmail = email ? safeId(email) : null

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
  await saveDB(db)
  return { id: user.id, playerName: user.playerName, email: user.email, companyName: user.companyName }
}

async function login({ identifier, passcode }) {
  if (!identifier || !passcode) throw new Error('identifier and passcode are required')
  const db = await loadDB()
  const id = safeId(identifier)
  const user = db.users.find(u => u.playerNameId === id || u.emailId === id)
  if (!user) return { ok: false }
  const { salt, hash } = user.cred
  const verify = crypto.scryptSync(passcode, salt, 64).toString('hex')
  const ok = crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(verify, 'hex'))
  return ok ? { ok: true, id: user.id, playerName: user.playerName, email: user.email } : { ok: false }
}

module.exports = { signup, login }
