import {
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  import { InjectModel } from '@nestjs/mongoose';
  import { Model, Types } from 'mongoose';
  
  import {
    EquipmentItem,
    EquipmentItemDocument,
    EquipmentItemStatus,
  } from './schemas/equipment-item.schema';
  import { CreateEquipmentItemDto } from './dto/create-equipment-item.dto';
  import { UpdateEquipmentItemDto } from './dto/update-equipment-item.dto';
  import { Equipment, EquipmentDocument } from '../equipment/schemas/equipment.schema';
  
  @Injectable()
  export class EquipmentItemService {
    constructor(
      @InjectModel(EquipmentItem.name)
      private readonly itemModel: Model<EquipmentItemDocument>,
  
      @InjectModel(Equipment.name)
      private readonly equipmentModel: Model<EquipmentDocument>,
    ) {}
  
    // ============================
    // CREATE ITEM → quantity++
    // ============================
    async create(dto: CreateEquipmentItemDto): Promise<EquipmentItem> {
      const equipment = await this.equipmentModel.findById(dto.equipmentId);
      if (!equipment) {
        throw new NotFoundException('Equipment not found');
      }
  
      const item = await this.itemModel.create({
        equipment: new Types.ObjectId(dto.equipmentId),
        status: dto.status,
        serialNumber: dto.serialNumber,
        note: dto.note,
      });
  
      await this.equipmentModel.findByIdAndUpdate(
        dto.equipmentId,
        { $inc: { quantity: 1 } },
      );
  
      return item;
    }
  
    // ============================
    // FIND ALL
    // ============================
    async findAll(): Promise<EquipmentItem[]> {
      return this.itemModel.find().populate('equipment').exec();
    }
  
    // ============================
    // FIND ONE
    // ============================
    async findOne(id: string): Promise<EquipmentItem> {
      const item = await this.itemModel
        .findById(id)
        .populate('equipment')
        .exec();
  
      if (!item) {
        throw new NotFoundException(`EquipmentItem ${id} not found`);
      }
  
      return item;
    }
  
    // ============================
    // UPDATE (KHÔNG ĐỤNG quantity)
    // ============================
    async update(
      id: string,
      dto: UpdateEquipmentItemDto,
    ): Promise<EquipmentItem> {
      const updated = await this.itemModel
        .findByIdAndUpdate(id, dto, { new: true })
        .exec();
  
      if (!updated) {
        throw new NotFoundException(`EquipmentItem ${id} not found`);
      }
  
      return updated;
    }
  
    // ============================
    // DELETE ITEM → quantity--
    // ============================
    async remove(id: string): Promise<{ message: string }> {
      const item = await this.itemModel.findByIdAndDelete(id);
  
      if (!item) {
        throw new NotFoundException(`EquipmentItem ${id} not found`);
      }
  
      await this.equipmentModel.findByIdAndUpdate(
        item.equipment,
        { $inc: { quantity: -1 } },
      );
  
      return { message: 'EquipmentItem deleted successfully' };
    }

    //////////
    async getAllGrouped(status?: EquipmentItemStatus) {
      const matchStage: any = {};
      if (status) {
        matchStage.status = status;
      }
    
      return this.itemModel.aggregate([
        { $match: matchStage },
    
        {
          $lookup: {
            from: 'equipment',
            localField: 'equipment',
            foreignField: '_id',
            as: 'equipment',
          },
        },
        { $unwind: '$equipment' },
    
        {
          $group: {
            _id: '$equipment._id',
            equipment: { $first: '$equipment' },
            items: {
              $push: {
                _id: '$_id',
                serialNumber: '$serialNumber',
                status: '$status',
              },
            },
            total: { $sum: 1 },
          },
        },
    
        {
          $project: {
            _id: 0,
            equipment: {
              _id: '$equipment._id',
              name: '$equipment.name',
              type: '$equipment.type',
              quantity: '$equipment.quantity',
              pricePerHour: '$equipment.pricePerHour',
              imageUrl: '$equipment.imageUrl',
              description: '$equipment.description',
            },
            items: 1,
            total: 1,
          },
        },
      ]);
    }
  }
  