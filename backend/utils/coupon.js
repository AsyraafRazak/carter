const { randomUUID } = require('crypto');

function createCouponCode() {
  return `CB-${randomUUID().slice(0, 8).toUpperCase()}`;
}

module.exports = { createCouponCode };
