import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
  } from '@nestjs/common';
  import { EquipmentItemService } from './equipment-item.service';
  import { CreateEquipmentItemDto } from './dto/create-equipment-item.dto';
  import { UpdateEquipmentItemDto } from './dto/update-equipment-item.dto';
  
  @Controller('equipment-items')
  export class EquipmentItemController {
    constructor(private readonly service: EquipmentItemService) {}
  
    // equipment-items
    @Post()
    create(@Body() dto: CreateEquipmentItemDto) {
      return this.service.create(dto);
    }
  
    // equipment-items
    @Get()
    findAll() {
      return this.service.findAll();
    }
  
    // equipment-items/:id
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.service.findOne(id);
    }
  
    // equipment-items/:id
    @Patch(':id')
    update(
      @Param('id') id: string,
      @Body() dto: UpdateEquipmentItemDto,
    ) {
      return this.service.update(id, dto);
    }
  
    // equipment-items/:id
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.service.remove(id);
    }
  }
  