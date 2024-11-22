const express = require("express");
const uploadOnCloud  = require("../cloudinary"); 
const upload =  require("../multer");
const Router = new express.Router();
const USER = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const authenticate = require("../middleware/authenticate");
const Product = require('../models/ProductsSchema');
const cors = require('cors');
const bodyParser = require('body-parser');
const Order = require('../models/OrderSchema');
const PaytmChecksum = require('paytmchecksum'); // Import from npm package

Router.use(bodyParser.urlencoded({ extended: true }));

// Paytm Credentials (replace with your production credentials)
const PAYTM_MERCHANT_ID = 'vhOByG25024022297954';
const PAYTM_MERCHANT_KEY = 'EKt359VLrafYkiT0';
const PAYTM_WEBSITE = 'WEBSTAGING'; // Replace with your production website name
const CALLBACK_URL = '/paytm-callback'; // Replace with your production callback URL

// Middleware to parse JSON data
Router.use(bodyParser.json());

// Use CORS middleware
Router.use(cors());

// register data
Router.post("/signup", async(req,res)=>{
    // console.log(req.body);

    const {name,email,mobile,password,cpassword} = req.body;

    if(!name || !email || !mobile || !password || !cpassword){
        res.status(422).json({error:"fill the all data"});
        
        console.log("not data available");
    };
    try{
        const preuser = await USER.findOne({email:email});

        if(preuser){
            res.status(422).json({error:"this user is already"})
        }else if(password !== cpassword){
            res.status(422).json({error:"password not match"})
        }else{
            const finalUser = new USER({
                name,email,mobile,password,cpassword
            });

            const storedata = await finalUser.save();
            console.log(storedata);

            res.status(201).json(storedata);
        }
    }catch(error){

    }
})

