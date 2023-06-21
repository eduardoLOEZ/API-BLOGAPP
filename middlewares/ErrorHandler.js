const errorHandler = (err, req, res, next) => {
    const { status = 500, message = 'Error en el servidor' } = err;
    res.status(status).json({ error: message });
  };
  
  module.exports = { errorHandler };
  