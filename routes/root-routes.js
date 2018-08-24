const express = require('express');
const router = express.Router();

const importController = require('../ports/controllers/importController');
const restImportController = require('../ports/controllers/rest/importController');

const customsController = require('../ports/controllers/customsController');
const goodsController = require('../ports/controllers/goodsController');
const authController = require('../ports/controllers/authController');
const parcelController = require('../ports/controllers/parcelController');
const { catchErrors } = require('../handlers/errorHandlers');


// JSON & others
router.get('/client/import/:id', (req, res) => {
  if (req.headers.accept.includes('text/html')) {
    return importController.importGoods(req, res);
  }
  return restImportController.importGoods(req, res);
});


// register-login for Aland Post
router.get('/customs', customsController.home);
router.get('/customs/login', customsController.loginForm);
router.get('/customs/register', customsController.registerForm);
router.get('/customs/logout', authController.logoutCustoms);
router.get('/logout', authController.logout);

router.get('/customs/parcel/new', customsController.newParcel);
router.get('/customs/parcel/generate', customsController.generateParcel);
router.post('/customs/parcel', customsController.createParcel);
router.get('/customs/parcel/:id', customsController.editParcel);
router.get('/customs/parcel', customsController.listParcels);

router.get('/customs/parcel/:id/vat', customsController.addVATDetails);
router.post('/customs/parcel/:id/vat', customsController.assignVat);
router.post('/customs/parcel/:id/recipient/notify', customsController.notifyRecipient);
router.post('/customs/parcel/:id/approve', customsController.approveParcel);

const GoodsRepository = require('../domain/repository/list-of-goods');

// login and register as Aland Post
router.post(
  '/customs/register',
  // 1. Validate the registration data
  customsController.validateRegister,
  // 2. register the user
  customsController.register,
  // 3. we need to log them in
  authController.login,
);
router.post('/customs/login', authController.login);


// Client routes
const findGoods = require('../domain/query-handlers/find-goods');

router.get('/c/goods/:uuid', (req, res) => {
  const exec = async () => {
    const repository = new GoodsRepository();
    const entity = await findGoods(repository)(req.params.uuid);
    res.render('client/goods-first.pug');
  };

  catchErrors(exec());
});

const authenticate = require('../ports/authenticate');
const roles = require('../ports/roles');

router.get(
  '/parcel/:uuid',
  catchErrors(authenticate(roles.OWNER)),
  catchErrors(parcelController.receive),
);
// pay
router.post(
  '/parcel/:uuid/payment',
  catchErrors(authenticate(roles.OWNER)),
  catchErrors(parcelController.pay),
);
router.post(
  '/parcel/:uuid/enrich',
  catchErrors(authenticate(roles.OWNER)),
  catchErrors(parcelController.enrich),
);


const mongoose = require('mongoose');
const StreamId = mongoose.model('StreamId');
const Event = mongoose.model('Event');

// Do work here
router.get('/', async (req, res) => {
  const newestParcelId = await Event.findOne().sort('-created');
  res.redirect(`/parcel/${newestParcelId.streamId}`)
});

module.exports = router;
