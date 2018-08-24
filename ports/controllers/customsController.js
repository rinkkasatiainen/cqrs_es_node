const mongoose = require('mongoose');
const promisify = require('es6-promisify');
const passport = require('passport');
const User = mongoose.model('User');
const ParcelRepository = require('../../domain/repository/list-of-goods');
const goodsController = require('../../ports/controllers/goodsController');

const createParcel = require('../../domain/command-handlers/create-parcel');
const notifyRecipient = require('../../domain/command-handlers/notify-recipient');
const assignVat = require('../../domain/command-handlers/assing-vat');
const approveParcel = require('../../domain/command-handlers/approve-parcel');

const findParcel = require('../../domain/query-handlers/find-goods');
const StreamId = mongoose.model('StreamId');

exports.loginForm = (req, res) => {
  res.render('customs/login', {});
};
exports.registerForm = (req, res) => {
  res.render('customs/register', {});
};
exports.home = (req, res) => {
  res.redirect('/customs/parcel')
};
exports.newParcel = (req, res) => {
  res.render('customs/new-parcel', {});
};

exports.generateParcel = (req, res) => {
  res.render('customs/new-parcel', {});
};

const createLinks = (req, res) => (streamId, events) => {
  const event_types = events.map(event => event.type);
  
  if (event_types.includes('APPROVEDBYCUSTOMS')) {
    return []
  }

  if (event_types.includes('PAID')) {
    res.locals.flashes = { success: ["Recipient has paid VAT. After checking paper invoices from DHL, please approve customs!"] };
    return [{ rel: "Approve and release", href: `/customs/parcel/${streamId}/approve`, method: 'POST' }];
  }
  if (event_types.includes('VATASSIGNED')) {
    return [];
  }
  if (event_types.includes('EnrichWithOriginalInvoice')) {
    res.locals.flashes = { success: ["Recipient added more information about the shipment. Please verify and assign VAT"] };
    return [{ rel: "Verify and assign VAT for shipment", href: `/customs/parcel/${streamId}/VAT`, method: 'GET' }];
  }
  if (event_types.includes('RECIPIENTNOTIFIEDNEWSHIPMENT')) { 
    return [];
  }
  if (event_types.includes('ParcelReceivedAtCustoms')) {
    return [{ rel: "Notify receiver by EMAIL & SMS", href: `/customs/parcel/${streamId}/recipient/notify`, method: 'POST' }];
  }
  return [];
};

exports.editParcel = async (req, res) => {
  const streamId = req.params.id;

  if(req.query.autonotify) {
    notifyRecipient(new ParcelRepository(), streamId);
    res.redirect(`/customs/parcel/${req.params.id}`);
    return;
  }

  const { owner } = await StreamId.findOne({ _id: streamId });
  const parcel = await findParcel(new ParcelRepository())(streamId);
  const { events } = parcel.data;
  const event_types = events.map(event => event.type);
  res.render('customs/edit-parcel', {
    parcel, owner, events: events.reverse(), event_types, links: createLinks(req, res)(streamId, events),
  });
};

exports.addVATDetails = async (req, res) => {
  const streamId = req.params.id;
  const { owner } = await StreamId.findOne({ _id: streamId });
  const parcel = await findParcel(new ParcelRepository())(streamId);
  const { events } = parcel.data;
  const event_types = events.map(event => event.type);
  res.render('customs/add-vat-details', {
    parcel,
    owner,
    events: events.reverse(),
    event_types,
    links: [{ rel: "Verify VAT", href: `/customs/parcel/${streamId}/VAT`, method: 'POST' }],
    // flashes: req.flashes,
  });
};

exports.notifyRecipient = (req, res) => {
  const streamId = req.params.id;
  notifyRecipient(new ParcelRepository(), streamId);
  res.redirect(`/customs/parcel/${streamId}`);
};

exports.assignVat = (req, res) => {
  const { vat_amount } = req.body;
  const streamId = req.params.id;
  assignVat(new ParcelRepository(), streamId, vat_amount, () => {
    res.redirect(`/customs/parcel/${streamId}`);
  });
};

exports.approveParcel = (req, res) => {
  const streamId = req.params.id;
  approveParcel(new ParcelRepository(), streamId, () => {
    res.redirect(`/customs/parcel/${streamId}`);
  });
};

exports.listParcels = (req, res) => {
  res.render('customs/list-parcels', {});
};

exports.createParcel = (req, res) => {
  goodsController.validateGoods(req, res, (req, res) => {
    createParcel(new ParcelRepository(), req, res, (streamId) => {
      if(req.query.autonotify) {
        res.redirect(`/customs/parcel/${streamId}?autonotify=true`);
        return;
      }
      res.redirect(`/customs/parcel/${streamId}`);
    });
  });
};

// Registering
exports.validateRegister = (req, res, next) => {
  req.sanitizeBody('name');
  req.checkBody('name', 'You must supply a name!').notEmpty();
  req.checkBody('email', 'That Email is not valid!').isEmail();
  req.sanitizeBody('email').normalizeEmail({
    gmail_remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false,
  });
  req.checkBody('password', 'Password Cannot be Blank!').notEmpty();
  req.checkBody('password-confirm', 'Confirmed Password cannot be blank!').notEmpty();
  req.checkBody('password-confirm', 'Oops! Your passwords do not match').equals(req.body.password);

  const errors = req.validationErrors();
  if (errors) {
    req.flash('error', errors.map(err => err.msg));
    res.render('register', { title: 'Register', body: req.body, flashes: req.flash() });
    return; // stop the fn from running
  }
  next(); // there were no errors!
};

exports.register = async (req, res, next) => {
  const user = new User({ email: req.body.email, name: req.body.name });
  const register = promisify(User.register, User);
  await register(user, req.body.password);
  next(); // pass to authController.login
};

exports.login = passport.authenticate('local', {
  failureRedirect: '/customs/login',
  failureFlash: 'Failed Login!',
  successRedirect: '/customs',
  successFlash: 'You are now logged in!',
});
