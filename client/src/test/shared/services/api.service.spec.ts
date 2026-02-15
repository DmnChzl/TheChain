import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ApiService } from '@shared/services/api.service';

describe('ApiService', () => {
  let service: ApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApiService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(ApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('should fetch blockchain', () => {
    const mockData = { data: { fileHash: 'def456' }, hash: 'abc123', prevHash: '', timestamp: 1771068600000 };
    const mockResponse = { status: 'fulfilled', data: mockData };

    service.getBlockChain().subscribe((state) => {
      expect(state).toEqual(mockData);
    });

    const req = http.expectOne('/api/blockchain');
    expect(req.request.method).toEqual('GET');
    req.flush(mockResponse);
  });

  it('should enroll file', () => {
    const mockRecord = {
      fileName: 'document.pdf',
      fileHash: 'def456',
      fileSize: 5242880,
      mimeType: 'application/pdf',
      updatedAt: 1771068600000,
    };
    const mockData = { blockHash: 'abc123', blockIndex: 1, timestamp: 1771068600000, totalBlocks: 2 };
    const mockResponse = { status: 'fulfilled', data: mockData };

    service.enrollFile(mockRecord).subscribe((state) => {
      expect(state).toEqual(mockData);
    });

    const req = http.expectOne('/api/enroll');
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(mockRecord);
    req.flush(mockResponse);
  });

  it('should verify file', () => {
    const mockRecord = {
      fileName: 'document.pdf',
      fileHash: 'def456',
      fileSize: 5242880,
      mimeType: 'application/pdf',
      updatedAt: 1771068600000,
    };
    const mockData = {
      blockHash: 'abc123',
      blockIndex: 1,
      fileName: 'document.pdf',
      isValid: true,
      timestamp: 1771068600000,
    };
    const mockResponse = { status: 'fulfilled', data: mockData };

    service.verifyFile(mockRecord).subscribe((state) => {
      expect(state).toEqual(mockData);
    });

    const req = http.expectOne('/api/verify');
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(mockRecord);
    req.flush(mockResponse);
  });
});
