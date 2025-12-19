import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking, BookingDocument } from '../booking/schemas/booking.schema';
import { EquipmentRental, EquipmentRentalDocument } from '../equipment-Rental/schemas/equipment-rental.schema';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    @InjectModel(EquipmentRental.name) private rentalModel: Model<EquipmentRentalDocument>,
  ) {}

  create(createAdminDto: CreateAdminDto) {
    return 'This action adds a new admin';
  }

  findAll() {
    return `This action returns all admin`;
  }

  findOne(id: number) {
    return `This action returns a #${id} admin`;
  }

  update(id: number, updateAdminDto: UpdateAdminDto) {
    return `This action updates a #${id} admin`;
  }

  remove(id: number) {
    return `This action removes a #${id} admin`;
  }

  async getBookingStats() {
    // Bookings stats
    const totalBookings = await this.bookingModel.countDocuments().exec();
    const confirmedBookings = await this.bookingModel.countDocuments({
      status: 'confirmed',
    }).exec();
    const pendingBookings = await this.bookingModel.countDocuments({
      status: 'pending',
    }).exec();
    const bookingRevenue = await this.bookingModel.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$price' } } },
    ]).exec();

    // Rentals stats
    const totalRentals = await this.rentalModel.countDocuments().exec();
    const activeRentals = await this.rentalModel.countDocuments({
      status: 'renting',
    }).exec();
    const rentalRevenue = await this.rentalModel.aggregate([
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]).exec();

    // Unified stats
    const totalOrders = totalBookings + totalRentals;
    const confirmedOrders = confirmedBookings + activeRentals; // confirmed bookings + active rentals
    const pendingOrders = pendingBookings; // only bookings have pending status
    const totalRevenue = (bookingRevenue[0]?.total || 0) + (rentalRevenue[0]?.total || 0);

    return {
      totalBookings: totalOrders,
      confirmedBookings: confirmedOrders,
      pendingBookings: pendingOrders,
      totalRevenue,
    };
  }

  async getAllBookings() {
    return this.bookingModel.find()
      .populate('userId', 'fullName email')
      .sort({ createdAt: -1 })
      .exec();
  }

  async getAllRentals() {
    return this.rentalModel.find()
      .populate('userId', 'fullName email')
      .sort({ createdAt: -1 })
      .exec();
  }
}
