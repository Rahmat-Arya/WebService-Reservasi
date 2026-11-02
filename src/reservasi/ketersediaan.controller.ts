import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ReservasiService } from './reservasi.service';

@Controller('lapangan')
export class KetersediaanController {
  constructor(private readonly reservasiService: ReservasiService) {}

  @Get(':id/ketersediaan')
  getAvailability(
    @Param('id', ParseIntPipe) id: number,
    @Query('tanggal') tanggal: string,
  ) {
    return {
      message: 'Ketersediaan lapangan',
      data: this.reservasiService.getAvailability(id, tanggal),
    };
  }
}
