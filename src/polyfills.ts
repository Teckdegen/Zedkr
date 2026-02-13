import { Buffer } from 'buffer';

if (typeof window !== 'undefined') {
    (window as any).global = window;
    (window as any).Buffer = Buffer;
    (window as any).process = (window as any).process || {};
    (window as any).process.env = (window as any).process.env || {};
    (window as any).process.browser = true;
    (window as any).globalThis = (window as any).globalThis || window;
}
