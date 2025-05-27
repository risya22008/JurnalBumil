const { ArtikelService } = require('../services/ArtikelService');

jest.mock('../firebaseClient', () => {
    const mockData = {
        '1': {
            gejala_parah: ['mual'],
            ibu: ['makan teratur'],
            janin: ['pertumbuhan awal'],
            perlu_dilakukan: ['periksa ke bidan']
        },
        '2': {
            gejala_parah: [],
            ibu: [],
            janin: [],
            perlu_dilakukan: []
        }
    };

    return {
        db: {
            collection: jest.fn((colName) => {
                if (colName === 'artikel') {
                    return {
                        doc: jest.fn((id) => ({
                            get: jest.fn(async () => {
                                if (mockData[id]) {
                                    return {
                                        exists: true,
                                        data: () => mockData[id]
                                    };
                                } else {
                                    return { exists: false };
                                }
                            })
                        }))
                    };
                } else if (colName === 'Ibu') {
                    return {
                        doc: jest.fn((userId) => ({
                            get: jest.fn(async () => {
                                if (userId === 'ibu123') {
                                    return {
                                        exists: true,
                                        data: () => ({
                                            tanggal_registrasi: {
                                                toDate: () => {
                                                    const now = new Date();
                                                    now.setDate(now.getDate() - 14); // 2 minggu yang lalu
                                                    return now;
                                                }
                                            },
                                            usia_kehamilan: 10
                                        })
                                    };
                                } else {
                                    return { exists: false };
                                }
                            })
                        }))
                    };
                }
            })
        }
    };
});

describe('ArtikelService', () => {
    const service = new ArtikelService();

    test('mapUsiaToTrimester returns correct trimester', () => {
        expect(service.mapUsiaToTrimester(10)).toBe(1);
        expect(service.mapUsiaToTrimester(20)).toBe(2);
        expect(service.mapUsiaToTrimester(30)).toBe(3);
    });

    test('getArtikelByTrimester returns data when document exists', async () => {
        const data = await service.getArtikelByTrimester(1);
        expect(data).toEqual({
            gejala_parah: ['mual'],
            ibu: ['makan teratur'],
            janin: ['pertumbuhan awal'],
            perlu_dilakukan: ['periksa ke bidan']
        });
    });

    test('getArtikelByTrimester throws error when document not found', async () => {
        await expect(service.getArtikelByTrimester(99)).rejects.toThrow('Artikel tidak ditemukan');
    });

    test('hitungUsiaKehamilan calculates current pregnancy age', async () => {
        const usia = await service.hitungUsiaKehamilan('ibu123');
        expect(usia).toBe(12); // 10 awal + 2 minggu sejak registrasi
    });

    test('hitungUsiaKehamilan throws error when ibu data not found', async () => {
        await expect(service.hitungUsiaKehamilan('tidak_ada')).rejects.toThrow('Data ibu tidak ditemukan');
    });
});

