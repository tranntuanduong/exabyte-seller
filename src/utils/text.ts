export const truncateEmail = (email: string) => {
  const atIndex = email.indexOf("@");
  if (atIndex >= 0) {
    const prefix = email.substring(0, atIndex);
    const truncatedPrefix = prefix.substring(0, Math.min(10, prefix.length)); // Change 10 to your desired length
    const domain = email.substring(atIndex);
    return truncatedPrefix + "...." + domain;
  }
  return email; // Return the original email if '@' is not found
};
