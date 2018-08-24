const mongoose = require('mongoose');

const StreamId = mongoose.model('StreamId');
const Event = mongoose.model('Event');

class ListOfGoods {
  async findByUUID(uuid) {
    const q = {
      streamId: uuid,
    };

    return Event.find(q);
  }
}

module.exports = ListOfGoods;
