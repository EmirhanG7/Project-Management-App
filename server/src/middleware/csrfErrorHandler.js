export function handleCsrfError(err, req, res, next) {
  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).json({ error: 'CSRF token doğrulaması başarısız.' });
  }
  next(err);
}
