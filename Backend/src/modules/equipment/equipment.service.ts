import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Equipment, EquipmentDocument } from './schemas/equipment.schema';
import {
  EquipmentItem,
  EquipmentItemDocument,
  EquipmentItemStatus,
} from '../equipment-item/schemas/equipment-item.schema';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';

// ✅ Define type cho sync result
export interface SyncResult {
  message: string;
  equipment: string;
  itemCount?: number;
  currentItems?: number;
  targetQuantity?: number;
  newItems?: string[];
}

@Injectable()
export class EquipmentService {
  constructor(
    @InjectModel(Equipment.name)
    private equipmentModel: Model<EquipmentDocument>,

    @InjectModel(EquipmentItem.name)
    private itemModel: Model<EquipmentItemDocument>,
  ) {}

  // ===============================
  // CREATE - Tự động tạo items
  // ===============================
  async create(dto: CreateEquipmentDto) {
    // 1. Tạo Equipment
    const equipment = await this.equipmentModel.create({
      name: dto.name,
      type: dto.type,
      quantity: dto.initialQuantity || 0,
      available: (dto.initialQuantity || 0) > 0,
      pricePerHour: dto.pricePerHour,
      imageUrl: dto.imageUrl,
      description: dto.description,
    });

    console.log('✅ Equipment created:', equipment._id);

    // 2. Tự động tạo N items nếu có initialQuantity
    const quantity = dto.initialQuantity || 0;
    if (quantity > 0) {
      await this.createItemsForEquipment(
        equipment._id as Types.ObjectId,
        equipment.name,
        quantity,
      );
    }

    return equipment;
  }

  // ===============================
  // HELPER - Tạo items cho equipment
  // ===============================
  private async createItemsForEquipment(
    equipmentId: Types.ObjectId,
    equipmentName: string,
    count: number,
    startNum: number = 1,
  ): Promise<string[]> {
    const prefix = equipmentName
      .substring(0, 3)
      .toUpperCase()
      .replace(/\s/g, '');

    const items: Array<{
      equipment: Types.ObjectId;
      serialNumber: string;
      status: EquipmentItemStatus;
    }> = [];

    for (let i = 0; i < count; i++) {
      items.push({
        equipment: equipmentId,
        serialNumber: `${prefix}-${String(startNum + i).padStart(3, '0')}`,
        status: EquipmentItemStatus.AVAILABLE,
      });
    }

    await this.itemModel.insertMany(items);
    console.log(`✅ Created ${count} items for: ${equipmentName}`);

    return items.map((i) => i.serialNumber);
  }

  // ===============================
  // HELPER - Tìm số serial tiếp theo
  // ===============================
  private async getNextSerialNumber(equipmentId: string): Promise<number> {
    const lastItem = await this.itemModel
      .findOne({ equipment: equipmentId })
      .sort({ serialNumber: -1 });

    if (!lastItem?.serialNumber) return 1;

    const match = lastItem.serialNumber.match(/(\d+)$/);
    return match ? parseInt(match[1]) + 1 : 1;
  }

  // ===============================
  // READ
  // ===============================
  async findAll() {
    return this.equipmentModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string) {
    const equipment = await this.equipmentModel.findById(id);
    if (!equipment) {
      throw new NotFoundException('Equipment not found');
    }
    return equipment;
  }

  async findWithItems(id: string) {
    const equipmentObjectId = new Types.ObjectId(id);
  
    const equipment = await this.equipmentModel.findById(equipmentObjectId);
    if (!equipment) {
      throw new NotFoundException('Equipment not found');
    }
  
    const items = await this.itemModel
      .find({ equipment: equipmentObjectId })
      .exec();
  
    return {
      ...equipment.toObject(),
      items,
    };
  }

  // ===============================
  // UPDATE
  // ===============================
  async update(id: string, dto: UpdateEquipmentDto) {
    const equipment = await this.equipmentModel.findByIdAndUpdate(
      id,
      {
        name: dto.name,
        type: dto.type,
        pricePerHour: dto.pricePerHour,
        imageUrl: dto.imageUrl,
        description: dto.description,
      },
      { new: true },
    );

    if (!equipment) {
      throw new NotFoundException('Equipment not found');
    }

    return equipment;
  }

