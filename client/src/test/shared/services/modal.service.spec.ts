import { TestBed } from '@angular/core/testing';
import { ModalService } from '@shared/services/modal.service';

describe('ModalService', () => {
  let service: ModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ModalService],
    });

    service = TestBed.inject(ModalService);
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  it('should open modal', () => {
    service.open();

    expect(service.isOpen()).toBe(true);
    expect(service.config()).toEqual({
      isCloseable: true,
    });
  });

  it('should open modal with config', () => {
    service.open({
      title: 'Lorem Ipsum',
      description: 'Lorem ipsum dolor sit amet',
      isCloseable: false,
    });

    expect(service.isOpen()).toBe(true);
    expect(service.config()).toEqual({
      title: 'Lorem Ipsum',
      description: 'Lorem ipsum dolor sit amet',
      isCloseable: false,
    });
  });

  it('should close modal', () => {
    service.open();
    service.close();

    expect(service.isOpen()).toBe(false);
  });
});
