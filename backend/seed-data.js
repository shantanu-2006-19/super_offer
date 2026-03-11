import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const shopSchema = new mongoose.Schema({
  owner: mongoose.Schema.Types.ObjectId,
  name: String,
  description: String,
  category: String,
  phone: String,
  address: String,
  status: String,
  isActive: Boolean,
  location: Object
});

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  phone: String,
  isActive: Boolean
});

const offerSchema = new mongoose.Schema({
  shop: mongoose.Schema.Types.ObjectId,
  title: String,
  description: String,
  discountPercentage: Number,
  originalPrice: Number,
  offerPrice: Number,
  expiryDate: Date,
  images: [String],
  isActive: Boolean,
  isApproved: Boolean,
  location: Object,
  views: Number
});

const Shop = mongoose.model('Shop', shopSchema);
const User = mongoose.model('User', userSchema);
const Offer = mongoose.model('Offer', offerSchema);

const seedData = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/super_offer';
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    // Create or find shop owner user
    let shopOwner = await User.findOne({ email: 'sandip@vit.edu' });
    
    if (shopOwner) {
      console.log('Shop owner user already exists');
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('123456', salt);
      
      shopOwner = await User.create({
        name: 'Sandip',
        email: 'sandip@vit.edu',
        password: hashedPassword,
        role: 'shop_owner',
        phone: '9876543210',
        isActive: true
      });
      console.log('Created shop owner user: sandip@vit.edu');
    }

    // Create approved shop for the user
    let shop = await Shop.findOne({ owner: shopOwner._id });
    
    if (shop) {
      console.log('Shop already exists:', shop.name);
      if (shop.status !== 'approved') {
        shop.status = 'approved';
        shop.isActive = true;
        await shop.save();
        console.log('Shop status updated to approved');
      }
    } else {
      shop = await Shop.create({
        owner: shopOwner._id,
        name: 'Sandip Food Corner',
        description: 'Best food deals in town',
        category: 'Restaurant',
        phone: '9876543210',
        address: 'Pune, Maharashtra',
        status: 'approved',
        isActive: true,
        location: {
          type: 'Point',
          coordinates: [73.8567, 18.5204]
        }
      });
      console.log('Created shop:', shop.name);
    }

    // Delete existing offers for this shop
    await Offer.deleteMany({ shop: shop._id });
    console.log('Deleted existing offers');

    // Create 20 dummy offers
    const offerTemplates = [
      { title: '50% Off Lunch Combo', discount: 50, originalPrice: 500 },
      { title: 'Buy 1 Get 1 Free', discount: 50, originalPrice: 300 },
      { title: '25% Off on All Items', discount: 25, originalPrice: 400 },
      { title: 'Free Dessert with Main Course', discount: 15, originalPrice: 250 },
      { title: '30% Off Dinner Special', discount: 30, originalPrice: 600 },
      { title: '40% Off Weekend Deals', discount: 40, originalPrice: 450 },
      { title: '20% Off First Order', discount: 20, originalPrice: 350 },
      { title: '15% Off for Students', discount: 15, originalPrice: 200 },
      { title: 'Family Pack Special', discount: 35, originalPrice: 800 },
      { title: 'Happy Hour - 45% Off', discount: 45, originalPrice: 400 },
      { title: 'Combo Meal Deal', discount: 30, originalPrice: 350 },
      { title: 'Sunday Brunch Offer', discount: 25, originalPrice: 550 },
      { title: 'Late Night Food Discount', discount: 35, originalPrice: 300 },
      { title: 'Festival Special Offer', discount: 40, originalPrice: 500 },
      { title: 'Quick Bite Deal', discount: 20, originalPrice: 150 },
      { title: 'Premium Dining Experience', discount: 30, originalPrice: 1000 },
      { title: 'Weekday Special', discount: 25, originalPrice: 350 },
      { title: 'Group Ordering Discount', discount: 35, originalPrice: 700 },
      { title: 'Online Order Exclusive', discount: 30, originalPrice: 400 },
      { title: 'New Year Special', discount: 50, originalPrice: 600 }
    ];

    const offers = [];
    const now = new Date();
    
    for (let i = 0; i < offerTemplates.length; i++) {
      const template = offerTemplates[i];
      const offerPrice = template.originalPrice * (1 - template.discount / 100);
      
      const expiryDate = new Date(now);
      expiryDate.setDate(expiryDate.getDate() + 30 + Math.floor(Math.random() * 60));

      offers.push({
        shop: shop._id,
        title: template.title,
        description: `Special offer: ${template.discount}% off on all items. Valid for a limited time only!`,
        discountPercentage: template.discount,
        originalPrice: template.originalPrice,
        offerPrice: offerPrice.toFixed(2),
        expiryDate: expiryDate,
        images: [],
        isActive: true,
        isApproved: true,
        location: shop.location,
        views: Math.floor(Math.random() * 100)
      });
    }

    await Offer.insertMany(offers);
    console.log('Created ' + offers.length + ' dummy offers');

    console.log('\n=== Summary ===');
    console.log('Shop Owner Email: sandip@vit.edu');
    console.log('Shop Owner Password: 123456');
    console.log('Shop Name:', shop.name);
    console.log('Shop Status:', shop.status);
    console.log('Offers Created:', offers.length);

    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

seedData();
</parameter>
</create_file>
