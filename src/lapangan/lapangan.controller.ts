import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { LapanganService } from './lapangan.service';

@Controller('lapangan')
export class LapanganController {
  constructor(private readonly lapanganService: LapanganService) {}

  @Get()
  findAll() {
    return {
      message: 'Daftar lapangan',
      data: this.lapanganService.findAll(),
    };
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return {
      message: 'Detail lapangan',
      data: this.lapanganService.findOne(id),
    };
  }
}
