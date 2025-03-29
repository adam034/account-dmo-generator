export function generateAllDotAliases(
  baseEmail: string
): { main_email: string; alias_email: string }[] {
  const [username, domain] = baseEmail.split("@");

  const result = new Set();

  function generate(current: string, index: number) {
    if (index === username.length - 1) {
      result.add(current + "@" + domain);
      return;
    }

    // Tanpa titik
    generate(current + username[index + 1], index + 1);

    // Dengan titik jika bukan awal dan tidak ada titik sebelumnya
    if (index > 0 && username[index] !== ".") {
      generate(current + "." + username[index + 1], index + 1);
    }
  }

  generate(username[0], 0);

  return Array.from(result).map((alias) => ({
    main_email: baseEmail,
    alias_email: alias as string,
  }));
}
