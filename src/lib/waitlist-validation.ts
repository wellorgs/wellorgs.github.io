/** Browser-safe field checks shared by the waitlist form and the server function. */

/** Returns the cleaned name, or null if it does not look like a real name. */
export function cleanName(raw: string): string | null {
  const v = raw.trim().replace(/\s+/g, " ");
  if (!/^[\p{L}\p{M}][\p{L}\p{M} .'’-]{1,79}$/u.test(v)) return null;
  if (/(.)\1{4,}/u.test(v)) return null; // "aaaaa"
  return v;
}

/** Returns the phone as "+<digits>", or null if it cannot be a real number. Blank is handled by the caller. */
export function cleanPhone(raw: string): string | null {
  const v = raw.trim();
  if (!/^\+?[\d\s().-]{7,20}$/.test(v)) return null;
  let d = v.replace(/\D/g, "");
  if (!v.startsWith("+")) {
    // ponytail: bare numbers are assumed Indian (10 digits, or 0 + 10). Other countries must type the +code.
    if (d.length === 10) d = `91${d}`;
    else if (d.length === 11 && d.startsWith("0")) d = `91${d.slice(1)}`;
    else if (!(d.length === 12 && d.startsWith("91"))) return null;
  }
  if (d.length < 8 || d.length > 15) return null;
  if (/(\d)\1{6,}/.test(d)) return null; // 0000000, 1111111...
  if (/0123456789|1234567890|9876543210/.test(d)) return null;
  if (d.startsWith("91") && !/^[6-9]\d{9}$/.test(d.slice(2))) return null;
  return `+${d}`;
}
