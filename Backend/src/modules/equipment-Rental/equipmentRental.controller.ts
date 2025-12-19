import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';

import { EquipmentRentalService } from './equipmentRental.service';
import { CreateEquipmentRentalDto } from './dto/create-equipmentRental.dto';
import { UpdateEquipmentRentalDto } from './dto/update-equipmentRental.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('equipment-rental')
@UseGuards(JwtAuthGuard)
export class EquipmentRentalController {
  constructor(private readonly service: EquipmentRentalService) {}

  // equipment-rental
  @Post()
  async create(@Body() dto: CreateEquipmentRentalDto, @Req() req) {
    // Nếu frontend không gửi userId, lấy từ request
    if (!dto.userId) {
      dto.userId = req.user?.id || req.user?.userId;
    }
    const rental = await this.service.create(dto);
    return { rental };
  }

  // equipment-rental
  @Get()
  findAll(@Query('userId') userId?: string) {
    if (userId) return this.service.findByUser(userId);
    return this.service.findAll();
  }
  @Get('my-rentals')
  getMyRentals(@Req() req) {
    console.log('🔵 GET /equipment-rental/my-rentals - userId:', req.user?.id);
    return this.service.findByUser(req.user.userId || req.user.id);
  }
  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  getAllRentals() {
    return this.service.findAll();
  }
  // equipment-rental/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  // equipment-rental/status/:id
  @Patch('status/:id')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateEquipmentRentalDto) {
    return this.service.updateStatus(id, dto.status);
  }
}
