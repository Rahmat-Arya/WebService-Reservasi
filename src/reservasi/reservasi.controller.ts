import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { DataReservasiBaru } from './reservasi.interface';
import { ReservasiService } from './reservasi.service';

@Controller('reservasi')
export class ReservasiController {
  constructor(private readonly reservasiService: ReservasiService) {}

  @Post()
  create(@Body() body: DataReservasiBaru) {
    return {
      message: 'Reservasi berhasil dibuat',
      data: this.reservasiService.create(body),
    };
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return {
      message: 'Detail reservasi',
      data: this.reservasiService.findOne(id),
    };
  }

  @Patch(':id/batal')
  cancel(@Param('id', ParseIntPipe) id: number) {
    return {
      message: 'Reservasi berhasil dibatalkan',
      data: this.reservasiService.cancel(id),
    };
  }
}
