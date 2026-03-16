const BLOCKED_HOSTNAMES = new Set(["localhost", "localhost."]);

// Matches private/loopback/link-local IPv4 and IPv6 ranges
const PRIVATE_HOST_PATTERNS: RegExp[] = [
  /^127\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,           // 127.0.0.0/8 loopback
  /^0\.0\.0\.0$/,                                  // unspecified
  /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,              // 10.0.0.0/8
  /^172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}$/, // 172.16.0.0/12
  /^192\.168\.\d{1,3}\.\d{1,3}$/,                 // 192.168.0.0/16
  /^169\.254\.\d{1,3}\.\d{1,3}$/,                 // 169.254.0.0/16 link-local
  /^::1$/,                                         // IPv6 loopback
  /^::$/,                                          // IPv6 unspecified
  /^fe[89ab][0-9a-f]:/,                            // fe80::/10 link-local
  /^f[cd][0-9a-f]{2}:/,                            // fc00::/7 unique local
];

function isPrivateHostname(hostname: string): boolean {
  // url.hostname wraps IPv6 in brackets: "[::1]" — strip them before matching
  const host = hostname.startsWith("[") && hostname.endsWith("]")
    ? hostname.slice(1, -1).toLowerCase()
    : hostname.toLowerCase();

  return BLOCKED_HOSTNAMES.has(host) || PRIVATE_HOST_PATTERNS.some((re) => re.test(host));
}

export function safeExternalUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  try {
    const url = new URL(trimmed);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    if (isPrivateHostname(url.hostname)) return null;
    return url.toString();
  } catch {
    return null;
  }
}
