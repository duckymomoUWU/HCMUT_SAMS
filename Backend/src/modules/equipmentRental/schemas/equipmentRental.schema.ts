import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EquipmentRentalDocument = EquipmentRental & Document;

@Schema({ timestamps: true })
export class EquipmentRental {
  // USER ID
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  // EQUIPMENT ID
  @Prop({ type: Types.ObjectId, ref: 'Equipment', required: true })
  equipmentId: Types.ObjectId;

  // QUANTITY
  @Prop({ required: true, min: 1 })
  quantity: number;

  // RENTAL DATE
  @Prop({ required: true })
  rentalDate: Date;

  // DURATION
  @Prop({ required: true, min: 1 })
  duration: number;

  // TOTAL PRICE
  @Prop({ required: true, min: 0 })
  totalPrice: number;

  // STATUS
  @Prop({
    type: String,
    enum: ['renting', 'cancelled', 'completed'],
    default: 'renting',
  })
  status: string;

  // Tạm thời bỏ ref Payment để không lỗi
  @Prop({ type: Types.ObjectId })
  paymentId?: Types.ObjectId;
}

export const EquipmentRentalSchema =
  SchemaFactory.createForClass(EquipmentRental);