// signin data
Router.post("/signin", async (req, res) => {
    const { email, password } = req.body;

    // Validate email and password
    if (!email || !password) {
        console.error("Missing email or password");
        return res.status(400).json({ error: "Please fill in all details" });
    }

    try {
        const usersignin = await USER.findOne({ email });
        if (!usersignin) {
            console.error("User not found for email:", email);
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, usersignin.password);
        if (!isMatch) {
            console.error("Password mismatch for email:", email);
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Generate token
        const token = await usersignin.generateAuthtokenn();
        console.log("Token generated:", token);

        // Set cookie with token
        res.cookie('iSells', token, {
            httpOnly: true,   // Prevent client-side access to the cookie
            secure: true,     // Ensure cookies are only sent over HTTPS
            sameSite: 'None', // Necessary for cross-origin cookies
            path: '/',        // Ensure the cookie is available across the app
            expires: new Date(Date.now() + 30 * 60 * 1000), // Expire in 30 minutes
        });        

        console.log("Cookie set");
        res.status(200).json(usersignin);

    } catch (error) {
        console.error("Error during signin:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

Router.get("/logout", authenticate, async (req, res) => {
    try {
        // Remove the current token from the user's tokens array
        req.rootUser.tokens = req.rootUser.tokens.filter((curelem) => curelem.token !== req.token);

        // Clear the cookie that stores the token (ensure correct environment handling)
        res.clearCookie("iSells", {
            path: "/",
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',  // Use secure cookie only in production
            sameSite: "None",  // Allow cross-origin cookies
        });

        // Save the updated user data
        await req.rootUser.save();

        // Respond with a success message
        res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        console.error("Error during logout:", error);
        res.status(500).json({ error: "Logout failed" });
    }
});

// Route to get valid user information
Router.get("/validuser", authenticate, async (req, res) => {
    try {
        const validuserone = await USER.findById(req.userID).select("-password");
        if (!validuserone) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(validuserone);
    } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).json({ error: "Failed to fetch user information" });
    }
});

// PUT endpoint to update user data
Router.put('/updateuser', authenticate, async (req, res) => {
    try {
        const { name, email, mobile, password } = req.body;

        // Ensure at least one field to update is provided
        if (!name && !email && !mobile && !password) {
            return res.status(400).json({ message: 'At least one field is required for updating user data' });
        }

        // Create an update object dynamically
        const updateData = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (mobile) updateData.mobile = mobile;
        if (password) {
            // Hash the password before updating
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            updateData.password = hashedPassword;
        }

        // Find the user by ID and update the provided fields
        const updatedUser = await USER.findByIdAndUpdate(
            req.userID, // User ID to find the user
            updateData, // Updated user data
            { new: true } // Return updated user data
        );

        // Check if user exists
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(updatedUser); // Send updated user data as response
    } catch (error) {
        console.error('Error updating user data:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Update Address Route
Router.post('/updateAddress', authenticate, async (req, res) => {
    try {
        const { house, street, city, state, postalCode, country } = req.body;
        const updatedAddress = await req.rootUser.updateAddress({
            house, street, city, state, postalCode, country
        });
        res.status(200).json({ address: updatedAddress });
    } catch (error) {
        console.error('Error updating address:', error);
        res.status(500).json({ error: 'Failed to update address' });
    }
});

// Route to save card details
Router.post('/saveCard', authenticate, async (req, res) => {
    try {
      const { cardNumber, expiryDate, cvv } = req.body;
  
      // Validation - Ensure all required fields are present
      if (!cardNumber || !expiryDate || !cvv) {
        return res.status(400).json({ error: 'All fields are required' });
      }
  
      // Hash expiryDate and cvv
      const hashedExpiryDate = await bcrypt.hash(expiryDate, 10);
      const hashedCvv = await bcrypt.hash(cvv, 10);
  
      // Update card information in the database with hashed values
      req.rootUser.cardInfo = { cardNumber, expiryDate: hashedExpiryDate, cvv: hashedCvv };
      await req.rootUser.save();
  
      // Mask cardNumber to show only the last 4 digits
      const maskedCardNumber = 'xxxxxxxxxxxx' + cardNumber.substring(cardNumber.length - 4);
  
      // Return updated card information with masked cardNumber
      const responseCardInfo = { ...req.rootUser.cardInfo, cardNumber: maskedCardNumber };
      res.status(200).json({ message: 'Card information updated successfully', cardInfo: responseCardInfo });
    } catch (error) {
      console.error('Error updating cardInfo:', error);
      res.status(500).json({ error: 'Failed to update cardInfo. Please try again later.' });
    }
});

// Route to remove card details
Router.delete('/removeCard', authenticate, async (req, res) => {
    try {
      // Remove card information from the database
      req.rootUser.cardInfo = null;
      await req.rootUser.save();
  
      // Return success message
      res.status(200).json({ message: 'Card information removed successfully' });
    } catch (error) {
      console.error('Error removing card:', error);
      res.status(500).json({ error: 'Failed to remove card. Please try again later.' });
    }
});

// adding the data into cart
Router.post("/addcart/:_id", authenticate,async(req,res)=>{
    try {
        const {_id} = req.params;
        const { quantity } = req.body; // Get quantity from request body

        // Find the product by ID
        const product = await Product.findOne({_id: _id});
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Find the user by ID
        const user = await USER.findOne({_id: req.userID});
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update quantity of the product in user's cart
        const existingCartItemIndex = user.carts.findIndex(item => item._id === _id);
        if (existingCartItemIndex !== -1) {
            // If product already exists in cart, update its quantity
            user.carts[existingCartItemIndex].quantity += parseInt(quantity);
        } else {
            // If product doesn't exist in cart, add it with the specified quantity
            user.carts.push({ ...product.toObject(), quantity: parseInt(quantity) });
        }

        // Save the updated user
        await user.save();

        // Return the updated user object
        res.status(200).json(user);
    } catch (error) {
        console.error('Error adding product to cart:', error);
        res.status(500).json({ error: 'An error occurred while adding product to cart' });
    }
});

// Remove cart items
Router.delete('/remove/:_id', authenticate, async (req, res) => {
    try {
      const { _id } = req.params;
  
      if (!_id) {
        console.log('No item ID provided');
        return res.status(400).json({ error: 'Item ID is required' });
      }
  
      const user = await USER.findOne({ _id: req.userID });
      if (!user) {
        console.log('User not found');
        return res.status(404).json({ error: 'User not found' });
      }
  
      const originalCartLength = user.carts.length;
      user.carts = user.carts.filter((cartItem) => cartItem && cartItem._id && cartItem._id.toString() !== _id);
  
      if (originalCartLength === user.carts.length) {
        console.log('Item ID not found in user carts');
        return res.status(404).json({ error: 'Item not found in cart' });
      }
  
      await user.save();
      res.status(200).json(user);
      console.log('Item removed successfully');
    } catch (error) {
      console.log('Error removing item from cart:', error);
      res.status(500).json({ error: 'Failed to remove item from cart' });
    }
});

// Get cart details
Router.get('/cartdetails', authenticate, async (req, res) => {
    try {
      const buyuser = await USER.findOne({ _id: req.userID });
      if (!buyuser) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json(buyuser);
    } catch (error) {
      console.log('Error fetching cart details:', error);
      res.status(500).json({ error: 'Failed to fetch cart details' });
    }
});
  
// POST endpoint for adding product with images
Router.post("/addProduct", upload.fields([
    { name: 'images', maxCount: 4 }, // Assuming you're allowing up to 4 images
    { name: 'productSku', maxCount: 1 }, { name: 'description', maxCount: 1 }, { name: 'price', maxCount: 1 }, { name: 'brand', maxCount: 1 }, { name: 'category', maxCount: 1 }, 
    { name: 'dimensions', maxCount: 1 }, { name: 'quantity', maxCount: 1 }, { name: 'fulfillment', maxCount: 1 }, { name: 'procurementSLA', maxCount: 1 }, 
    { name: 'mrp', maxCount: 1 }, { name: 'shippingProvider', maxCount: 1 }, { name: 'localDeliveryCharge', maxCount: 1 }, { name: 'zonalDeliveryCharge', maxCount: 1 }, 
    { name: 'nationalDeliveryCharge', maxCount: 1 }, { name: 'countryOfOrigin', maxCount: 1 }, { name: 'manufacturerDetails', maxCount: 1 }, { name: 'hsnCode', maxCount: 1 }, 
    { name: 'taxCode', maxCount: 1 }, { name: 'packageWeight', maxCount: 1 }, { name: 'packageLength', maxCount: 1 }, { name: 'packageBreadth', maxCount: 1 }, 
    { name: 'packageHeight', maxCount: 1 }, { name: 'modelNumber', maxCount: 1 }, { name: 'modelName', maxCount: 1 }, { name: 'color', maxCount: 1 }, { name: 'productType', maxCount: 1 }, 
    { name: 'salesPackage', maxCount: 1 }, { name: 'powerSource', maxCount: 1 }, { name: 'batteryCapacity', maxCount: 1 }, { name: 'warranty', maxCount: 1 }, { name: 'notCoveredInWarranty', maxCount: 1 }, 
    { name: 'searchKeywords', maxCount: 1 }, { name: 'batteryType', maxCount: 1 }, { name: 'powerOutput', maxCount: 1 }, { name: 'powerInput', maxCount: 1 }, { name: 'boxContents', maxCount: 1 }, 
    { name: 'bluetooth', maxCount: 1 }, { name: 'bluetoothVersions', maxCount: 1 }, { name: 'ledLight', maxCount: 1 }, { name: 'buildMaterial', maxCount: 1 }

    ]), async (req, res) => {

    try {
        const images = req.files['images']; // Assuming 'images' is the field name for product images
        const { productSku, description, price, brand, category, dimensions, quantity, fulfillment, procurementSLA, mrp, shippingProvider, localDeliveryCharge, zonalDeliveryCharge, 
            nationalDeliveryCharge, countryOfOrigin, manufacturerDetails, hsnCode, taxCode, packageWeight, packageLength, packageBreadth, packageHeight, modelNumber, modelName, 
            color, productType, salesPackage, powerSource, batteryCapacity, warranty, notCoveredInWarranty, searchKeywords, batteryType, powerOutput, powerInput, boxContents, 
            bluetooth, bluetoothVersions, ledLight, buildMaterial 
        } = req.body;

        const uploadPromises = images.map(async image => {
            const avatarBuffer = image.buffer;
            const avatar = await uploadOnCloud(avatarBuffer); // Assuming this function uploads the image to the cloud
            if (!avatar || !avatar.url) {
                throw new Error("Error in Uploading File");
            }
            return avatar.url;
        });

        const uploadedImageUrls = await Promise.all(uploadPromises);

        const productData = {
            images: uploadedImageUrls,
            productSku, description, price, brand, category, dimensions, quantity, fulfillment, procurementSLA, mrp, shippingProvider, localDeliveryCharge, 
            zonalDeliveryCharge, nationalDeliveryCharge, countryOfOrigin, manufacturerDetails, hsnCode, taxCode, packageWeight, packageLength, packageBreadth, 
            packageHeight, modelNumber, modelName, color, productType, salesPackage, powerSource, batteryCapacity, warranty, notCoveredInWarranty, searchKeywords, 
            batteryType, powerOutput, powerInput, boxContents, bluetooth, bluetoothVersions, ledLight, buildMaterial
        };
        console.log(productData);

        const newProduct = new Product(productData);
        await newProduct.save();

        return res.status(200).json({ status: true, message: "Product added successfully" });
    } catch (error) {
        console.error("Error adding product:", error);
        return res.status(500).json({ status: false, message: "Internal Server Error" });
    }
});

// PUT route to update product price and quantity
Router.put('/update-product/:id', async (req, res) => {
    const { id } = req.params;
    const { price, quantity } = req.body;

    try {
        // Find the product by id
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Update price and/or quantity if provided in the request
        if (price !== undefined) {
            product.price = price;
        }
        if (quantity !== undefined) {
            product.quantity = quantity;
        }

        // Save the updated product
        await product.save();

        res.status(200).json({ message: 'Product updated successfully' });
    } catch (error) {
        console.error('Error updating product:', error.message);
        res.status(500).json({ error: 'An error occurred while updating product' });
    }
});

// products data (delete with your actual database logic)
Router.delete('/delete-products', async (req, res) => {
    const { selectedItems } = req.body;
  
    try {
      // Delete selected items from the database
      await Product.deleteMany({ _id: { $in: selectedItems } });
      res.status(200).json({ message: 'Products deleted successfully' });
    } catch (error) {
      console.error('Error deleting products:', error.message);
      res.status(500).json({ error: 'An error occurred while deleting products' });
    }
});

// Get all products
Router.get("/products", async (req, res) => {
    try {
        const products = await Product.find();
        res.json({ status: true, products });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ status: false, message: "Failed to fetch products", error: error.message });
    }
});

// Route to get a single product by ID
Router.get('/singleproduct/:_id', async (req, res) => {
    try {
        const { _id } = req.params;
        const product = await Product.findById(_id);
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        res.status(200).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Add review to product
Router.post('/addreview/:id', authenticate, async (req, res) => {
    console.log('Entering /addreview route');
    const { id } = req.params;
    const { stars, comment } = req.body;
    console.log('Request body:', req.body);
    console.log('Authenticated user:', req.rootUser);

    const userId = req.userID;

    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).send('Product not found');
        }

        const newReview = {
            stars,
            comment,
            user: userId
        };

        product.reviews.push(newReview);
        await product.save();

        res.status(201).json(product);
    } catch (error) {
        console.error('Error saving review:', error);
        res.status(500).send('Server error');
    }
});

// Endpoint to initiate Paytm payment
Router.post('/paytm-initiate', async (req, res) => {
    const { amount } = req.body;
  
    if (!amount || isNaN(amount)) {
      return res.status(400).json({ success: false, error: 'Invalid amount' });
    }
  
    const orderId = `ORDER_${Date.now()}`;
  
    const paytmParams = {
      MID: PAYTM_MERCHANT_ID,
      WEBSITE: PAYTM_WEBSITE,
      ORDERID: orderId,
      TXNAMOUNT: amount.toString(),
      CALLBACK_URL: CALLBACK_URL,
      INDUSTRY_TYPE_ID: 'Retail',
      CHANNEL_ID: 'WEB',
    };
  
    try {
      // Generate checksum
      const checksum = await PaytmChecksum.generateSignature(paytmParams, PAYTM_MERCHANT_KEY);
  
      res.json({
        success: true,
        orderId: orderId,
        txnToken: checksum,
        amount: paytmParams.TXNAMOUNT,
        MID: PAYTM_MERCHANT_ID,
      });
    } catch (error) {
      console.error('Error generating checksum:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
});
  
// Endpoint to handle Paytm callback
Router.post('/paytm-callback', async (req, res) => {
    const body = req.body;
  
    // Extract checksum from request body
    const paytmChecksum = body.CHECKSUMHASH;
    delete body.CHECKSUMHASH;
  
    // Verify checksum
    const isValidChecksum = PaytmChecksum.verifySignature(body, PAYTM_MERCHANT_KEY, paytmChecksum);
  
    if (isValidChecksum) {
      // Check if the payment is successful
      if (body.STATUS === 'TXN_SUCCESS') {
        // Payment successful logic here
        console.log('Payment successful');
        res.status(200).send('Payment successful');
      } else {
        // Payment failed logic here
        console.log('Payment failed');
        res.status(200).send('Payment failed');
      }
    } else {
      console.log('Checksum verification failed');
      res.status(400).send('Checksum verification failed');
    }
});

// Create a new order
Router.post('/order', authenticate, async (req, res) => {
    const { productId, quantity, price, shippingAddress, paymentMethod } = req.body;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const newOrder = new Order({
            userId: req.userID,
            productId,
            quantity,
            price,
            shippingAddress,
            paymentMethod
        });

        await newOrder.save();

        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get user's order history
Router.get('/orders', authenticate, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.userID }).populate('productId');
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Cancel an order
Router.put('/cancelOrder/:orderId', authenticate, async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        order.status = 'Cancelled';
        await order.save();
        return res.status(200).json(order);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to cancel order' });
    }
});
  
module.exports = Router;