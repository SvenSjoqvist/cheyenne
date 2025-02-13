export interface ShopifyErrorLike {
    status: number;
    message: string; // Changed from `Error` to `string` for better usability
    cause?: Error; // Made optional for flexibility
}

export function isObject(object: unknown): object is Record<string, unknown> {
    return typeof object === 'object' && object !== null && !Array.isArray(object);
}

export function isShopifyError(error: unknown): error is ShopifyErrorLike {
    // Check if the error is an object and matches the ShopifyErrorLike structure
    if (!isObject(error)) return false;

    return (
        typeof error.status === 'number' &&
        typeof error.message === 'string' &&
        (error.cause === undefined || error.cause instanceof Error)
    );
}