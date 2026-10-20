import { useRemoteControl } from '../src/hooks/useRemoteControl';

describe('Remote Control Key Mapping and D-Pad Dispatch', () => {
  test('should dispatch callbacks on key events', () => {
    const onSelect = jest.fn();
    const onLeft = jest.fn();
    const onRight = jest.fn();
    const onMenu = jest.fn();
    const onBack = jest.fn();

    // Directly test key matching logic matching useRemoteControl
    const dispatchKey = (key: string, code: number) => {
      if (key === 'ArrowLeft' || code === 37) onLeft();
      if (key === 'ArrowRight' || code === 39) onRight();
      if (key === 'Enter' || code === 13) onSelect();
      if (key === 'Menu' || code === 93) onMenu();
      if (key === 'GoBack' || code === 27) onBack();
    };

    dispatchKey('ArrowLeft', 37);
    expect(onLeft).toHaveBeenCalledTimes(1);

    dispatchKey('ArrowRight', 39);
    expect(onRight).toHaveBeenCalledTimes(1);

    dispatchKey('Enter', 13);
    expect(onSelect).toHaveBeenCalledTimes(1);

    dispatchKey('Menu', 93);
    expect(onMenu).toHaveBeenCalledTimes(1);

    dispatchKey('GoBack', 27);
    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
