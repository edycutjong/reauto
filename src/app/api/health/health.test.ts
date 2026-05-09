import { describe, it, expect } from 'vitest';
import { GET } from './route';

describe('Health API', () => {
  it('should return health status', async () => {
    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.status).toBe('ok');
    expect(data.service).toBe('reauto-forensics');
    expect(data.timestamp).toBeDefined();
  });
});
