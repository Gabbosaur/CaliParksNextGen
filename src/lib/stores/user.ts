/**
 * User Store
 *
 * Current user state on the kiosk (guest or authenticated).
 */

import { writable } from 'svelte/store';
import type { KioskUserState } from '@auth/types';

export const userState = writable<KioskUserState>({ type: 'guest' });
