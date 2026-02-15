import { ModalComponent } from '@shared/components/modal';
import { ModalService } from '@shared/services/modal.service';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

describe('ModalComponent', () => {
  it('should render', async () => {
    const { container } = await render(ModalComponent, {
      providers: [ModalService],
    });

    expect(container).toBeDefined();
  });

  it('should render with title and description', async () => {
    const { fixture } = await render(ModalComponent, {
      providers: [ModalService],
    });

    const modalService = fixture.componentInstance.modalService;
    modalService.open({
      title: 'Hello World!',
      description: 'Lorem ipsum dolor sit amet',
    });
    fixture.detectChanges();

    expect(screen.getByText('Hello World!')).toBeInTheDocument();
    expect(screen.getByText('Lorem ipsum dolor sit amet')).toBeInTheDocument();
  });

  it('should emit closed output', async () => {
    const user = userEvent.setup();
    const closedMock = vi.fn();

    const { fixture } = await render(ModalComponent, {
      providers: [ModalService],
      on: {
        closed: closedMock,
      },
    });

    const modalService = fixture.componentInstance.modalService;
    modalService.open();
    fixture.detectChanges();

    const button = screen.getByLabelText('Close Modal');
    await user.click(button);
    expect(closedMock).toHaveBeenCalled();
  });
});
