// C:\panji\coding\Kel9_PPL1_JurnalBumil\Backend\test\groqService.test.js

// 1. Mock dependencies
jest.mock('axios');

// Definisikan mock function untuk create sebelum mem-mock groq-sdk
const mockGroqChatCompletionsCreate = jest.fn();

jest.mock('groq-sdk', () => {
    // Mock constructor Groq
    return jest.fn().mockImplementation(() => {
        return {
            chat: {
                completions: {
                    create: mockGroqChatCompletionsCreate, // Gunakan mock function yang sudah didefinisikan
                },
            },
        };
    });
});

jest.mock('../utils/symptomMapping', () => ({
    convertSymptoms: jest.fn((data) => ({ ...data, converted: true })), // Contoh implementasi mock sederhana
}));

// 2. Import the service and its mocked dependencies
const axios = require('axios');
// const Groq = require('groq-sdk'); // Tidak perlu di-require lagi karena sudah di-mock sepenuhnya
const { convertSymptoms } = require('../utils/symptomMapping');
const { summarizeText, getAISummary } = require('../services/groqService'); // Sesuaikan path jika perlu

// 3. Atur environment variable jika dibutuhkan (walaupun API call di-mock)
// process.env.GROQ_API_KEY = 'test_groq_api_key'; // Sebenarnya tidak dibutuhkan karena API di-mock

describe('GroqService', () => {
    beforeEach(() => {
        // Reset semua mock sebelum setiap tes
        jest.clearAllMocks();
        // Pastikan mockGroqChatCompletionsCreate juga di-reset jika perlu (jest.clearAllMocks() seharusnya menangani ini untuk jest.fn())
        // mockGroqChatCompletionsCreate.mockClear(); // Atau mockReset() jika Anda mengganti implementasinya
    });

    // --- Tes untuk summarizeText ---
    describe('summarizeText', () => {
        it('should return summarized text on successful API call', async () => {
            const inputText = "Ibu hamil merasa mual dan pusing di pagi hari.";
            const mockApiResponse = {
                data: {
                    choices: [{ message: { content: "Ringkasan: Ibu hamil mengalami mual dan pusing." } }],
                },
            };
            axios.post.mockResolvedValueOnce(mockApiResponse);

            const result = await summarizeText(inputText);

            expect(axios.post).toHaveBeenCalledWith(
                'https://api.groq.com/openai/v1/chat/completions',
                expect.objectContaining({
                    model: 'meta-llama/llama-4-scout-17b-16e-instruct',
                    messages: expect.arrayContaining([
                        expect.objectContaining({ role: 'system' }),
                        expect.objectContaining({ role: 'user', content: `Ringkas informasi berikut:\n\n${inputText}` }),
                    ]),
                }),
                expect.objectContaining({
                    headers: expect.objectContaining({
                        Authorization: expect.stringContaining('Bearer '),
                    }),
                })
            );
            expect(result).toBe("Ringkasan: Ibu hamil mengalami mual dan pusing.");
        });

        it('should throw an error if API call fails', async () => {
            const inputText = "Data gagal.";
            const errorMessage = "Network Error";
            axios.post.mockRejectedValueOnce(new Error(errorMessage));

            await expect(summarizeText(inputText)).rejects.toThrow('Gagal merangkum teks');
            expect(axios.post).toHaveBeenCalledTimes(1);
        });

        it('should handle API error response correctly', async () => {
            const inputText = "Data error response.";
            const errorResponse = {
                response: {
                    data: { message: "API limit reached" },
                    status: 429,
                },
            };
            axios.post.mockRejectedValueOnce(errorResponse);

            await expect(summarizeText(inputText)).rejects.toThrow('Gagal merangkum teks');
        });
    });

    // --- Tes untuk getAISummary ---
    describe('getAISummary', () => {
        // Tidak perlu beforeEach khusus untuk mock Groq lagi di sini, karena sudah dihandle di top-level mock

        it('should return AI summary on successful API call', async () => {
            const inputData = [{ day: 1, symptom: "mual" }, { day: 2, symptom: "pusing" }];
            // Mock untuk convertSymptoms
            const convertedMockData = { "day": 1, "symptom": "mual", "converted": true };
            convertSymptoms.mockReturnValueOnce(convertedMockData);


            const mockGroqResponse = {
                choices: [{ message: { content: "Ringkasan AI: Pasien mengalami mual dan pusing, kondisi stabil." } }],
            };
            mockGroqChatCompletionsCreate.mockResolvedValueOnce(mockGroqResponse);

            const result = await getAISummary(inputData);

            expect(convertSymptoms).toHaveBeenCalledWith(inputData);
            expect(mockGroqChatCompletionsCreate).toHaveBeenCalledWith(
                expect.objectContaining({
                    model: 'meta-llama/llama-4-scout-17b-16e-instruct',
                    messages: expect.arrayContaining([
                        expect.objectContaining({
                            role: 'user',
                            content: expect.stringContaining(JSON.stringify(convertedMockData)),
                        }),
                    ]),
                })
            );
            expect(result).toBe("Ringkasan AI: Pasien mengalami mual dan pusing, kondisi stabil.");
        });

        it('should return specific message if input data is empty or leads to empty summary', async () => {
            const inputData = [];
            convertSymptoms.mockReturnValueOnce({});

            const mockGroqResponse = {
                choices: [{ message: { content: "tidak ada informasi tambahan selama 7 hari terakhir" } }],
            };
            mockGroqChatCompletionsCreate.mockResolvedValueOnce(mockGroqResponse);

            const result = await getAISummary(inputData);
            expect(result).toBe("tidak ada informasi tambahan selama 7 hari terakhir");
        });


        it('should return an empty string if API response is malformed (no content)', async () => {
            const inputData = [{ day: 1, symptom: "test" }];
            convertSymptoms.mockReturnValueOnce({ day: 1, symptom: "test", converted: true });
            const mockGroqResponseMalformed = {
                choices: [{ message: {} }], // Tidak ada 'content'
            };
            mockGroqChatCompletionsCreate.mockResolvedValueOnce(mockGroqResponseMalformed);

            const result = await getAISummary(inputData);
            expect(result).toBe("");
        });


        it('should throw an error if Groq API call fails', async () => {
            const inputData = [{ day: 1, symptom: "gagal" }];
            convertSymptoms.mockReturnValueOnce({ day: 1, symptom: "gagal", converted: true });
            const errorMessage = "Groq API Error";
            mockGroqChatCompletionsCreate.mockRejectedValueOnce(new Error(errorMessage));

            await expect(getAISummary(inputData)).rejects.toThrow(errorMessage);
        });
    });
});
