const { parseMultipartData, sanitizeEntity } = require('strapi-utils');
const _ = require('lodash');
const moment = require('moment');

const formatError = error => [
  { messages: [{ id: error.id, message: error.message, field: error.field }] },
];

module.exports = {

  async apply(ctx) {
    const coupon = ctx.request.body.coupon;
    const total = ctx.request.body.total;
    if (!coupon){
      return ctx.badRequest(
        null,
        formatError({
          id: 'Coupon',
          message: "Coupon is required!",
          field: ['ids'],
        })
      );
    }

    // let files = await strapi.query('file', 'upload').find({ id_in: ids }, ['role']);
    let item = await strapi.services.coupon.find({coupon});
    item = item[0];
    if(!item){
      return  {status: 0, msg: 'Coupon not found!'}
    } else {
     // console.log('Coupon', moment(item.expiry).toDate(), moment().toDate());
      if (moment(item.expiry).isBefore(moment()) || !item.active){
        return  {status: 3, msg: 'Offer not valid!'}
      } else {
        // All good apply coupon
        let amt = 0;
          if (item.type.toLowerCase() === 'percentage'){
            amt = (item.discount * total) / 100;
          } else {
            amt = item.discount;
          }

          console.log('Coupon', item, Object.keys(item));
          console.log('Discount calculated', amt, item.discount);
          return {status: 1, msg: 'Coupon applied successfully!', total, discount: amt}
      }
    }
  },

// deleting multiple coupons
  async deleteMultiple(ctx){
    const ids = ctx.request.body.ids;
    if(!ids){
      return ctx.badRequest(
          null,
          formatError({
            id: 'id',
            message: 'Ids is required',
            field: ['ids']
          })
      )
    }

    const result = await strapi.query('coupon').delete({id_in: ids });
    return {status: 1, msg: 'Coupons deleted successfully!', result};
  }

};
