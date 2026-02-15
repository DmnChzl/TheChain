import { NotificationComponent } from '@shared/components/notification';
import { NotificationService } from '@shared/services/notification.service';
import { render, screen } from '@testing-library/angular';

describe('NotificationComponent', () => {
  it('should render', async () => {
    const { container } = await render(NotificationComponent, {
      providers: [NotificationService],
    });

    expect(container).toBeDefined();
  });

  it('should render with message', async () => {
    const { fixture } = await render(NotificationComponent, {
      providers: [NotificationService],
    });

    const modalService = fixture.componentInstance.notificationService;
    modalService.show('Lorem ipsum dolor sit amet', 'info', 2500);
    fixture.detectChanges();

    expect(screen.getByText('Lorem ipsum dolor sit amet')).toBeInTheDocument();
  });
});
