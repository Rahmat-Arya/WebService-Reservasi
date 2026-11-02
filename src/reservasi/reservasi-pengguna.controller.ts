import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ReservasiService } from './reservasi.service';

@Controller('pengguna')
export class ReservasiPenggunaController {
  constructor(private readonly reservasiService: ReservasiService) {}

  @Get(':idPengguna/reservasi')
  findByUser(@Param('idPengguna', ParseIntPipe) idPengguna: number) {
    return {
      message: `Daftar reservasi pengguna ${idPengguna}`,
      data: this.reservasiService.findByUser(idPengguna),
    };
  }
}
