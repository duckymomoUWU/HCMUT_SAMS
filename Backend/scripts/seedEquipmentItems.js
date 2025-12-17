//! file này để tạo chục cái item trong equipment item để test cho sướng tay
const mongoose = require('mongoose');

// Define schemas (adjust according to your actual models)
const equipmentSchema = new mongoose.Schema({
  name: String,
  type: String,
  quantity: Number,
  available: Boolean,
  pricePerHour: Number,
  imageUrl: String,
  description: String,
  status: String
}, { timestamps: true });

const equipmentItemSchema = new mongoose.Schema({
  equipment: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment' },
  status: { type: String, enum: ['available', 'rented', 'maintenance'], default: 'available' },
  serialNumber: String
}, { timestamps: true });

const Equipment = mongoose.model('Equipment', equipmentSchema);
const EquipmentItem = mongoose.model('EquipmentItem', equipmentItemSchema);

// Configuration
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://testez90123456789_db_user:19012005@cluster0.ux7hwna.mongodb.net/hcmut_sams?retryWrites=true&w=majority&ssl=true';
const ITEMS_PER_EQUIPMENT = 20; // Number of items to create for each equipment

async function seedItems() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Get all equipment
    const allEquipment = await Equipment.find();
    console.log(`📦 Found ${allEquipment.length} equipment types`);

    const itemsToInsert = [];

    for (const equipment of allEquipment) {
      // Get existing items count for this equipment
      const existingCount = await EquipmentItem.countDocuments({ 
        equipment: equipment._id 
      });
      
      console.log(`\n🔧 ${equipment.name}:`);
      console.log(`   Existing items: ${existingCount}`);
      
      // Generate serial number prefix based on equipment name
      const prefix = equipment.name
        .toUpperCase()
        .replace(/[^A-Z]/g, '')
        .slice(0, 6) || 'ITEM';

      // Create new items
      for (let i = 1; i <= ITEMS_PER_EQUIPMENT; i++) {
        const serialNumber = `${prefix}-${String(existingCount + i).padStart(3, '0')}`;
        
        itemsToInsert.push({
          equipment: equipment._id,
          status: 'available',
          serialNumber: serialNumber
        });
      }

      console.log(`   ➕ Will add ${ITEMS_PER_EQUIPMENT} new items`);
    }

    // Bulk insert all items
    console.log(`\n🚀 Inserting ${itemsToInsert.length} items...`);
    const result = await EquipmentItem.insertMany(itemsToInsert);
    console.log(`✅ Successfully inserted ${result.length} items`);

    // Update equipment quantities
    console.log('\n📊 Updating equipment quantities...');
    for (const equipment of allEquipment) {
      const totalItems = await EquipmentItem.countDocuments({ 
        equipment: equipment._id 
      });
      const availableItems = await EquipmentItem.countDocuments({ 
        equipment: equipment._id,
        status: 'available'
      });

      await Equipment.findByIdAndUpdate(equipment._id, {
        quantity: totalItems,
        available: availableItems > 0
      });

      console.log(`   ✓ ${equipment.name}: ${totalItems} total, ${availableItems} available`);
    }

    console.log('\n✨ Seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

// Run the script
seedItems();