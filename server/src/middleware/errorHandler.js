export function handleGeneralError(err, req, res, next) {
  console.error(err.stack);
  res.status(500).json({ error: 'Sunucuda beklenmeyen bir hata oluştu.' });
}
