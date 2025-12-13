import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EquipmentDocument = Equipment & Document;

// EQUIPMENT STATUS
export enum EquipmentStatus {
  WORKING = 'working',          
  MAINTENANCE = 'maintenance',  
  BROKEN = 'broken',           
}

@Schema({ timestamps: true })
export class Equipment {
  // NAME
  @Prop({ required: true, trim: true, index: true })
  name: string;

  // TYPE (vợt, bóng, ...)
  @Prop({ required: true, index: true })
  type: string; 

  // QUANTITY
  @Prop({ required: true, min: 0 })
  quantity: number; 

  // AVAILABLE
  @Prop({ default: true })
  available: boolean;
  
  // PRICE PER HOUR
  @Prop({ required: true, min: 0 })
  pricePerHour: number; 

  // STATUS
  @Prop({
    required: true,
    enum: Object.values(EquipmentStatus),
    default: EquipmentStatus.WORKING,
  })
  status: EquipmentStatus;

  // IMAGE
  @Prop({ required: true })
  imageUrl: string;

  // DESCRIPTION
  @Prop({ required: true })
  description: string;
}

export const EquipmentSchema = SchemaFactory.createForClass(Equipment);

// AVAILABLE IF QUANTITY > 0 AND STATUS WORKING
EquipmentSchema.pre('save', function (next) {
  this.available = this.quantity > 0 && this.status === EquipmentStatus.WORKING;
  next();
});
