module.exports = {
  handler: async (request, h) => {
    delete request.session;
    return h.response().code(200);
  }
};
