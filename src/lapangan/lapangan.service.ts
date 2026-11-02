import { Injectable, NotFoundException } from '@nestjs/common';
import { Lapangan } from './lapangan.interface';

@Injectable()
export class LapanganService {
  private readonly daftarLapangan: Lapangan[] = [
    { id: 1, nama: 'Lapangan Futsal A', tipeLapangan: 'futsal', hargaPerJam: 150000, status: 'AKTIF' },
    { id: 2, nama: 'Lapangan Badminton 1', tipeLapangan: 'badminton', hargaPerJam: 80000, status: 'AKTIF' },
    { id: 3, nama: 'Lapangan Basket Outdoor', tipeLapangan: 'basket', hargaPerJam: 120000, status: 'PERBAIKAN' },
  ];

  findAll(): Lapangan[] {
    return this.daftarLapangan;
  }

  findOne(id: number): Lapangan {
    const lapangan = this.daftarLapangan.find((item) => item.id === id);

    if (!lapangan) {
      throw new NotFoundException('Lapangan tidak ditemukan');
    }

    return lapangan;
  }
}
