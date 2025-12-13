import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { EquipmentRental, EquipmentRentalDocument } from './schemas/equipmentRental.schema';
import { CreateEquipmentRentalDto } from './dto/create-equipmentRental.dto';
import { Equipment, EquipmentDocument } from '../equipment/schemas/equipment.schema';

@Injectable()
export class EquipmentRentalService {
  constructor(
    @InjectModel(EquipmentRental.name)
    private rentalModel: Model<EquipmentRentalDocument>,

    @InjectModel(Equipment.name)
    private equipmentModel: Model<EquipmentDocument>,
  ) {}

  // ===============================
  // CREATE - THUÊ THIẾT BỊ
  // ===============================
  async create(dto: CreateEquipmentRentalDto) {
    const equipment = await this.equipmentModel.findById(dto.equipmentId);
  
    if (!equipment) {
      throw new NotFoundException('Equipment not found');
    }
  
    if (equipment.quantity < dto.quantity) {
      throw new BadRequestException('Not enough equipment available');
    }
  
    // Nếu client không gửi rentalDate -> đặt là now
    const rentalDate = dto.rentalDate ? new Date(dto.rentalDate) : new Date();
  
    // Tính totalPrice tự động (dùng pricePerHour từ equipment)
    const totalPrice = equipment.pricePerHour * dto.duration * dto.quantity;
  
    // Trừ số lượng thiết bị
    equipment.quantity -= dto.quantity;
    await equipment.save();
  
    const rental = new this.rentalModel({
      userId: dto.userId,
      equipmentId: dto.equipmentId,
      quantity: dto.quantity,
      rentalDate,
      duration: dto.duration,
      totalPrice,
      status: dto.status ?? 'renting',
      paymentId: dto.paymentId,
    });
  
    return rental.save();
  }  

  // ===============================
  // GET ALL
  // ===============================
  async findAll() {
    return this.rentalModel
      .find()
      .populate('userId', 'fullName email') // get fullname and email only
      .populate('equipmentId', 'name type pricePerHour');
  }

  // ===============================
  // GET ONE
  // ===============================
  async findOne(id: string) {
    const rental = await this.rentalModel
      .findById(id)
      .populate('userId', 'fullName email')
      .populate('equipmentId', 'name type pricePerHour');

    if (!rental) {
      throw new NotFoundException('Rental record not found');
    }

    return rental;
  }

  // ===============================
  // UPDATE
  // ===============================
  async updateStatus(id: string, status: string) {
    const rental = await this.rentalModel.findById(id);
  
    if (!rental) {
      throw new NotFoundException('Rental record not found');
    }
  
    // Không cho update nếu đã kết thúc trước đó
    if (['completed', 'cancelled'].includes(rental.status)) {
      throw new BadRequestException('Rental already finished');
    }
  
    // Chỉ cho update status hợp lệ
    if (!['renting', 'completed', 'cancelled'].includes(status)) {
      throw new BadRequestException('Invalid status');
    }
  
    // Nếu chuyển sang completed hoặc cancelled → trả thiết bị
    if (status === 'completed' || status === 'cancelled') {
      const equipment = await this.equipmentModel.findById(rental.equipmentId);
  
      if (!equipment) {
        throw new NotFoundException('Equipment not found');
      }
  
      equipment.quantity += rental.quantity;
      await equipment.save();
    }
  
    rental.status = status;
    return rental.save();
  }

  // ===============================
  // DELETE
  // ===============================
  async remove(id: string) {
    const rental = await this.rentalModel.findById(id);

    if (!rental) {
      throw new NotFoundException('Rental record not found');
    }

    // Hoàn trả số lượng thiết bị vào kho
    const equipment = await this.equipmentModel.findById(rental.equipmentId);

    if (equipment) {
      equipment.quantity += rental.quantity;
      await equipment.save();
    }

    return rental.deleteOne();
  }

  // Lấy danh sách thuê của spec user
  async findByUser(userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      return { error: 'Invalid userId' };
    }

    return this.rentalModel
      .find({ userId })
      .populate('equipmentId')
      .populate('paymentId')
      .exec();
  }
}
