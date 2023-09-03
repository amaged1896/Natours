const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.deleteOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) return next(new AppError('There are no document with that id', 404));
    return res.status(204).json({ status: "success", data: null });
});

exports.updateOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body,
        { new: true, runValidators: true });
    if (!doc) return next(new AppError('There are no document with that id', 404));
    return res.status(200).json({ status: "success", data: { data: doc } });
});

exports.createOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    if (!doc) return next(new AppError('error creating document', 404));
    return res.status(201).json({ status: "success", data: { data: doc } });
});

exports.getOne = (Model, populateOptions) => catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populateOptions) query = query.populate(populateOptions);
    const doc = await query;

    if (!doc) return next(new AppError('There are no document with that id', 404));
    return res.status(200).json({ status: "success", data: { data: doc } });
});

exports.getAll = (Model, populateOptions) => catchAsync(async (req, res, next) => {
    // to allow for nested get reviews on tour (hack)
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    // EXECUTE QUERY
    const features = new APIFeatures(Model.find(filter), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const doc = await features.query;
    if (!doc) return next(new AppError('There are no document', 404));
    return res.status(200).json({ status: "success", results: doc.length, data: { data: doc } });
});