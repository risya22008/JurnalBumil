// C:\panji\coding\Kel9_PPL1_JurnalBumil\Backend\test\catatanService.test.js

// 1. Mock firebaseClient
// Buat fungsi-fungsi mock untuk interaksi Firestore
const mockGetFirestore = jest.fn();
const mockAddFirestore = jest.fn();
const mockLimitFirestore = jest.fn(() => ({ get: mockGetFirestore }));
const mockDocFirestore = jest.fn(() => ({ get: mockGetFirestore }));

// Buat mock untuk 'where' yang bisa di-chain (dirangkai)
const mockWhereChain = {
    get: mockGetFirestore,
    where: jest.fn(() => mockWhereChain), // Memungkinkan .where().where()
    limit: mockLimitFirestore, // Memungkinkan .where().limit()
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
const { CatatanService } = require('../services/catatanService'); // Sesuaikan path jika perlu

// 3. Import modul lain yang mungkin dibutuhkan (tidak ada untuk service ini)

describe('CatatanService', () => {
    let catatanService;

    beforeEach(() => {
        catatanService = new CatatanService();
        // Reset semua mock sebelum setiap tes
        jest.clearAllMocks();
        // Reset mock 'where' agar rantainya bersih di setiap tes
        mockWhereFirestore.mockClear();
        mockWhereChain.where.mockClear();
    });

    // --- Tes untuk addNewCatatan ---
    describe('addNewCatatan', () => {
        it('should add a new catatan and return its ID', async () => {
            const catatanInfo = {
                catatan_kondisi: "Baik",
                catatan_konsumsi: "Vitamin",
                gejala: ["Mual"],
                rating: 5,
                date: "2025-05-27",
                id_ibu: "ibuTest123",
            };

            // Atur agar mockAddFirestore mengembalikan ID palsu
            mockAddFirestore.mockResolvedValueOnce({ id: "catatanBaru456" });

            const result = await catatanService.addNewCatatan(catatanInfo);

            // Verifikasi bahwa 'add' dipanggil dengan data yang benar
            expect(mockCollectionFirestore).toHaveBeenCalledWith('Catatan');
            expect(mockAddFirestore).toHaveBeenCalledWith(catatanInfo);
            // Verifikasi bahwa ID yang dikembalikan benar
            expect(result).toBe("catatanBaru456");
        });
    });

    // --- Tes untuk getSummaryCatatan ---
    describe('getSummaryCatatan', () => {
        it('should return recent catatan for a given id_ibu', async () => {
            const id_ibu = "ibuTest123";
            const sevenDaysAgoStr = "2025-05-20";
            const mockDocs = [
                { id: "cat1", data: () => ({ date: "2025-05-21", rating: 4 }) },
                { id: "cat2", data: () => ({ date: "2025-05-25", rating: 5 }) },
            ];

            // Atur agar mockGetFirestore mengembalikan dokumen palsu
            mockGetFirestore.mockResolvedValueOnce({ docs: mockDocs });

            const result = await catatanService.getSummaryCatatan(id_ibu, sevenDaysAgoStr);

            // Verifikasi panggilan Firestore
            expect(mockCollectionFirestore).toHaveBeenCalledWith('Catatan');
            expect(mockWhereFirestore).toHaveBeenCalledWith("id_ibu", "==", id_ibu);
            expect(mockWhereChain.where).toHaveBeenCalledWith("date", ">=", sevenDaysAgoStr);
            expect(mockGetFirestore).toHaveBeenCalledTimes(1);

            // Verifikasi hasil
            expect(result).toHaveLength(2);
            expect(result[0]).toEqual({ id: "cat1", date: "2025-05-21", rating: 4 });
            expect(result[1]).toEqual({ id: "cat2", date: "2025-05-25", rating: 5 });
        });
    });

    // --- Tes untuk getAllCatatanByIdIbu ---
    describe('getAllCatatanByIdIbu', () => {
        it('should return all catatan for a given id_ibu', async () => {
            const id_ibu = "ibuTest123";
            const mockDocs = [
                { id: "catA", data: () => ({ date: "2025-04-10", rating: 3 }) },
                { id: "catB", data: () => ({ date: "2025-05-01", rating: 5 }) },
            ];
            mockGetFirestore.mockResolvedValueOnce({ docs: mockDocs, empty: false });

            const result = await catatanService.getAllCatatanByIdIbu(id_ibu);

            expect(mockCollectionFirestore).toHaveBeenCalledWith('Catatan');
            expect(mockWhereFirestore).toHaveBeenCalledWith("id_ibu", "==", id_ibu);
            expect(mockGetFirestore).toHaveBeenCalledTimes(1);
            expect(result).toHaveLength(2);
            expect(result[0].id).toBe("catA");
            expect(result[1].id).toBe("catB");
        });

        it('should return an empty array if no catatan found', async () => {
            const id_ibu = "ibuTidakAdaCatatan";
            mockGetFirestore.mockResolvedValueOnce({ docs: [], empty: true });

            const result = await catatanService.getAllCatatanByIdIbu(id_ibu);

            expect(mockWhereFirestore).toHaveBeenCalledWith("id_ibu", "==", id_ibu);
            expect(result).toEqual([]);
        });
    });

    // --- Tes untuk getCatatanByTanggal ---
    describe('getCatatanByTanggal', () => {
        const id_ibu = "zBFjfUUhgri9vxRPAmCx";
        const tanggal = "2025-05-27";

        // Mock data catatan
        const mockCatatanDoc = {
            id: "catTanggal1",
            data: () => ({
                catatan_kondisi: "Pusing",
                catatan_konsumsi: "Air Putih",
                gejala: ["Pusing"],
                rating: 3,
                date: tanggal,
                id_ibu: id_ibu,
            }),
        };

        // Mock data ibu (sesuai contoh Anda)
        const mockIbuDoc = {
            exists: true,
            data: () => ({
                nama_ibu: "castorice",
                usia_kehamilan: 22,
                tanggal_registrasi: {
                    // Mock Firestore Timestamp
                    toDate: () => new Date('2025-04-02T04:59:12Z') // 2 April 2025, 11:59:12 UTC+7
                }
            }),
        };

        it('should return catatan with ibu info and calculated pregnancy age', async () => {
            // Atur mockGetFirestore untuk mengembalikan data Catatan, lalu data Ibu
            mockGetFirestore
                .mockResolvedValueOnce({ docs: [mockCatatanDoc], empty: false }) // Hasil Catatan
                .mockResolvedValueOnce(mockIbuDoc); // Hasil Ibu

            const result = await catatanService.getCatatanByTanggal(id_ibu, tanggal);

            // Verifikasi panggilan Firestore
            expect(mockCollectionFirestore).toHaveBeenCalledWith('Catatan');
            expect(mockWhereFirestore).toHaveBeenCalledWith("id_ibu", "==", id_ibu);
            expect(mockWhereChain.where).toHaveBeenCalledWith("date", "==", tanggal);
            expect(mockLimitFirestore).toHaveBeenCalledWith(1);
            expect(mockCollectionFirestore).toHaveBeenCalledWith('Ibu');
            expect(mockDocFirestore).toHaveBeenCalledWith(id_ibu);
            expect(mockGetFirestore).toHaveBeenCalledTimes(2);

            // Verifikasi hasil - Usia Kehamilan
            // Tanggal Registrasi: 2 April 2025
            // Tanggal Catatan: 27 Mei 2025
            // Selisih: ~55 hari
            // Minggu Tambahan: floor(55 / 7) = 7 minggu
            // Usia Kehamilan: 22 + 7 = 29 minggu
            expect(result.usia_kehamilan).toBe(29);
            expect(result.nama_ibu).toBe("castorice");
            expect(result.rating).toBe(3);
        });

        it('should return null if no catatan found for the date', async () => {
            mockGetFirestore.mockResolvedValueOnce({ docs: [], empty: true });

            const result = await catatanService.getCatatanByTanggal(id_ibu, tanggal);

            expect(result).toBeNull();
            expect(mockGetFirestore).toHaveBeenCalledTimes(1);
            expect(mockDocFirestore).not.toHaveBeenCalled(); // Tidak perlu cari data ibu jika catatan tidak ada
        });

        it('should throw an error if ibu data not found', async () => {
            mockGetFirestore
                .mockResolvedValueOnce({ docs: [mockCatatanDoc], empty: false }) // Catatan ada
                .mockResolvedValueOnce({ exists: false }); // Ibu tidak ada

            await expect(catatanService.getCatatanByTanggal(id_ibu, tanggal))
                .rejects.toThrow("Gagal mengambil catatan: Data ibu tidak ditemukan");
        });

        it('should throw an error if Firestore fails', async () => {
            const firestoreError = new Error("Firestore unavailable");
            mockGetFirestore.mockRejectedValueOnce(firestoreError); // Simulasikan error

            await expect(catatanService.getCatatanByTanggal(id_ibu, tanggal))
                .rejects.toThrow("Gagal mengambil catatan: Firestore unavailable");
        });
    });
});