  // ===============================
  // DELETE
  // ===============================
  async remove(id: string) {
    // Xóa tất cả items trước
    await this.itemModel.deleteMany({ equipment: id });

    const equipment = await this.equipmentModel.findByIdAndDelete(id);
    if (!equipment) {
      throw new NotFoundException('Equipment not found');
    }

    console.log(`✅ Deleted equipment and all items:`, equipment.name);
    return equipment;
  }

  // ===============================
  // ADD ITEMS - Thêm N items mới
  // ===============================
  async addItems(equipmentId: string, count: number) {
    const equipment = await this.equipmentModel.findById(equipmentId);
    if (!equipment) {
      throw new NotFoundException('Equipment not found');
    }

    const startNum = await this.getNextSerialNumber(equipmentId);

    await this.createItemsForEquipment(
      new Types.ObjectId(equipmentId),
      equipment.name,
      count,
      startNum,
    );

    // Recalc quantity
    await this.recalcFromItems(new Types.ObjectId(equipmentId));

    return this.findWithItems(equipmentId);
  }

  // ===============================
  // RECALC - Tính lại quantity từ items
  // ===============================
  async recalcFromItems(equipmentId: Types.ObjectId) {
    const totalCount = await this.itemModel.countDocuments({
      equipment: equipmentId,
    });

    const availableCount = await this.itemModel.countDocuments({
      equipment: equipmentId,
      status: EquipmentItemStatus.AVAILABLE,
    });

    await this.equipmentModel.findByIdAndUpdate(equipmentId, {
      quantity: totalCount,
      available: availableCount > 0,
    });

    console.log(
      `✅ Recalc ${equipmentId}: total=${totalCount}, available=${availableCount}`,
    );
  }

  // ===============================
  // SYNC ITEMS - Tạo items theo quantity trong database
  // ===============================
  async syncItems(equipmentId: string): Promise<SyncResult> {
    const equipment = await this.equipmentModel.findById(equipmentId);
    if (!equipment) {
      throw new NotFoundException('Equipment not found');
    }

    // Đếm items hiện có
    const currentItemCount = await this.itemModel.countDocuments({
      equipment: equipmentId,
    });

    const targetQuantity = equipment.quantity;
    const diff = targetQuantity - currentItemCount;

    console.log(`🔵 Sync items for ${equipment.name}:`);
    console.log(`   Current items: ${currentItemCount}`);
    console.log(`   Target quantity: ${targetQuantity}`);
    console.log(`   Diff: ${diff}`);

    // Đã sync rồi
    if (diff === 0) {
      console.log('✅ Already synced!');
      return {
        message: 'Already synced',
        equipment: equipment.name,
        itemCount: currentItemCount,
      };
    }

    // Cần tạo thêm items
    if (diff > 0) {
      const startNum = await this.getNextSerialNumber(equipmentId);

      const newItems = await this.createItemsForEquipment(
        new Types.ObjectId(equipmentId),
        equipment.name,
        diff,
        startNum,
      );

      return {
        message: `Created ${diff} new items`,
        equipment: equipment.name,
        itemCount: targetQuantity,
        newItems,
      };
    }

    // diff < 0: Có nhiều items hơn quantity - chỉ cảnh báo
    console.log(`⚠️ Warning: ${Math.abs(diff)} extra items exist`);
    return {
      message: `Warning: ${Math.abs(diff)} extra items exist. Manual cleanup needed.`,
      equipment: equipment.name,
      currentItems: currentItemCount,
      targetQuantity: targetQuantity,
    };
  }

  // ===============================
  // SYNC ALL - Sync tất cả equipment
  // ===============================
  async syncAllItems(): Promise<SyncResult[]> {
    const equipments = await this.equipmentModel.find();
    const results: SyncResult[] = [];

    for (const eq of equipments) {
      const result = await this.syncItems(
        (eq._id as Types.ObjectId).toString(),
      );
      results.push(result);
    }

    return results;
  }
}