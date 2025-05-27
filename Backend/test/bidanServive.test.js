// C:\panji\coding\Kel9_PPL1_JurnalBumil\Backend\test\bidanServive.test.js

// 1. Mock external and local dependencies
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

const mockGetFirestore = jest.fn();
const mockAddFirestore = jest.fn();
const mockWhereFirestore = jest.fn(() => ({ get: mockGetFirestore }));
const mockCollectionFirestore = jest.fn(() => ({
    where: mockWhereFirestore,
    add: mockAddFirestore,
}));

jest.mock('../firebaseClient', () => ({
    __esModule: true,
    db: {
        collection: mockCollectionFirestore,
    },
}));

// 2. Import the service to be tested AFTER mocks are set up
const { BidanService } = require('../services/bidanService');

// 3. Import the actual (but now mocked) modules to access their mock functions
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const { db } = require('../firebaseClient'); // db is used via mockCollectionFirestore

process.env.JWT_SECRET = 'testsecret';

describe('BidanService', () => {
    let bidanService;

    beforeEach(() => {
        bidanService = new BidanService();
        jest.clearAllMocks();

        // Explicitly define mock implementations for bcrypt and jwt
        // This ensures they return what the service expects.

        bcrypt.hash.mockImplementation((password, saltRounds) => {
            // Ensure the mock returns a Promise that resolves to the expected string format
            return Promise.resolve(`hashed_${password}_${saltRounds}`);
        });

        // Default bcrypt.compare behavior (can be overridden in specific tests)
        bcrypt.compare.mockImplementation((plainPassword, hashedPassword) => {
            // Simplified mock comparison based on the format from bcrypt.hash mock
            if (!hashedPassword || !plainPassword) return Promise.resolve(false);
            const parts = hashedPassword.split('_');
            // Example: hashed_password123_10 -> parts[1] is 'password123'
            const originalPasswordFromFile = parts.length > 1 ? parts[1] : '';
            return Promise.resolve(originalPasswordFromFile === plainPassword);
        });


        jwt.sign.mockImplementation((payload, secret, options) => {
            // Ensure the mock returns the expected token string format
            if (!payload || !payload.userId || !payload.email || !payload.role || !options || !options.expiresIn) {
                return undefined; // Or throw error if payload is incomplete for mock
            }
            return `mockToken_userId=${payload.userId}_email=${payload.email}_role=${payload.role}_expiresIn=${options.expiresIn}`;
        });


        // Reset Firestore mocks
        mockGetFirestore.mockReset();
        mockAddFirestore.mockReset();
        mockWhereFirestore.mockClear();
        mockCollectionFirestore.mockClear();
    });

    describe('createBidan', () => {
        it('should create a new bidan successfully', async () => {
            const bidanData = {
                nama_bidan: 'Bidan Test',
                email_bidan: 'test@example.com',
                sandi_bidan: 'password123', // This will be hashed by the service
                kode_lembaga: 'L001',
                kode_bidan: 'B001',
            };

            mockGetFirestore.mockResolvedValueOnce({ empty: true });
            mockAddFirestore.mockResolvedValueOnce({ id: 'newBidanId' });

            const result = await bidanService.createBidan(bidanData);

            expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
            expect(mockCollectionFirestore).toHaveBeenCalledWith('Bidan');
            expect(mockWhereFirestore).toHaveBeenCalledWith('email_bidan', '==', 'test@example.com');
            expect(mockGetFirestore).toHaveBeenCalledTimes(1);
            expect(mockAddFirestore).toHaveBeenCalledWith({
                nama_bidan: 'Bidan Test',
                email_bidan: 'test@example.com',
                sandi_bidan: 'hashed_password123_10', // Expected based on bcrypt.hash mock
                kode_lembaga: 'L001',
                kode_bidan: 'B001',
                verifikasi: 0,
                verifikasi_email: 0,
            });
            expect(result).toEqual({
                id: 'newBidanId',
                nama_bidan: 'Bidan Test',
                email_bidan: 'test@example.com',
                sandi_bidan: 'hashed_password123_10',
                kode_lembaga: 'L001',
                kode_bidan: 'B001',
                verifikasi: 0,
                verifikasi_email: 0,
            });
        });

        it('should throw an error if email is already used', async () => {
            const bidanData = {
                nama_bidan: 'Bidan Test Duplikat',
                email_bidan: 'used@example.com',
                sandi_bidan: 'password456',
                kode_lembaga: 'L002',
                kode_bidan: 'B002',
            };
            mockGetFirestore.mockResolvedValueOnce({ empty: false });

            await expect(bidanService.createBidan(bidanData)).rejects.toThrow('Email sudah digunakan');

            expect(bcrypt.hash).toHaveBeenCalledWith('password456', 10);
            expect(mockCollectionFirestore).toHaveBeenCalledWith('Bidan');
            expect(mockWhereFirestore).toHaveBeenCalledWith('email_bidan', '==', 'used@example.com');
            expect(mockGetFirestore).toHaveBeenCalledTimes(1);
            expect(mockAddFirestore).not.toHaveBeenCalled();
        });
    });

    describe('loginBidan', () => {
        const loginData = {
            email_bidan: 'login@example.com',
            sandi_bidan: 'password123',
        };

        const mockBidanDocData = {
            nama_bidan: 'Bidan Login',
            email_bidan: 'login@example.com',
            sandi_bidan: 'hashed_password123_10', // This is the "stored" hashed password
            kode_lembaga: 'L002',
            kode_bidan: 'B002',
            verifikasi: 1,
            verifikasi_email: 2,
        };

        const mockBidanDoc = {
            id: 'bidanUserId',
            data: () => mockBidanDocData,
        };

        it('should login bidan successfully and return auth token', async () => {
            mockGetFirestore.mockResolvedValueOnce({ empty: false, docs: [mockBidanDoc] });
            // Explicitly set bcrypt.compare to resolve true for this successful login case
            bcrypt.compare.mockResolvedValueOnce(true);

            const result = await bidanService.loginBidan(loginData);

            expect(mockCollectionFirestore).toHaveBeenCalledWith('Bidan');
            expect(mockWhereFirestore).toHaveBeenCalledWith('email_bidan', '==', 'login@example.com');
            expect(mockGetFirestore).toHaveBeenCalledTimes(1);
            // bcrypt.compare is called by the service with ('password123', 'hashed_password123_10')
            expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashed_password123_10');
            expect(jwt.sign).toHaveBeenCalledWith(
                {
                    userId: 'bidanUserId',
                    email: 'login@example.com',
                    id: 'bidanUserId',
                    nama: 'Bidan Login',
                    role: 'bidan',
                },
                'testsecret',
                { expiresIn: '1h' }
            );
            expect(result).toBe('mockToken_userId=bidanUserId_email=login@example.com_role=bidan_expiresIn=1h');
        });

        it('should throw error if user is not registered', async () => {
            mockGetFirestore.mockResolvedValueOnce({ empty: true });

            await expect(bidanService.loginBidan(loginData)).rejects.toThrow('User belum terdaftar!');
            // ... other assertions remain the same
        });

        it('should throw error for invalid credentials (password mismatch)', async () => {
            mockGetFirestore.mockResolvedValueOnce({ empty: false, docs: [mockBidanDoc] });
            bcrypt.compare.mockResolvedValueOnce(false); // Ensure this is effective

            await expect(bidanService.loginBidan({ ...loginData, sandi_bidan: 'wrongPassword' })).rejects.toThrow('Invalid credentials');
            expect(bcrypt.compare).toHaveBeenCalledWith('wrongPassword', 'hashed_password123_10');
            expect(jwt.sign).not.toHaveBeenCalled();
        });

        it('should throw error if account is not verified (verifikasi !== 1)', async () => {
            const unverifiedBidanData = { ...mockBidanDocData, verifikasi: 0 };
            const unverifiedBidanDoc = { id: 'unverifiedId', data: () => unverifiedBidanData };
            mockGetFirestore.mockResolvedValueOnce({ empty: false, docs: [unverifiedBidanDoc] });
            bcrypt.compare.mockResolvedValueOnce(true); // Assume password matches for this check

            await expect(bidanService.loginBidan(loginData)).rejects.toThrow('Akun belum diverifikasi!');
            // ... other assertions remain the same
        });

        it('should throw error if email is not verified (verifikasi_email !== 2)', async () => {
            const unverifiedEmailData = { ...mockBidanDocData, verifikasi_email: 0 };
            const unverifiedEmailDoc = { id: 'unverifiedEmailId', data: () => unverifiedEmailData };
            mockGetFirestore.mockResolvedValueOnce({ empty: false, docs: [unverifiedEmailDoc] });
            bcrypt.compare.mockResolvedValueOnce(true); // Assume password matches for this check

            await expect(bidanService.loginBidan(loginData)).rejects.toThrow('Akun belum diverifikasi!');
            // ... other assertions remain the same
        });
    });

    describe('findByEmail', () => {
        it('should return true if email exists', async () => {
            mockGetFirestore.mockResolvedValueOnce({ empty: false });
            const result = await bidanService.findByEmail('exists@example.com');
            expect(mockCollectionFirestore).toHaveBeenCalledWith('Bidan');
            expect(mockWhereFirestore).toHaveBeenCalledWith('email_bidan', '==', 'exists@example.com');
            expect(mockGetFirestore).toHaveBeenCalledTimes(1);
            expect(result).toBe(true);
        });

        it('should return false if email does not exist', async () => {
            mockGetFirestore.mockResolvedValueOnce({ empty: true });
            const result = await bidanService.findByEmail('nonexistent@example.com');
            expect(mockCollectionFirestore).toHaveBeenCalledWith('Bidan');
            expect(mockWhereFirestore).toHaveBeenCalledWith('email_bidan', '==', 'nonexistent@example.com');
            expect(mockGetFirestore).toHaveBeenCalledTimes(1);
            expect(result).toBe(false);
        });
    });

    describe('generateAuthToken', () => {
        it('should generate a JWT token with correct payload using _id if present', () => {
            const userData = {
                _id: 'mongoLikeId123',
                id: 'fallbackId456',
                email_bidan: 'token@example.com',
                nama_bidan: 'Token Bidan',
            };
            const token = bidanService.generateAuthToken(userData);
            expect(jwt.sign).toHaveBeenCalledWith(
                {
                    userId: 'mongoLikeId123',
                    email: 'token@example.com',
                    id: 'fallbackId456',
                    nama: 'Token Bidan',
                    role: 'bidan',
                },
                'testsecret',
                { expiresIn: '1h' }
            );
            expect(token).toBe('mockToken_userId=mongoLikeId123_email=token@example.com_role=bidan_expiresIn=1h');
        });

         it('should generate a JWT token using userData.id if _id is not present', () => {
            const userData = {
                id: 'userIdOnly789',
                email_bidan: 'token_no_underscore@example.com',
                nama_bidan: 'Token Bidan No Underscore',
            };
            const token = bidanService.generateAuthToken(userData);
            expect(jwt.sign).toHaveBeenCalledWith(
                {
                    userId: 'userIdOnly789',
                    email: 'token_no_underscore@example.com',
                    id: 'userIdOnly789',
                    nama: 'Token Bidan No Underscore',
                    role: 'bidan',
                },
                'testsecret',
                { expiresIn: '1h' }
            );
            expect(token).toBe('mockToken_userId=userIdOnly789_email=token_no_underscore@example.com_role=bidan_expiresIn=1h');
        });
    });
});
