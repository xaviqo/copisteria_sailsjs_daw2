module.exports = {
  getView: async function (req, res) {
    const info = {
      printers: await Printer.find(),
      queue: await Queue.find()
    };
    return res.view('pages/homepage', info);
  },
  insertIntoQueue: async function (req,res){
    Queue.create({
      printer: req.body.printer,
      content: req.body.content
    })
      .exec(function (err, reg) {
        if (err) {
          return res.serverError(err);
        }
        return res.ok('OK');
      });
  },
  print: async function (req,res){
    const id = req.params.id;
    const lastTextLength = await new Promise((resolve, reject) => {
      Queue.getDatastore().sendNativeQuery(
        'SELECT content FROM queue WHERE printer = ' + id + ' LIMIT 1',
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res.rows[0].content.length);
          }
        }
      );
    });
    const inkPercent = await new Promise((resolve, reject) => {
      Printer.getDatastore().sendNativeQuery(
        'SELECT black FROM printer WHERE id = ' + id,
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res.rows[0].black - (lastTextLength / 100).toFixed(2));
          }
        }
      );
    });

    if (inkPercent > 0) {
      await new Promise((resolve, reject) => {
        Queue.getDatastore().sendNativeQuery(
          'DELETE FROM queue WHERE printer = ' + id + ' LIMIT 1',
          (err, res) => {
            if (err) {
              reject(err);
            }
            resolve()
          }
        );
      });
      await new Promise((resolve, reject) => {
        Printer.getDatastore().sendNativeQuery(
          `UPDATE printer SET cyan = ${inkPercent}, yellow = ${inkPercent}, magenta = ${inkPercent}, black = ${inkPercent} WHERE id = ${id}`,
          (err, res) => {
            if (err) {
              reject(err);
            }
            resolve()
          }
        );
      });
    }
    return res.redirect('/');
  }
};

