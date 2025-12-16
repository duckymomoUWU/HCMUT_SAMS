import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from '../auth/schemas/user.schema';
import { EquipmentRental, EquipmentRentalSchema } from '../equipmentRental/schemas/equipmentRental.schema';

@Module ( {
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: EquipmentRental.name, schema: EquipmentRentalSchema }
        ])
    ],
    controllers: [UsersController],
    providers: [UsersService],
})
export class UsersModule {}