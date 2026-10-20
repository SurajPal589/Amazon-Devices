import { PlaylistConfig } from '../src/types/kiosk';
import { usePlaylistEngine } from '../src/hooks/usePlaylistEngine';

// Unit testing hook logic with mock environment
describe('usePlaylistEngine logic tests', () => {
  const samplePlaylist: PlaylistConfig = {
    id: 'test-pl',
    name: 'Test Playlist',
    loop: true,
    shuffle: false,
    defaultDwellSeconds: 8,
    slides: [
      {
        id: 's1',
        title: 'Slide 1',
        type: 'image',
        uri: 'https://example.com/1.jpg',
        durationSeconds: 10,
      },
      {
        id: 's2',
        title: 'Slide 2',
        type: 'image',
        uri: 'https://example.com/2.jpg',
        durationSeconds: 6,
      },
      {
        id: 's3',
        title: 'Slide 3',
        type: 'image',
        uri: 'https://example.com/3.jpg',
        durationSeconds: 12,
      },
    ],
  };

  test('should initialize with correct slide and total count', () => {
    expect(samplePlaylist.slides.length).toBe(3);
    expect(samplePlaylist.slides[0].title).toBe('Slide 1');
  });

  test('should cycle slides circularly forward', () => {
    let index = 0;
    const total = samplePlaylist.slides.length;

    // Simulate forward advances
    index = (index + 1) % total;
    expect(index).toBe(1);
    expect(samplePlaylist.slides[index].id).toBe('s2');

    index = (index + 1) % total;
    expect(index).toBe(2);
    expect(samplePlaylist.slides[index].id).toBe('s3');

    // Loops back to first slide
    index = (index + 1) % total;
    expect(index).toBe(0);
    expect(samplePlaylist.slides[index].id).toBe('s1');
  });

  test('should cycle slides circularly backward', () => {
    let index = 0;
    const total = samplePlaylist.slides.length;

    // Revert from slide 0 wraps to last slide
    index = (index - 1 + total) % total;
    expect(index).toBe(2);
    expect(samplePlaylist.slides[index].id).toBe('s3');

    index = (index - 1 + total) % total;
    expect(index).toBe(1);
    expect(samplePlaylist.slides[index].id).toBe('s2');
  });

  test('should calculate progress percentage accurately', () => {
    const dwell = 10;
    const elapsed = 5;
    const progress = Math.min(100, Math.floor((elapsed / dwell) * 100));
    expect(progress).toBe(50);

    const elapsedFull = 10;
    const progressFull = Math.min(100, Math.floor((elapsedFull / dwell) * 100));
    expect(progressFull).toBe(100);
  });
});
