const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  stars: { type: Number, required: true },
  comment: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

const productSchema = new mongoose.Schema({
    images: Array,
    productSku: String,
    description: String,
    price: Number,
    brand: String,
    category: String,
    dimensions: String,
    quantity: Number,
    fulfillment: String,
    procurementSLA: Number,
    mrp: Number,
    shippingProvider: String,
    localDeliveryCharge: Number,
    zonalDeliveryCharge: Number,
    nationalDeliveryCharge: Number,
    countryOfOrigin: String,
    manufacturerDetails: String,
    hsnCode: Number,
    taxCode: Number,
    packageWeight: Number,
    packageLength: Number,
    packageBreadth: Number,
    packageHeight: Number,
    modelNumber: String,
    modelName: String,
    color: String,
    productType: String,
    salesPackage: String,
    powerSource: String,
    batteryCapacity: String,
    warranty: String,
    notCoveredInWarranty: String,
    searchKeywords: String,
    batteryType: String,
    powerOutput: String,
    powerInput: String,
    boxContents: String,
    bluetooth: String,
    bluetoothVersions: String,
    ledLight: String,
    buildMaterial: String,
    reviews: [reviewSchema]
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
