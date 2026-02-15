import { ButtonComponent } from '@shared/components/button';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

describe('ButtonComponent', () => {
  it('should render', async () => {
    const { container } = await render(ButtonComponent);
    expect(container).toBeDefined();
  });

  it('should render with content', async () => {
    await render('<app-button>Okay</app-button>', {
      imports: [ButtonComponent],
    });

    const button = screen.getByRole('button', { name: 'Okay' });
    expect(button).toBeDefined();
  });

  it('should emit clicked output', async () => {
    const user = userEvent.setup();
    const clickedMock = vi.fn();

    const { container } = await render(ButtonComponent, {
      on: {
        clicked: clickedMock,
      },
    });

    const [button] = container.getElementsByClassName('app-button');
    await user.click(button);
    expect(clickedMock).toHaveBeenCalled();
  });
});
