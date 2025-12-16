import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EquipmentRentalDocument = EquipmentRental & Document;

export enum EquipmentRentalStatus {
  RENTING = 'renting',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Schema({ timestamps: true })
export class EquipmentRental {
  // USER
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  // EQUIPMENT (AGGREGATE)
  @Prop({ type: Types.ObjectId, ref: 'Equipment', required: true })
  equipmentId: Types.ObjectId;

  // ITEM THỰC TẾ ĐƯỢC THUÊ
  @Prop({
    type: [{ type: Types.ObjectId, ref: 'EquipmentItem' }],
    required: true,
  })
  items: Types.ObjectId[];

  // RENTAL DATE
  @Prop({ required: true })
  rentalDate: Date;

  // HOURS
  @Prop({ required: true, min: 1 })
  duration: number;

  // TOTAL PRICE (CALCULATED)
  @Prop({ required: true, min: 0 })
  totalPrice: number;

  // STATUS
  @Prop({
    enum: Object.values(EquipmentRentalStatus),
    default: EquipmentRentalStatus.RENTING,
  })
  status: EquipmentRentalStatus;

  // PAYMENT (OPTIONAL)
  @Prop({ type: Types.ObjectId })
  paymentId?: Types.ObjectId;
}

export const EquipmentRentalSchema =
  SchemaFactory.createForClass(EquipmentRental);
