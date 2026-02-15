import { IconComponent } from '@shared/components/icons/icon.component';
import { render } from '@testing-library/angular';

describe('IconComponent', () => {
  it('should render', async () => {
    const { container } = await render(IconComponent);
    expect(container).toBeDefined();
  });

  it('should render with icon name', async () => {
    const { container } = await render(IconComponent, {
      inputs: {
        name: 'cube',
      },
    });

    const element = container.querySelector('svg');
    expect(element).toBeInTheDocument();
  });
});
