// C:\panji\coding\Kel9_PPL1_JurnalBumil\Backend\test\ibuService.test.js

// 1. Mock dependencies
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

// Mock untuk groqService dan symptomMapping
jest.mock('../services/groqService', () => ({
    summarizeText: jest.fn(),
}));
jest.mock('../utils/symptomMapping', () => ({
    convertSymptoms: jest.fn(),
}));


// Buat fungsi-fungsi mock untuk interaksi Firestore
const mockGetFirestore = jest.fn();
const mockAddFirestore = jest.fn();
const mockDocFirestore = jest.fn(() => ({ get: mockGetFirestore }));
const mockSelectFirestore = jest.fn(() => ({ get: mockGetFirestore })); // Untuk .select().get()

// Buat mock untuk 'where' yang bisa di-chain dan juga memiliki 'select'
const mockWhereChain = {
    get: mockGetFirestore,
    where: jest.fn(() => mockWhereChain),
    select: jest.fn(() => mockWhereChain), // Memungkinkan .where().select().get()
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
const { IbuService } = require('../services/ibuService'); // Sesuaikan path jika perlu

// 3. Import modul lain yang mungkin dibutuhkan (bcrypt dan jwt untuk mengakses mocknya)
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { summarizeText } = require('../services/groqService'); // Untuk mengakses mocknya jika diperlukan
const { convertSymptoms } = require('../utils/symptomMapping'); // Untuk mengakses mocknya jika diperlukan

// Atur environment variable jika dibutuhkan oleh service
process.env.JWT_SECRET = 'testsecretjwt';

describe('IbuService', () => {
    let ibuService;
    const OriginalDate = global.Date; // Store original Date constructor

    beforeEach(() => {
        ibuService = new IbuService();
        jest.clearAllMocks();
        global.Date = OriginalDate; // Restore original Date before each test run

        // Definisikan implementasi default untuk mock bcrypt dan jwt
        bcrypt.hash.mockImplementation((password, saltRounds) => Promise.resolve(`hashed_${password}_${saltRounds}`));
        bcrypt.compare.mockImplementation((plainPassword, hashedPassword) => {
            if (!hashedPassword || !plainPassword) return Promise.resolve(false);
            const parts = hashedPassword.split('_');
            const originalPasswordFromFile = parts.length > 1 ? parts[1] : '';
            return Promise.resolve(originalPasswordFromFile === plainPassword);
        });
        jwt.sign.mockImplementation((payload, secret, options) => {
            if (!payload || !payload.userId || !payload.email || !payload.role || !options || !options.expiresIn) {
                return undefined;
            }
            return `mockToken_userId=${payload.userId}_email=${payload.email}_role=${payload.role}_id=${payload.id}_expiresIn=${options.expiresIn}`;
        });

        // Reset Firestore mocks
        mockGetFirestore.mockReset();
        mockAddFirestore.mockReset();
        mockDocFirestore.mockClear();
        mockSelectFirestore.mockClear(); // This was mockSelectFirestore in previous code, ensure it's defined if used.
        mockWhereFirestore.mockClear();
        mockWhereChain.where.mockClear();
        mockWhereChain.select.mockClear();
        mockCollectionFirestore.mockClear();
    });

    afterEach(() => {
        global.Date = OriginalDate; // Restore original Date after each test
    });


    // --- Tes untuk createIbu ---
    describe('createIbu', () => {
        it('should create a new ibu successfully if email does not exist', async () => {
            const ibuData = {
                nama_ibu: "Ibu Sehat",
                email_ibu: "ibu.sehat@example.com",
                sandi_ibu: "password123",
                usia_kehamilan: 10,
                bidan: "Bidan Test",
            };

            // Email check: Ibu (empty), Bidan (empty)
            mockGetFirestore.mockResolvedValueOnce({ empty: true }).mockResolvedValueOnce({ empty: true });
            mockAddFirestore.mockResolvedValueOnce({ id: "ibuBaruId789" });

            const result = await ibuService.createIbu(ibuData);

            expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
            expect(mockCollectionFirestore).toHaveBeenCalledWith('Ibu'); // Untuk add
            expect(mockCollectionFirestore).toHaveBeenCalledWith('Bidan'); // Untuk check email di Bidan
            expect(mockWhereFirestore).toHaveBeenCalledWith("email_ibu", "==", "ibu.sehat@example.com"); // Check di Ibu
            expect(mockWhereFirestore).toHaveBeenCalledWith("email_bidan", "==", "ibu.sehat@example.com"); // Check di Bidan
            expect(mockAddFirestore).toHaveBeenCalledWith(expect.objectContaining({
                nama_ibu: "Ibu Sehat",
                email_ibu: "ibu.sehat@example.com",
                sandi_ibu: "hashed_password123_10",
                usia_kehamilan: 10,
                bidan: "Bidan Test",
                verifikasi_email: 0,
            }));
            expect(result).toHaveProperty("id", "ibuBaruId789");
            expect(result.tanggal_registrasi).toBeInstanceOf(Date); // Service uses new Date()
        });

        it('should throw an error if email already exists in Ibu collection', async () => {
            const ibuData = { email_ibu: "used.email@example.com", sandi_ibu: "pw" };
            mockGetFirestore.mockResolvedValueOnce({ empty: false }); // Email exists in Ibu

            await expect(ibuService.createIbu(ibuData)).rejects.toThrow("Email sudah digunakan");
            expect(mockAddFirestore).not.toHaveBeenCalled();
        });

        it('should throw an error if email already exists in Bidan collection', async () => {
            const ibuData = { email_ibu: "used.email@example.com", sandi_ibu: "pw" };
            mockGetFirestore
                .mockResolvedValueOnce({ empty: true })    // Email not in Ibu
                .mockResolvedValueOnce({ empty: false }); // Email exists in Bidan

            await expect(ibuService.createIbu(ibuData)).rejects.toThrow("Email sudah digunakan");
            expect(mockAddFirestore).not.toHaveBeenCalled();
        });
    });

    // --- Tes untuk findByEmail ---
    describe('findByEmail', () => {
        it('should return true if email exists', async () => {
            mockGetFirestore.mockResolvedValueOnce({ empty: false });
            const result = await ibuService.findByEmail("exists@example.com");
            expect(mockCollectionFirestore).toHaveBeenCalledWith("Ibu");
            expect(mockWhereFirestore).toHaveBeenCalledWith("email_ibu", "==", "exists@example.com");
            expect(result).toBe(true);
        });

        it('should return false if email does not exist', async () => {
            mockGetFirestore.mockResolvedValueOnce({ empty: true });
            const result = await ibuService.findByEmail("notexists@example.com");
            expect(result).toBe(false);
        });
    });

    // --- Tes untuk getAllIbuByKodeBidan ---
    describe('getAllIbuByKodeBidan', () => {
        it('should return data of ibu for a given kode_bidan', async () => {
            const kode_bidan = "bidanKode123";
            const mockDocs = [
                { id: "ibu1", data: () => ({ nama_ibu: "Ibu A", usia_kehamilan: 12 }) },
                { id: "ibu2", data: () => ({ nama_ibu: "Ibu B", usia_kehamilan: 20 }) },
            ];
            mockGetFirestore.mockResolvedValueOnce({ docs: mockDocs, empty: false });

            const result = await ibuService.getAllIbuByKodeBidan(kode_bidan);

            expect(mockCollectionFirestore).toHaveBeenCalledWith("Ibu");
            expect(mockWhereFirestore).toHaveBeenCalledWith("kode_bidan", "==", kode_bidan);
            expect(mockWhereChain.select).toHaveBeenCalledWith("nama_ibu", "usia_kehamilan");
            expect(result).toHaveLength(2);
            expect(result[0]).toEqual({ id: "ibu1", nama_ibu: "Ibu A", usia_kehamilan: 12 });
        });

        it('should return undefined if no matching documents', async () => {
            mockGetFirestore.mockResolvedValueOnce({ empty: true });
            const result = await ibuService.getAllIbuByKodeBidan("unknownKode");
            expect(result).toBeUndefined();
        });
    });

    // --- Tes untuk getAllIbuWithCatatanByNamaBidan ---
    describe('getAllIbuWithCatatanByNamaBidan', () => {
        // Define specific date objects *before* any spying
        const REG_DATE_SAKURA = new OriginalDate('2025-03-01T00:00:00Z');
        const REG_DATE_AI = new OriginalDate('2025-04-15T00:00:00Z');
        const MOCK_CURRENT_DATE_FOR_TEST = new OriginalDate('2025-05-27T00:00:00Z'); // 27 Mei 2025

        it('should return ibu data with their catatan, and calculated pregnancy age', async () => {
            const nama_bidan = "Bidan Hoshino";
            const mockIbuDoc1 = {
                id: "ibuId1",
                data: () => ({
                    nama_ibu: "Ibu Sakura",
                    email_ibu: "sakura@example.com",
                    usia_kehamilan: 20, // Usia awal
                    tanggal_registrasi: { toDate: () => REG_DATE_SAKURA },
                    verifikasi_email: 2,
                }),
            };
            const mockIbuDoc2 = {
                id: "ibuId2",
                data: () => ({
                    nama_ibu: "Ibu Ai",
                    email_ibu: "ai@example.com",
                    usia_kehamilan: 10, // Usia awal
                    tanggal_registrasi: { toDate: () => REG_DATE_AI },
                    verifikasi_email: 2,
                }),
            };
            const mockCatatanDoc1ForIbu1 = { id: "cat1", data: () => ({ gejala: ["Mual"], date: "2025-03-10" }) };
            const mockCatatanDoc2ForIbu1 = { id: "cat2", data: () => ({ gejala: ["Pusing"], date: "2025-03-15" }) };
            const mockCatatanDoc1ForIbu2 = { id: "cat3", data: () => ({ gejala: ["Lemas"], date: "2025-04-20" }) };

            mockGetFirestore.mockResolvedValueOnce({ docs: [mockIbuDoc1, mockIbuDoc2], empty: false });
            mockGetFirestore.mockResolvedValueOnce({ docs: [mockCatatanDoc1ForIbu1, mockCatatanDoc2ForIbu1], empty: false });
            mockGetFirestore.mockResolvedValueOnce({ docs: [mockCatatanDoc1ForIbu2], empty: false });

            // Spy on global.Date to control `new Date()` for "sekarang"
            // This mock will only affect `new Date()` called without arguments.
            const dateSpy = jest.spyOn(global, 'Date');
            dateSpy.mockImplementation((...args) => {
                if (args.length === 0) { // Called as new Date()
                    return MOCK_CURRENT_DATE_FOR_TEST;
                }
                return new OriginalDate(...args); // Called with arguments, use original
            });

            const result = await ibuService.getAllIbuWithCatatanByNamaBidan(nama_bidan);

            expect(mockCollectionFirestore).toHaveBeenCalledWith("Ibu");
            expect(mockWhereFirestore).toHaveBeenCalledWith("bidan", "==", nama_bidan);
            expect(mockWhereChain.select).toHaveBeenCalledWith("nama_ibu", "email_ibu", "usia_kehamilan", "tanggal_registrasi", "verifikasi_email");

            expect(mockCollectionFirestore).toHaveBeenCalledWith("Catatan");
            expect(mockWhereFirestore).toHaveBeenCalledWith("id_ibu", "==", "ibuId1");
            expect(mockWhereFirestore).toHaveBeenCalledWith("id_ibu", "==", "ibuId2");

            expect(result).toHaveLength(2);

            const ibuSakura = result.find(i => i.id === "ibuId1");
            expect(ibuSakura.nama_ibu).toBe("Ibu Sakura");
            // Reg: 1 Mar 2025 (REG_DATE_SAKURA), Usia Awal: 20
            // Now: 27 Mei 2025 (MOCK_CURRENT_DATE_FOR_TEST). Selisih: 87 hari. Minggu tambahan: floor(87/7) = 12
            // Usia Sekarang: 20 + 12 = 32
            expect(ibuSakura.usia_kehamilan).toBe(32);
            expect(ibuSakura.semua_catatan).toHaveLength(2);
            expect(ibuSakura.semua_catatan[0].id).toBe("cat1");

            const ibuAi = result.find(i => i.id === "ibuId2");
            expect(ibuAi.nama_ibu).toBe("Ibu Ai");
            // Reg: 15 Apr 2025 (REG_DATE_AI), Usia Awal: 10
            // Now: 27 Mei 2025. Selisih: 42 hari. Minggu tambahan: floor(42/7) = 6
            // Usia Sekarang: 10 + 6 = 16
            expect(ibuAi.usia_kehamilan).toBe(16);
            expect(ibuAi.semua_catatan).toHaveLength(1);
            expect(ibuAi.semua_catatan[0].id).toBe("cat3");

            dateSpy.mockRestore(); // Restore original Date
        });

        it('should return an empty array if no ibu found for the bidan', async () => {
            mockGetFirestore.mockResolvedValueOnce({ docs: [], empty: true });
            const result = await ibuService.getAllIbuWithCatatanByNamaBidan("Bidan Tidak Ada");
            expect(result).toEqual([]);
        });
    });


    // --- Tes untuk loginIbu ---
    describe('loginIbu', () => {
        const loginData = { email_ibu: "login.ibu@example.com", sandi_ibu: "passwordIbu" };
        const mockIbuDocData = {
            nama_ibu: "Ibu Login",
            email_ibu: "login.ibu@example.com",
            sandi_ibu: "hashed_passwordIbu_10",
            verifikasi_email: 2, // Sudah diverifikasi
        };
        const mockIbuDoc = { id: "loginIbuId", data: () => mockIbuDocData };

        it('should login ibu successfully if credentials are valid and email verified', async () => {
            mockGetFirestore.mockResolvedValueOnce({ docs: [mockIbuDoc], empty: false });
            bcrypt.compare.mockResolvedValueOnce(true); // Password match

            const result = await ibuService.loginIbu(loginData);

            expect(mockCollectionFirestore).toHaveBeenCalledWith("Ibu");
            expect(mockWhereFirestore).toHaveBeenCalledWith("email_ibu", "==", loginData.email_ibu);
            expect(bcrypt.compare).toHaveBeenCalledWith(loginData.sandi_ibu, mockIbuDocData.sandi_ibu);
            expect(jwt.sign).toHaveBeenCalledWith(
                expect.objectContaining({
                    userId: "loginIbuId",
                    email: loginData.email_ibu,
                    nama: mockIbuDocData.nama_ibu,
                    role: "ibu",
                    id: "loginIbuId",
                }),
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
            expect(result).toBe(`mockToken_userId=loginIbuId_email=${loginData.email_ibu}_role=ibu_id=loginIbuId_expiresIn=1h`);
        });

        it('should throw error if user not registered', async () => {
            mockGetFirestore.mockResolvedValueOnce({ empty: true });
            await expect(ibuService.loginIbu(loginData)).rejects.toThrow("User belum terdaftar!");
        });

        it('should throw error if password does not match', async () => {
            mockGetFirestore.mockResolvedValueOnce({ docs: [mockIbuDoc], empty: false });
            bcrypt.compare.mockResolvedValueOnce(false); // Password mismatch
            await expect(ibuService.loginIbu(loginData)).rejects.toThrow("Invalid credentials");
        });

        it('should throw error if email not verified', async () => {
            const unverifiedIbuData = { ...mockIbuDocData, verifikasi_email: 0 };
            const unverifiedIbuDoc = { id: "loginIbuId", data: () => unverifiedIbuData };
            mockGetFirestore.mockResolvedValueOnce({ docs: [unverifiedIbuDoc], empty: false });
            bcrypt.compare.mockResolvedValueOnce(true); // Password match

            await expect(ibuService.loginIbu(loginData)).rejects.toThrow("Akun belum diverifikasi!");
        });
    });

    // --- Tes untuk generateAuthToken ---
    describe('generateAuthToken', () => {
        it('should generate a token with correct payload', () => {
            const userData = {
                id: "ibuIdToken",
                _id: "ibuIdTokenFallback", // Untuk menguji jika _id ada
                email_ibu: "token.ibu@example.com",
                nama_ibu: "Ibu Token",
            };
            const token = ibuService.generateAuthToken(userData);
            expect(jwt.sign).toHaveBeenCalledWith(
                {
                    userId: "ibuIdTokenFallback",
                    email: "token.ibu@example.com",
                    nama: "Ibu Token",
                    role: "ibu",
                    id: "ibuIdToken",
                },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
            expect(token).toBe(`mockToken_userId=ibuIdTokenFallback_email=token.ibu@example.com_role=ibu_id=ibuIdToken_expiresIn=1h`);
        });
    });

    // --- Tes untuk getIbuById ---
    describe('getIbuById', () => {
        it('should return ibu data if document exists', async () => {
            const ibuId = "existIbuId";
            const mockData = { nama_ibu: "Ibu Ditemukan", email_ibu: "ditemukan@example.com" };
            mockGetFirestore.mockResolvedValueOnce({ exists: true, id: ibuId, data: () => mockData });

            const result = await ibuService.getIbuById(ibuId);

            expect(mockCollectionFirestore).toHaveBeenCalledWith("Ibu");
            expect(mockDocFirestore).toHaveBeenCalledWith(ibuId);
            expect(result).toEqual({ id: ibuId, ...mockData });
        });

        it('should throw error if document does not exist', async () => {
            mockGetFirestore.mockResolvedValueOnce({ exists: false });
            // Expect the error message that is re-thrown by the service's catch block
            await expect(ibuService.getIbuById("notExistIbuId")).rejects.toThrow("Terjadi kesalahan saat mengambil data ibu");
        });

        it('should re-throw error if Firestore fails', async () => {
            const firestoreError = new Error("Firestore connection error");
            mockGetFirestore.mockRejectedValueOnce(firestoreError);
            await expect(ibuService.getIbuById("anyIbuId")).rejects.toThrow("Terjadi kesalahan saat mengambil data ibu");
        });
    });
});
