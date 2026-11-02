export interface Lapangan {
  id: number;
  nama: string;
  tipeLapangan: string;
  hargaPerJam: number;
  status: 'AKTIF' | 'PERBAIKAN';
}
