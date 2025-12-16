import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Equipment, EquipmentDocument } from './schemas/equipment.schema';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';

@Injectable()
export class EquipmentService {
  constructor(
    @InjectModel(Equipment.name)
    private readonly equipmentModel: Model<EquipmentDocument>,
  ) {}

  // ============================
  // CREATE
  // ============================
  async create(createDto: CreateEquipmentDto): Promise<Equipment> {
    const equipment = new this.equipmentModel(createDto);
    return equipment.save();
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
      throw new NotFoundException(`Equipment with ID ${id} not found`);
    }

    return equipment;
  }

  // ============================
  // UPDATE
  // ============================
  async update(id: string, updateDto: UpdateEquipmentDto): Promise<Equipment> {
    const updated = await this.equipmentModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();

    if (!updated) {
      throw new NotFoundException(`Equipment with ID ${id} not found`);
    }

    return updated;
  }

  // ============================
  // DELETE
  // ============================
  async remove(id: string): Promise<{ message: string }> {
    const deleted = await this.equipmentModel.findByIdAndDelete(id).exec();

    if (!deleted) {
      throw new NotFoundException(`Equipment with ID ${id} not found`);
    }

    return { message: 'Equipment deleted successfully' };
  }
}
