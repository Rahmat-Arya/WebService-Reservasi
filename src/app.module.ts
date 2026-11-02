import { Module } from '@nestjs/common';
import { LapanganModule } from './lapangan/lapangan.module';
import { ReservasiModule } from './reservasi/reservasi.module';

@Module({
  imports: [LapanganModule, ReservasiModule],
})
export class AppModule {}
