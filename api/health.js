module.exports = async function handler(req, res) {
  res.status(200).json({ ok: true, service: 'shevoo-vercel-api', time: new Date().toISOString() });
}
