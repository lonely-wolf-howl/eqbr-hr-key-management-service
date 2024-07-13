import { SetMetadata } from '@nestjs/common';

export const SKIP_TIMEOUT = 'skipTimeout';
export const SkipTimeout = () => SetMetadata(SKIP_TIMEOUT, true);
