import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
  EquipmentRental,
  EquipmentRentalDocument,
  EquipmentRentalStatus,
} from './schemas/equipment-rental.schema';

import {
  Equipment,
  EquipmentDocument,
} from '../equipment/schemas/equipment.schema';
import {
  EquipmentItem,
  EquipmentItemDocument,
  EquipmentItemStatus,
} from '../equipment-item/schemas/equipment-item.schema';

import { EquipmentService } from '../equipment/equipment.service';
import { CreateEquipmentRentalDto } from './dto/create-equipmentRental.dto';

@Injectable()
export class EquipmentRentalService {
  constructor(
    @InjectModel(EquipmentRental.name)
    private rentalModel: Model<EquipmentRentalDocument>,

    @InjectModel(EquipmentItem.name)
    private itemModel: Model<EquipmentItemDocument>,

    @InjectModel(Equipment.name)
    private equipmentModel: Model<EquipmentDocument>,

    private readonly equipmentService: EquipmentService,
  ) {}

  // ===============================
  // CREATE - THUÊ
  // ===============================
  async create(dto: CreateEquipmentRentalDto) {
    const equipment = await this.equipmentModel.findById(dto.equipmentId);
    if (!equipment) {
      throw new NotFoundException('Equipment not found');
    }

    // LẤY ITEM AVAILABLE
    const items = await this.itemModel
      .find({
        equipment: dto.equipmentId,
        status: EquipmentItemStatus.AVAILABLE,
      })
      .limit(dto.quantity);

    if (items.length < dto.quantity) {
      throw new BadRequestException('Not enough equipment items available');
    }

    // LOCK ITEM
    const itemIds = items.map((i) => i._id);
    await this.itemModel.updateMany(
      { _id: { $in: itemIds } },
      { status: EquipmentItemStatus.RENTED },
    );

    const rentalDate = dto.rentalDate ? new Date(dto.rentalDate) : new Date();

    const totalPrice = equipment.pricePerHour * dto.duration * itemIds.length;

    const rental = await this.rentalModel.create({
      userId: dto.userId,
      equipmentId: dto.equipmentId,
      items: itemIds,
      rentalDate,
      duration: dto.duration,
      totalPrice,
      status: EquipmentRentalStatus.RENTING,
      paymentId: dto.paymentId,
    });

    // RECALC EQUIPMENT
    await this.equipmentService.recalcFromItems(
      equipment._id as Types.ObjectId,
    );

    return rental;
  }

  // ===============================
  // UPDATE STATUS
  // ===============================
  async updateStatus(id: string, status: EquipmentRentalStatus) {
    const rental = await this.rentalModel.findById(id);
    if (!rental) {
      throw new NotFoundException('Rental not found');
    }

    if (
      rental.status === EquipmentRentalStatus.COMPLETED ||
      rental.status === EquipmentRentalStatus.CANCELLED
    ) {
      throw new BadRequestException('Rental already finished');
    }

    if (
      status === EquipmentRentalStatus.COMPLETED ||
      status === EquipmentRentalStatus.CANCELLED
    ) {
      // TRẢ ITEM
      await this.itemModel.updateMany(
        { _id: { $in: rental.items } },
        { status: EquipmentItemStatus.AVAILABLE },
      );

      await this.equipmentService.recalcFromItems(
        rental.equipmentId as Types.ObjectId,
      );
    }

    rental.status = status;
    return rental.save();
  }

  // ===============================
  // QUERY
  // ===============================
  findAll() {
    return this.rentalModel
      .find()
      .populate('userId', 'fullName email')
      .populate('equipmentId', 'name type pricePerHour')
      .populate('items', 'serialNumber status')
      .sort({ createdAt: -1 })
      .exec();
  }

  findOne(id: string) {
    return this.rentalModel
      .findById(id)
      .populate('userId', 'fullName email')
      .populate('equipmentId')
      .populate('items', 'serialNumber status')
      .exec();
  }

  async findByUser(userId: string) {
    console.log('🔵 Finding rentals for user:', userId);

    const rentals = await this.rentalModel
      .find({ userId })
      .populate('equipmentId', 'name type pricePerHour imageUrl description') // ← Chỉ lấy fields cần thiết
      .populate('items', 'serialNumber status') // ← Chỉ lấy fields cần thiết
      .populate('userId', 'fullName email') // ← Thêm user info
      .sort({ createdAt: -1 }) // ← Mới nhất lên đầu
      .exec();

    console.log('✅ Found rentals:', rentals.length);

    // Log để debug
    if (rentals.length > 0) {
      console.log('📦 First rental:', {
        id: rentals[0]._id,
        equipmentId: rentals[0].equipmentId,
        equipmentIdType: typeof rentals[0].equipmentId,
        status: rentals[0].status,
        items: rentals[0].items?.length || 0,
      });
    }

    return rentals;
  }
}
