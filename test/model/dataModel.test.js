const DataModel = require("../../src/model/dataModel");

describe("provides a model for the data", () => {
  let dataModel;
  let db = {};
  const mockedDate = new Date("2019-05-14T11:01:58.135Z");

  const data = {
    a: "b",
    b: "c",
  };

  beforeEach(() => {
    jest.resetAllMocks();
    db = {
      insertOne: jest.fn(() => Promise.resolve()),
      findOne: jest.fn(() => Promise.resolve()),
      countDocuments: jest.fn(() => Promise.resolve(0)),
      findOneAndReplace: jest.fn(() => Promise.resolve()),
    };

    jest.spyOn(global, "Date").mockImplementationOnce(() => mockedDate);

    dataModel = DataModel(db);
  });

  test("it adds the data to the databse", async () => {
    await dataModel.create(data);

    expect(db.insertOne).toHaveBeenCalledWith({
      ...data,
      createdDate: mockedDate,
    });
  });

  test("it retrieves data from a database", async () => {
    db.findOne.mockImplementation(() => Promise.resolve(data));
    const retrievedMapping = await dataModel.retrieve();

    expect(db.findOne).toHaveBeenCalled();
    expect(retrievedMapping).toEqual(data);
  });

  test("if data exists it replaces it", async () => {
    db.countDocuments.mockReturnValue(1);

    await dataModel.create(data);

    expect(db.countDocuments).toHaveBeenCalled();
    expect(db.findOneAndReplace).toHaveBeenCalledWith(
      { createdDate: { $lt: mockedDate } },
      { ...data, createdDate: mockedDate }
    );
  });
});
