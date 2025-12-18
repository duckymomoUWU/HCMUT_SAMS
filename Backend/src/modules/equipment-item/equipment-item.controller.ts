import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
  } from '@nestjs/common';
  import { EquipmentItemService } from './equipment-item.service';
  import { CreateEquipmentItemDto } from './dto/create-equipment-item.dto';
  import { UpdateEquipmentItemDto } from './dto/update-equipment-item.dto';
import { EquipmentItemStatus } from './schemas/equipment-item.schema';
  
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

    // equipment-items/grouped?status=available
    @Get('grouped')
    getAllGrouped(
      @Query('status') status?: EquipmentItemStatus,
    ) {
      return this.service.getAllGrouped(status);
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
  