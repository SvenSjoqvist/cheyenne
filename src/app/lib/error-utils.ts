export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export function handleApiError(
  error: unknown,
  context: string
): ApiResponse<never> {
  console.error(`Error in ${context}:`, error);

  if (error instanceof Error) {
    return {
      success: false,
      error: error.message,
    };
  }

  return {
    success: false,
    error: `An unexpected error occurred in ${context}`,
  };
}

export function createSuccessResponse<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data,
  };
}
