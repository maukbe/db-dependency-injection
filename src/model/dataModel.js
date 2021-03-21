function dataModel(db) {
  return {
    create: async function (data) {
      const time = new Date();
      if ((await db.countDocuments()) > 0) {
        console.log("Data exists - replacing");
        await db.findOneAndReplace(
          { createdDate: { $lt: time } },
          { ...data, createdDate: time }
        );
      } else {
        console.log("Adding new data");
        await db.insertOne({ ...data, createdDate: time });
      }
    },
    retrieve: async function () {
      return await db.findOne();
    },
  };
}

module.exports = dataModel;
