export function getCsrfToken(req, res) {
  try {
    const token = req.csrfToken();
    return res.json({ csrfToken: token });
  } catch (err) {
    return res.status(500).json({ error: 'CSRF token üretilemedi.' });
  }
}
