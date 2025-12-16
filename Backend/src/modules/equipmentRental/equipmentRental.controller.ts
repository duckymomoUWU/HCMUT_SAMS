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
  import { EquipmentRentalService } from './equipmentRental.service';
  import { CreateEquipmentRentalDto } from './dto/create-equipmentRental.dto';
  
  @Controller('equipment-rental')
  export class EquipmentRentalController {
    constructor(private readonly equipmentRentalService: EquipmentRentalService) {}
  
    // ===================================
    // CREATE
    // POST /equipment-rental
    // ===================================
    @Post()
    create(@Body() createDto: CreateEquipmentRentalDto) {
      return this.equipmentRentalService.create(createDto);
    }
  
    // ===================================
    // GET ALL or GET BY USER
    // GET /equipment-rental or GET /equipment-rental?userId=xxx
    // ===================================
    @Get()
    async findAllOrByUser(@Query('userId') userId?: string) {
      if (userId) {
        return this.equipmentRentalService.findByUser(userId);
      }
      return this.equipmentRentalService.findAll();
    }
  
    // ===================================
    // GET ONE 
    // GET /equipment-rental/:id
    // ===================================
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.equipmentRentalService.findOne(id);
    }
  
    // ===================================
    // UPDATE - Cập nhật giao dịch
    // PATCH /equipment-rental/status/:id
    // ===================================
    @Patch('status/:id')
    updateStatus(
      @Param('id') id: string,
      @Body() dto: { status: string },
    ) {
      return this.equipmentRentalService.updateStatus(id, dto.status);
    }
  
    // ===================================
    // DELETE
    // DELETE /equipment-rental/:id
    // ===================================
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.equipmentRentalService.remove(id);
    }
  }
  