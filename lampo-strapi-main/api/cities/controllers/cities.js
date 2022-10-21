const formatError = error => [
    { messages: [{ id: error.id, message: error.message, field: error.field }] },
];

module.exports = {
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

        const result = await strapi.query('cities').delete({id_in: ids });
        return {status: 1, msg: 'Cities delete successfully!', result};
    },
};
