import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Equipment } from '../../equipment/schemas/equipment.schema';

export type EquipmentItemDocument = EquipmentItem & Document;

export enum EquipmentItemStatus {
    AVAILABLE = 'available',
    RENTED = 'rented',
    MAINTENANCE = 'maintenance',
    BROKEN = 'broken',
}

@Schema({ timestamps: true })
export class EquipmentItem {
    // EQUIPMENT
    @Prop({
        type: Types.ObjectId,
        ref: Equipment.name,
        required: true,
        index: true,
    })
    equipment: Types.ObjectId;

    // STATUS
    @Prop({
        required: true,
        enum: Object.values(EquipmentItemStatus),
        default: EquipmentItemStatus.AVAILABLE,
    })
    status: EquipmentItemStatus;

    // SERIAL NUMBER
    @Prop()
    serialNumber?: string;

    // NOTE
    @Prop()
    note?: string;
}

export const EquipmentItemSchema =
  SchemaFactory.createForClass(EquipmentItem);
