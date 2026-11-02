import { Module } from '@nestjs/common';
import { LapanganModule } from '../lapangan/lapangan.module';
import { KetersediaanController } from './ketersediaan.controller';
import { ReservasiPenggunaController } from './reservasi-pengguna.controller';
import { ReservasiController } from './reservasi.controller';
import { ReservasiService } from './reservasi.service';

@Module({
  imports: [LapanganModule],
  controllers: [ReservasiController, ReservasiPenggunaController, KetersediaanController],
  providers: [ReservasiService],
})
export class ReservasiModule {}
