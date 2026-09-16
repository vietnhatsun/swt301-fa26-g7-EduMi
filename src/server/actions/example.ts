'use server';

import { ApiResponse } from '@/types';

export async function fetchServerStatus(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
  return {
    success: true,
    data: {
      status: 'operational',
      timestamp: new Date().toISOString(),
    },
  };
}
