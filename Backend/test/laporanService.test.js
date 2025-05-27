// C:\panji\coding\Kel9_PPL1_JurnalBumil\Backend\test\laporanService.test.js

// 1. Mock firebaseClient
const mockGetFirestore = jest.fn();
const mockAddFirestore = jest.fn();
const mockLimitFirestore = jest.fn(() => ({ get: mockGetFirestore }));
const mockDocFirestore = jest.fn(() => ({ get: mockGetFirestore }));

// Buat mock untuk 'where' yang bisa di-chain (dirangkai)
const mockWhereChain = {
    get: mockGetFirestore,
    where: jest.fn(() => mockWhereChain),
    limit: mockLimitFirestore,
};
const mockWhereFirestore = jest.fn(() => mockWhereChain);

// Mock utama untuk 'collection'
const mockCollectionFirestore = jest.fn(() => ({
    where: mockWhereFirestore,
    add: mockAddFirestore,
    doc: mockDocFirestore,
}));

// Aplikasikan mock ke '../firebaseClient'
jest.mock('../firebaseClient', () => ({
    __esModule: true,
    db: {
        collection: mockCollectionFirestore,
    },
}));

// 2. Import service yang akan diuji (SETELAH mock didefinisikan)
const { LaporanService } = require('../services/laporanService'); // Sesuaikan path jika perlu

