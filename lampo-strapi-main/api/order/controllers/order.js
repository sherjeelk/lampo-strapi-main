const { parseMultipartData, sanitizeEntity } = require('strapi-utils');
const axios = require('axios');


const formatError = error => [
  { messages: [{ id: error.id, message: error.message, field: error.field }] },
];


module.exports = {

  async placeOrder(ctx) {
    let order;
    const slot = ctx.request.body.slotId;
    const fullName = ctx.request.body.f_name + ' ' + ctx.request.body.l_name;
    const errMsg = 'Failed to book slot for the selected booking!';
    const status = 'ORDER_PLACED';

    // Create order

    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      data.status = status;
      order = await strapi.services.order.create(data, { files });
    } else {
      const orderBody = ctx.request.body;
      orderBody.status = status;
      order = await strapi.services.order.create(orderBody);
    }

    //Get scheduler info from server
    const entity = await strapi.services.scheduler.find();
    const headers = {
      'Authorization': 'Bearer ' + entity.token,
    };
    if(!order.contactMe){
      // send this slot to scheduler
      try {
        const res = await axios.put(entity.book_url + `${slot}/${entity.KEY}`, {available: false, booking: order.id, username: fullName, slot, company: entity.company});
        console.log(res.data);
        console.log('SEND EMAIL ACTION CALLED!');
        strapi.services.email.sendOrderEmail(order);
        return {status: 1, msg: 'Order placed successfully!', order};
      }catch (e) {
        console.log('Error occured while trying', e);
        return {status : 0, errMsg};
      }
    }else{
      strapi.services.email.sendOrderEmail(order);
      return {status : 1, msg: 'Order place successfully', order};
    }

  },

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

    const result = await strapi.query('order').delete({id_in: ids });
    return {status: 1, msg: 'Orders deleted successfully!', result};
  },

};
