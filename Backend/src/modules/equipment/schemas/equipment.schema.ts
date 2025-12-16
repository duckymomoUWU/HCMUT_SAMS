import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EquipmentDocument = Equipment & Document;

@Schema({ timestamps: true })
export class Equipment {
  // NAME
  @Prop({ required: true, trim: true, index: true })
  name: string;

  // TYPE (vợt, bóng, ...)
  @Prop({ required: true, index: true })
  type: string;

  // TOTAL ITEM COUNT (CALCULATED)
  @Prop({ required: true, default: 0, min: 0 })
  quantity: number;

  // TRUE nếu có ít nhất 1 EquipmentItem.status === 'available'
  @Prop({ required: true, default: false })
  available: boolean;

  // PRICE PER HOUR
  @Prop({ required: true, min: 0 })
  pricePerHour: number;

  // IMAGE
  @Prop({ required: true })
  imageUrl: string;

  // DESCRIPTION
  @Prop({ required: true })
  description: string;
}

export const EquipmentSchema =
  SchemaFactory.createForClass(Equipment);
