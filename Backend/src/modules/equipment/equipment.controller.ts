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

  // ============================
  // CREATE 
  // POST /equipment
  // ============================
  @Post()
  create(@Body() createEquipmentDto: CreateEquipmentDto) {
    return this.equipmentService.create(createEquipmentDto);
  }

  // ============================
  // GET ALL 
  // GET /equipment
  // ============================
  @Get()
  findAll() {
    return this.equipmentService.findAll();
  }

  // ============================
  // GET ONE 
  // GET /equipment/:id
  // ============================
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.equipmentService.findOne(id);
  }

  // ============================
  // UPDATE 
  // PATCH /equipment/:id
  // ============================
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEquipmentDto: UpdateEquipmentDto) {
    return this.equipmentService.update(id, updateEquipmentDto);
  }

  // ============================
  // DELETE 
  // DELETE /equipment/:id
  // ============================
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.equipmentService.remove(id);
  }
}
