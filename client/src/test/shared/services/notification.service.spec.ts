import { TestBed } from '@angular/core/testing';
import { NotificationService } from '@shared/services/notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotificationService],
    });

    service = TestBed.inject(NotificationService);
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  it('should show info notification', () => {
    service.info('Lorem ipsum dolor sit amet');

    expect(service.notification()?.message).toEqual('Lorem ipsum dolor sit amet');
    expect(service.notification()?.type).toEqual('info');
  });

  it('should show success notification', () => {
    service.success('Lorem ipsum dolor sit amet');

    expect(service.notification()?.message).toEqual('Lorem ipsum dolor sit amet');
    expect(service.notification()?.type).toEqual('success');
  });

  it('should show danger notification', () => {
    service.danger('Lorem ipsum dolor sit amet');

    expect(service.notification()?.message).toEqual('Lorem ipsum dolor sit amet');
    expect(service.notification()?.type).toEqual('danger');
  });

  it('should show warning notification', () => {
    service.warning('Lorem ipsum dolor sit amet');

    expect(service.notification()?.message).toEqual('Lorem ipsum dolor sit amet');
    expect(service.notification()?.type).toEqual('warning');
  });
});
