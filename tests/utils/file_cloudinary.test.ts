import { expect, test, beforeEach, vi } from "vitest";
import { v2 as cloudinary } from 'cloudinary';
import { uploadFile, deleteFile } from "../../src/utils/fileupload";

vi.mock("cloudinary", () => ({
    v2: {
        config: vi.fn(),
        uploader: {
            upload: vi.fn(),
            destroy: vi.fn()
        }
    }
}));

vi.mock("../../src/config/cloudinary")

beforeEach(() => {
    vi.clearAllMocks();
}); 

test("Test cloudinary upload", async () => {
    const mockUploadResult = {
        public_id: 'mock_public_id',
        secure_url: 'http://mock-cloudinary-url.com/image.jpg'
    };
    
    vi.mocked(cloudinary.uploader.upload).mockResolvedValue(mockUploadResult as any);

    const result = await uploadFile('path/to/mock/file.jpg');

    expect(cloudinary.uploader.upload).toHaveBeenCalledWith('path/to/mock/file.jpg');
    expect(result).toEqual(mockUploadResult);    
});

test("Test cloudinary delete", async () => {
    await deleteFile('randomfile.net.jpg')
    expect(cloudinary.uploader.destroy).toHaveBeenCalledWith('randomfile.net.jpg')
})