describe('LaporanService', () => {
    let laporanService;

    beforeEach(() => {
        laporanService = new LaporanService();
        jest.clearAllMocks();
        // Reset mock 'where' agar rantainya bersih di setiap tes
        mockWhereFirestore.mockClear();
        mockWhereChain.where.mockClear();
        mockLimitFirestore.mockClear(); // Pastikan limit juga di-clear jika perlu
        mockDocFirestore.mockClear();
        mockCollectionFirestore.mockClear();
        mockGetFirestore.mockReset(); // Reset mockGetFirestore untuk menghindari state antar tes
        mockAddFirestore.mockReset();
    });

    // --- Tes untuk getLaporanByIbuAndTanggal ---
    describe('getLaporanByIbuAndTanggal', () => {
        const idIbu = "ibuTest123";
        const tanggal = "2025-06-15";

        const mockLaporanData = {
            id_ibu: idIbu,
            tanggal: tanggal,
            berat_badan: 60,
            hiv: "true", // String "true"
            sifilis: false, // Boolean false
            tes_hepatitis: true, // Boolean true
        };
        const mockLaporanDoc = { id: "laporanId1", data: () => mockLaporanData };

        const mockIbuData = {
            nama_ibu: "Ibu Sejati",
            usia_kehamilan: 20, // Usia awal
            tanggal_registrasi: {
                toDate: () => new Date('2025-03-01T00:00:00Z') // 1 Maret 2025
            }
        };
        const mockIbuDoc = { exists: true, data: () => mockIbuData };

        it('should return laporan with ibu info, calculated pregnancy age, and correct boolean conversions', async () => {
            mockGetFirestore
                .mockResolvedValueOnce({ docs: [mockLaporanDoc], empty: false }) // Laporan found
                .mockResolvedValueOnce(mockIbuDoc); // Ibu found

            const result = await laporanService.getLaporanByIbuAndTanggal(idIbu, tanggal);

            expect(mockCollectionFirestore).toHaveBeenCalledWith('kondisi_janin');
            expect(mockWhereFirestore).toHaveBeenCalledWith('id_ibu', '==', idIbu);
            expect(mockWhereChain.where).toHaveBeenCalledWith('tanggal', '==', tanggal);
            expect(mockLimitFirestore).toHaveBeenCalledWith(1);

            expect(mockCollectionFirestore).toHaveBeenCalledWith('Ibu');
            expect(mockDocFirestore).toHaveBeenCalledWith(idIbu);
            expect(mockGetFirestore).toHaveBeenCalledTimes(2);

            // Perhitungan Usia Kehamilan:
            // Tgl Registrasi: 1 Maret 2025 (usia awal 20 minggu)
            // Tgl Laporan: 15 Juni 2025
            // Selisih hari: (Maret 30 + April 30 + Mei 31 + Juni 15) - 1 = 105 hari (approx, actual calculation in service)
            // Selisih hari dari 1 Maret ke 15 Juni adalah 106 hari.
            // Minggu tambahan: floor(106 / 7) = 15 minggu
            // Usia kehamilan saat laporan: 20 + 15 = 35 minggu
            expect(result.nama_ibu).toBe("Ibu Sejati");
            expect(result.usia_kehamilan).toBe(35);
            expect(result.berat_badan).toBe(60);
            expect(result.hiv).toBe(true); // Dikonversi dari string "true"
            expect(result.sifilis).toBe(false); // Tetap boolean false
            expect(result.tes_hepatitis).toBe(true); // Tetap boolean true
        });

        it('should return null if no laporan found for the date', async () => {
            mockGetFirestore.mockResolvedValueOnce({ docs: [], empty: true }); // Laporan not found

            const result = await laporanService.getLaporanByIbuAndTanggal(idIbu, tanggal);
            expect(result).toBeNull();
            expect(mockGetFirestore).toHaveBeenCalledTimes(1);
            expect(mockDocFirestore).not.toHaveBeenCalled(); // Tidak panggil get Ibu jika laporan tidak ada
        });

        it('should throw error if laporan found but ibu data not found', async () => {
            mockGetFirestore
                .mockResolvedValueOnce({ docs: [mockLaporanDoc], empty: false }) // Laporan found
                .mockResolvedValueOnce({ exists: false }); // Ibu not found

            await expect(laporanService.getLaporanByIbuAndTanggal(idIbu, tanggal))
                .rejects.toThrow('Gagal mengambil data laporan: Data ibu tidak ditemukan');
        });

        it('should throw error if Firestore fails during get laporan', async () => {
            const firestoreError = new Error("Firestore down");
            mockGetFirestore.mockRejectedValueOnce(firestoreError);

            await expect(laporanService.getLaporanByIbuAndTanggal(idIbu, tanggal))
                .rejects.toThrow('Gagal mengambil data laporan: Firestore down');
        });
    });

    // --- Tes untuk addNewLapkun ---
    describe('addNewLapkun', () => {
        it('should add a new laporan kunjungan and return its ID', async () => {
            const laporanInfo = {
                date: "2025-06-20",
                berat_badan: 62,
                denyut_nadi_janin: 140,
                golongan_darah: "A",
                gula_darah: 90,
                hasil_skrining: "Normal",
                hiv: false,
                imunisasi_tetanus: true,
                lingkar_lengan: 25,
                posisi_janin: "Kepala",
                sifilis: "false",
                tablet_tambah_darah: true,
                tekanan_darah: "120/80",
                tes_hemoglobin: 12.5,
                tes_hepatitis: false,
                tinggi_badan: 160,
                tinggi_rahim: 28,
                id_ibu: "ibuAktif456",
                id_bidan: "bidanJaga789",
            };
            mockAddFirestore.mockResolvedValueOnce({ id: "lapkunBaruId123" });

            const result = await laporanService.addNewLapkun(laporanInfo);

            expect(mockCollectionFirestore).toHaveBeenCalledWith('kondisi_janin');
            const expectedPayload = { ...laporanInfo, tanggal: laporanInfo.date };
            delete expectedPayload.date; // Hapus 'date' karena sudah diganti 'tanggal'
            expect(mockAddFirestore).toHaveBeenCalledWith(expectedPayload);
            expect(result).toBe("lapkunBaruId123");
        });
    });

    // --- Tes untuk getAllLapkunByIdIbu ---
    describe('getAllLapkunByIdIbu', () => {
        it('should return all laporan kunjungan for a given id_ibu', async () => {
            const id_ibu = "ibuCariLaporan";
            const mockDocs = [
                { id: "lap1", data: () => ({ tanggal: "2025-01-10", berat_badan: 50 }) },
                { id: "lap2", data: () => ({ tanggal: "2025-02-15", berat_badan: 52 }) },
            ];
            mockGetFirestore.mockResolvedValueOnce({ docs: mockDocs, empty: false });

            const result = await laporanService.getAllLapkunByIdIbu(id_ibu);

            expect(mockCollectionFirestore).toHaveBeenCalledWith('kondisi_janin');
            expect(mockWhereFirestore).toHaveBeenCalledWith("id_ibu", "==", id_ibu);
            expect(mockGetFirestore).toHaveBeenCalledTimes(1);
            expect(result).toHaveLength(2);
            expect(result[0]).toEqual({ id: "lap1", tanggal: "2025-01-10", berat_badan: 50 });
        });

        it('should return an empty array if no laporan found', async () => {
            const id_ibu = "ibuTanpaLaporan";
            mockGetFirestore.mockResolvedValueOnce({ docs: [], empty: true });

            const result = await laporanService.getAllLapkunByIdIbu(id_ibu);
            expect(result).toEqual([]);
        });
    });

    // --- Tes untuk getLapkunByIdIbu ---
    describe('getLapkunByIdIbu', () => {
        const idIbuUntukLaporan = "ibuDenganBanyakLaporan";
        const mockLaporanDoc1 = {
            id: "laporanA",
            data: () => ({ id_ibu: idIbuUntukLaporan, tanggal: "2025-04-01", hasil_skrining: "Aman" })
        };
        const mockLaporanDoc2 = {
            id: "laporanB",
            data: () => ({ id_ibu: idIbuUntukLaporan, tanggal: "2025-05-01", hasil_skrining: "Perlu Cek Ulang" })
        };
        const mockIbuDataForLaporan = {
            nama_ibu: "Ibu Laporan Lengkap",
            usia_kehamilan: 15, // Usia awal
            tanggal_registrasi: {
                toDate: () => new Date('2025-02-01T00:00:00Z') // 1 Februari 2025
            }
        };
        const mockIbuDocForLaporan = { id: idIbuUntukLaporan, data: () => mockIbuDataForLaporan };

        it('should return processed laporan data including pregnancy age', async () => {
            // Panggilan pertama: get laporan by id_ibu
            mockGetFirestore.mockResolvedValueOnce({ docs: [mockLaporanDoc1, mockLaporanDoc2], empty: false });
            // Panggilan kedua: get data ibu by document ID (menggunakan __name__)
            mockGetFirestore.mockResolvedValueOnce({ docs: [mockIbuDocForLaporan], empty: false });

            const results = await laporanService.getLapkunByIdIbu(idIbuUntukLaporan);

            expect(mockCollectionFirestore).toHaveBeenCalledWith('kondisi_janin'); // Panggilan pertama
            expect(mockWhereFirestore).toHaveBeenCalledWith("id_ibu", "==", idIbuUntukLaporan);

            expect(mockCollectionFirestore).toHaveBeenCalledWith('Ibu'); // Panggilan kedua
            expect(mockWhereFirestore).toHaveBeenCalledWith('__name__', '==', idIbuUntukLaporan); // Asumsi dari ibuIds[0]

            expect(mockGetFirestore).toHaveBeenCalledTimes(2);
            expect(results).toHaveLength(2);

            // Laporan A (1 April 2025)
            // Tgl Reg: 1 Feb 2025 (usia awal 15)
            // Selisih hari: (Feb 27 + Mar 31 + Apr 1) = 59 hari
            // Minggu tambahan: floor(59 / 7) = 8
            // Usia Kehamilan: 15 + 8 = 23
            expect(results[0].usiaKehamilanSekarang).toBe(23);
            expect(results[0].hasil_skrinning).toBe("Aman");
            expect(results[0].tanggal_kunjungan).toBe("1 April 2025");

            // Laporan B (1 Mei 2025)
            // Tgl Reg: 1 Feb 2025 (usia awal 15)
            // Selisih hari: (Feb 27 + Mar 31 + Apr 30 + Mei 1) = 89 hari
            // Minggu tambahan: floor(89 / 7) = 12
            // Usia Kehamilan: 15 + 12 = 27
            expect(results[1].usiaKehamilanSekarang).toBe(27);
            expect(results[1].hasil_skrinning).toBe("Perlu Cek Ulang");
            expect(results[1].tanggal_kunjungan).toBe("1 Mei 2025");
        });

        it('should return an empty array if no laporan found for idIbu', async () => {
            mockGetFirestore.mockResolvedValueOnce({ docs: [], empty: true });
            const results = await laporanService.getLapkunByIdIbu("ibuKosong");
            expect(results).toEqual([]);
            expect(mockGetFirestore).toHaveBeenCalledTimes(1); // Hanya 1 panggilan karena laporan kosong
        });

        it('should skip processing for a report if tanggal_registrasi is missing for the mother', async () => {
            const mockLaporanNoReg = { id: "laporanC", data: () => ({ id_ibu: "ibuTanpaReg", tanggal: "2025-07-01" }) };
            const mockIbuNoRegData = { nama_ibu: "Ibu Tanpa Reg", usia_kehamilan: 10, tanggal_registrasi: null }; // tanggal_registrasi null
            const mockIbuNoRegDoc = { id: "ibuTanpaReg", data: () => mockIbuNoRegData };

            mockGetFirestore
                .mockResolvedValueOnce({ docs: [mockLaporanNoReg], empty: false })
                .mockResolvedValueOnce({ docs: [mockIbuNoRegDoc], empty: false });

            const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {}); // Supress console.log
            const results = await laporanService.getLapkunByIdIbu("ibuTanpaReg");

            expect(results).toEqual([]); // Tidak ada hasil karena tanggal_registrasi tidak ada
            expect(consoleSpy).toHaveBeenCalledWith("Tanggal registrasi tidak ditemukan untuk ibu ID: ibuTanpaReg");
            consoleSpy.mockRestore();
        });

        it('should throw error if Firestore fails', async () => {
            const firestoreError = new Error("DB Connection Failed");
            mockGetFirestore.mockRejectedValueOnce(firestoreError);

            await expect(laporanService.getLapkunByIdIbu("anyIdIbu"))
                .rejects.toThrow('Gagal mengambil laporan untuk bidan: DB Connection Failed');
        });
    });
});
