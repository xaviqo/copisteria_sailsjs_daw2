module.exports.routes = {
  '/': 'CopisteriaController.getView',
  'POST /queue': 'CopisteriaController.insertIntoQueue',
  'GET /print/:id': 'CopisteriaController.print'
};
