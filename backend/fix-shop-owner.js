import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const shopSchema = new mongoose.Schema({
  owner: mongoose.Schema.Types.ObjectId,
  name: String,
  status: String,
  isActive: Boolean
});

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: String,
  isActive: Boolean
});

const Shop = mongoose.model('Shop', shopSchema);
const User = mongoose.model('User', userSchema);

const fixShopOwners = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/super_offer';
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    // Find all approved shops
    const shops = await Shop.find({ status: 'approved' });
    console.log(`Found ${shops.length} approved shops`);

    for (const shop of shops) {
      console.log(`\nProcessing shop: ${shop.name} (${shop._id})`);
      console.log(`  Owner ID: ${shop.owner}`);

      // Find the user and update their role to shop_owner
      const user = await User.findById(shop.owner);
      if (user) {
        console.log(`  Found user: ${user.name} (${user.email})`);
        console.log(`  Current role: ${user.role}`);
        
        if (user.role !== 'shop_owner' && user.role !== 'admin') {
          user.role = 'shop_owner';
          await user.save();
          console.log(`  ✓ Updated user role to: shop_owner`);
        } else {
          console.log(`  ✓ User role already correct`);
        }
      } else {
        console.log(`  ✗ User not found for this shop!`);
      }
    }

    // Also check for users with shop_owner role but no shop
    const shopOwners = await User.find({ role: 'shop_owner' });
    console.log(`\nFound ${shopOwners.length} users with shop_owner role`);

    for (const user of shopOwners) {
      const userShop = await Shop.findOne({ owner: user._id });
      if (userShop) {
        console.log(`  ✓ User ${user.email} has shop: ${userShop.name} (status: ${userShop.status})`);
      } else {
        console.log(`  ⚠ User ${user.email} has shop_owner role but no shop!`);
      }
    }

    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

fixShopOwners();
</parameter>
</create_file>
