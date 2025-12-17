import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

import { EquipmentService } from './equipment.service';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';

@Controller('equipment')
export class EquipmentController {
  constructor(private readonly equipmentService: EquipmentService) {}

  // equipment
  @Post()
  create(@Body() dto: CreateEquipmentDto) {
    return this.equipmentService.create(dto);
  }

  // equipment
  @Get()
  findAll() {
    return this.equipmentService.findAll();
  }

  // equipment/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.equipmentService.findOne(id);
  }

  // equipment/:id
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateEquipmentDto) {
    return this.equipmentService.update(id, dto);
  }

  // equipment/:id
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.equipmentService.remove(id);
  }

  // equipment/with-items/:id
  @Get('with-items/:id')
  findWithItems(@Param('id') id: string) {
    return this.equipmentService.findWithItems(id);
  }
  // ✅ THÊM: Thêm items vào equipment
  @Post(':id/add-items')
  addItems(@Param('id') id: string, @Body('count') count: number) {
    return this.equipmentService.addItems(id, count);
  }

  // ✅ THÊM: Sync items theo quantity trong database
  @Post(':id/sync-items')
  syncItems(@Param('id') id: string) {
    return this.equipmentService.syncItems(id);
  }
}
