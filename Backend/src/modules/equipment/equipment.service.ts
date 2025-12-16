import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Equipment, EquipmentDocument } from './schemas/equipment.schema';
import {
  EquipmentItem,
  EquipmentItemDocument,
  EquipmentItemStatus,
} from '../equipment-item/schemas/equipment-item.schema';

@Injectable()
export class EquipmentService {
  constructor(
    @InjectModel(Equipment.name)
    private readonly equipmentModel: Model<EquipmentDocument>,

    @InjectModel(EquipmentItem.name)
    private readonly itemModel: Model<EquipmentItemDocument>,
  ) {}

  // ============================
  // CREATE
  // ============================
  async create(dto: any): Promise<Equipment> {
    return this.equipmentModel.create({
      ...dto,
      quantity: 0,
      available: false,
    });
  }

  // ============================
  // FIND ALL
  // ============================
  async findAll(): Promise<Equipment[]> {
    return this.equipmentModel.find().exec();
  }

  // ============================
  // FIND ONE
  // ============================
  async findOne(id: string): Promise<Equipment> {
    const equipment = await this.equipmentModel.findById(id).exec();

    if (!equipment) {
      throw new NotFoundException(
        `Equipment ${id} not found`,
      );
    }

    return equipment;
  }

  // ============================
  // UPDATE
  // ============================
  async update(
    id: string,
    dto: any,
  ): Promise<Equipment> {
    const updated = await this.equipmentModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();

    if (!updated) {
      throw new NotFoundException(
        `Equipment ${id} not found`,
      );
    }

    return updated;
  }

  // ============================
  // DELETE
  // ============================
  async remove(id: string) {
    const deleted =
      await this.equipmentModel.findByIdAndDelete(id);

    if (!deleted) {
      throw new NotFoundException(
        `Equipment ${id} not found`,
      );
    }

    return { message: 'Deleted successfully' };
  }

  // ============================
  // 🔥 RECALC FROM ITEMS
  // ============================
  async recalcFromItems(equipmentId: Types.ObjectId) {
    const total = await this.itemModel.countDocuments({
      equipment: equipmentId,
    });

    const hasAvailable = await this.itemModel.exists({
      equipment: equipmentId,
      status: EquipmentItemStatus.AVAILABLE,
    });

    await this.equipmentModel.findByIdAndUpdate(
      equipmentId,
      {
        quantity: total,
        available: !!hasAvailable,
      },
    );
  }

  // NEW: GET EQUIPMENT + ITEMS GROUPED BY STATUS
  async findWithItems(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid equipment id');
    }
  
    const equipment = await this.equipmentModel.findById(id).lean();
    if (!equipment) {
      throw new NotFoundException('Equipment not found');
    }
  
    const items = await this.itemModel
      .find({ equipment: id })
      .select('_id code status')
      .lean();
  
    const groupedItems: Record<EquipmentItemStatus, any[]> = {
      [EquipmentItemStatus.AVAILABLE]: [],
      [EquipmentItemStatus.RENTED]: [],
      [EquipmentItemStatus.MAINTENANCE]: [],
      [EquipmentItemStatus.BROKEN]: [],
    };
  
    items.forEach((item) => {
      if (groupedItems[item.status]) {
        groupedItems[item.status].push(item);
      }
    });
  
    return {
      ...equipment,
      items: groupedItems,
    };
  }
  
}
