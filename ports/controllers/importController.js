exports.importGoods = (req, res) => {
  res.render('import-goods', { goods_name: req.params.id, title: "fobar", client: { first_name: "Aki" } });
};
