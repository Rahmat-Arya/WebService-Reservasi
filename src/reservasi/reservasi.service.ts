import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LapanganService } from '../lapangan/lapangan.service';
import { DataReservasiBaru, Reservasi } from './reservasi.interface';

const JAM_BUKA = '08:00';
const JAM_TUTUP = '22:00';

@Injectable()
export class ReservasiService {
  private readonly daftarReservasi: Reservasi[] = [];
  private idBerikutnya = 1;

  constructor(private readonly lapanganService: LapanganService) {}

 
  private tanggalValid(tanggal: string): boolean {
    if (typeof tanggal !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(tanggal)) {
      return false;
    }
    const hasil = new Date(`${tanggal}T00:00:00Z`);
    return !isNaN(hasil.getTime()) && hasil.toISOString().slice(0, 10) === tanggal;
  }

  
  private jamValid(jam: string): boolean {
    return typeof jam === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(jam);
  }

  create(data: DataReservasiBaru): Reservasi {
    const { idPengguna, idLapangan, tanggal, jamMulai, jamSelesai, namaPelanggan } =
      data ?? ({} as DataReservasiBaru);

  
    const inputValid =
      Number.isInteger(idPengguna) &&
      Number.isInteger(idLapangan) &&
      this.tanggalValid(tanggal) &&
      this.jamValid(jamMulai) &&
      this.jamValid(jamSelesai) &&
      typeof namaPelanggan === 'string' &&
      namaPelanggan.trim() !== '';

    if (!inputValid) {
      throw new BadRequestException('Data tidak valid');
    }

   
    const lapangan = this.lapanganService.findOne(idLapangan);
    if (lapangan.status !== 'AKTIF') {
      throw new BadRequestException('Lapangan sedang tidak dapat dipesan');
    }

    
    if (jamMulai >= jamSelesai) {
      throw new BadRequestException('jamMulai harus lebih awal dari jamSelesai');
    }
    if (jamMulai < JAM_BUKA || jamSelesai > JAM_TUTUP) {
      throw new BadRequestException(`Jam operasional ${JAM_BUKA} - ${JAM_TUTUP}`);
    }

    
    const bentrok = this.daftarReservasi.find(
      (item) =>
        item.idLapangan === idLapangan &&
        item.tanggal === tanggal &&
        item.status !== 'DIBATALKAN' &&
        jamMulai < item.jamSelesai &&
        jamSelesai > item.jamMulai,
    );
    if (bentrok) {
      throw new ConflictException({
        statusCode: 409,
        error: 'Conflict',
        message: 'Jadwal bentrok dengan reservasi lain',
        bentrokDengan: {
          id: bentrok.id,
          jamMulai: bentrok.jamMulai,
          jamSelesai: bentrok.jamSelesai,
        },
      });
    }

    
    const reservasiBaru: Reservasi = {
      id: this.idBerikutnya++,
      idPengguna,
      idLapangan,
      tanggal,
      jamMulai,
      jamSelesai,
      namaPelanggan: namaPelanggan.trim(),
      status: 'DIPESAN',
    };
    this.daftarReservasi.push(reservasiBaru);
    return reservasiBaru;
  }

  findOne(id: number): Reservasi {
    const reservasi = this.daftarReservasi.find((item) => item.id === id);

    if (!reservasi) {
      throw new NotFoundException('Reservasi tidak ditemukan');
    }

    return reservasi;
  }

  findByUser(idPengguna: number): Reservasi[] {
    return this.daftarReservasi.filter((item) => item.idPengguna === idPengguna);
  }

  cancel(id: number): Reservasi {
    const reservasi = this.findOne(id);

    if (reservasi.status === 'DIBATALKAN') {
      throw new ConflictException('Reservasi sudah dibatalkan sebelumnya');
    }
    if (reservasi.status === 'SELESAI') {
      throw new ConflictException('Reservasi yang sudah selesai tidak dapat dibatalkan');
    }

    reservasi.status = 'DIBATALKAN';
    return reservasi;
  }

  getAvailability(idLapangan: number, tanggal: string) {
    const lapangan = this.lapanganService.findOne(idLapangan);

    if (!this.tanggalValid(tanggal)) {
      throw new BadRequestException('Data tidak valid');
    }

    const slotTerpakai = this.daftarReservasi
      .filter(
        (item) =>
          item.idLapangan === idLapangan &&
          item.tanggal === tanggal &&
          item.status !== 'DIBATALKAN',
      )
      .sort((a, b) => (a.jamMulai < b.jamMulai ? -1 : 1));

    
    const slotTersedia: { jamMulai: string; jamSelesai: string }[] = [];
    if (lapangan.status === 'AKTIF') {
      let posisi = JAM_BUKA;
      for (const item of slotTerpakai) {
        if (item.jamMulai > posisi) {
          slotTersedia.push({ jamMulai: posisi, jamSelesai: item.jamMulai });
        }
        if (item.jamSelesai > posisi) posisi = item.jamSelesai;
      }
      if (posisi < JAM_TUTUP) {
        slotTersedia.push({ jamMulai: posisi, jamSelesai: JAM_TUTUP });
      }
    }

    return {
      idLapangan: lapangan.id,
      namaLapangan: lapangan.nama,
      statusLapangan: lapangan.status,
      tanggal,
      jamBuka: JAM_BUKA,
      jamTutup: JAM_TUTUP,
      slotTerpakai: slotTerpakai.map((item) => ({
        idReservasi: item.id,
        jamMulai: item.jamMulai,
        jamSelesai: item.jamSelesai,
      })),
      slotTersedia,
    };
  }
}
