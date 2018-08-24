exports.importGoods = (req, res) => {
  res.json({ goods_name: req.params.id, title: "fobar", client: { first_name: "Aki" } });
};
