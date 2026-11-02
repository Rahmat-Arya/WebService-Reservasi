export type StatusReservasi = 'DIPESAN' | 'DIBATALKAN' | 'SELESAI';

export interface Reservasi {
  id: number;
  idPengguna: number;
  idLapangan: number;
  tanggal: string;
  jamMulai: string;
  jamSelesai: string;
  namaPelanggan: string;
  status: StatusReservasi;
}

export interface DataReservasiBaru {
  idPengguna: number;
  idLapangan: number;
  tanggal: string;
  jamMulai: string;
  jamSelesai: string;
  namaPelanggan: string;
}
