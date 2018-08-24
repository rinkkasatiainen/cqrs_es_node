const mongoose = require('mongoose');
const StreamId = mongoose.model('StreamId');

const GoodsRepository = require('../../domain/repository/list-of-goods');
const findGoods = require('../../domain/query-handlers/find-goods');

const createLinks = (req, res) => (streamId, events) => {
  const event_types = events.map(event => event.type);
  if (event_types.includes('APPROVEDBYCUSTOMS')) {
    res.locals.flashes = { success: ['All good! You\'ll be receiving your shipment as fast as possible. <br/><iframe src="https://giphy.com/embed/11sBLVxNs7v6WA" width="480" height="217" frameBorder="0" class="giphy-embed" allowFullScreen />']};
  }
  if (event_types.includes('PAID')) { return []; }
  if (event_types.includes('VATASSIGNED')) {
    res.locals.flashes = { success: ['Customs has assigned VAT. To receive parcel as fast as possible, please pay VAT! 👋']};
    return [{ rel: "PAY", href: `/parcel/${streamId}/payment`, method: 'POST' }];
  }
  if (event_types.includes('EnrichWithOriginalInvoice')) { return []; }
  if (event_types.includes('ParcelReceivedAtCustoms')) {
    console.log('should flash now!')
    res.locals.flashes = { success: ['You are about to receive a shipment. Please add order documents, such as invoices and receipts for faster clearance from customs! 👋']};
    return [{ rel: "Add shipment details for faster delivery", href: `/parcel/${streamId}/enrich`, method: 'POST' }];
  }
  return [];
};

exports.receive = async (req, res) => {
  const streamId = req.params.uuid;
  const { owner } = await StreamId.findOne({ _id: streamId });
  const repository = new GoodsRepository();
  const parcel = await findGoods(repository)(req.params.uuid);
  const { events } = parcel.data;
  const event_types = events.map(event => event.type);

  res.render('parcel/receiving.pug', {
    parcel, owner, events: events.reverse(), event_types, links: createLinks(req, res)(streamId, events),
  });
};

exports.enrich = async (req, res) => {
  const streamId = req.params.uuid;
  const repository = new GoodsRepository();
  const parcel = await findGoods(repository)(streamId);
  parcel.enrich();
  res.redirect(`/parcel/${streamId}`);
};

exports.pay = async (req, res) => {
  const streamId = req.params.uuid;
  const repository = new GoodsRepository();
  const parcel = await findGoods(repository)(streamId);
  parcel.pay();
  res.redirect(`/parcel/${streamId}`);
};
