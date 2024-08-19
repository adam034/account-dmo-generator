function extractLink(htmlStr: string) {
  const urlRegex =
    /https:\/\/dmo\.gameking\.com\/Sign\/SignUpWrite\.aspx\?vf=[\w\d]+/;
  const match = htmlStr.match(urlRegex);

  if (match) {
    return match[0];
  } else {
    return "not found";
  }
}

export function base64Decode(text: string, chunkSize: number) {
  // Regular expression to match base64-encoded part after "Content-Transfer-Encoding: base64"
  const base64Pattern = /Content-Transfer-Encoding:\s*base64[\r\n]+([\s\S]+)$/;

  // Match the base64 part from the text
  const match = text.match(base64Pattern);

  if (!match) {
    throw new Error("No base64-encoded string found.");
  }

  // Extract the base64 string
  const base64Str = match[1].replace(/\s+/g, ""); // Remove any whitespace/newlines

  // Split the base64 string into chunks
  const chunks = [];
  const length = base64Str.length;

  for (let i = 0; i < length; i += chunkSize) {
    const chunk = base64Str.slice(i, i + chunkSize);
    chunks.push(chunk);
  }

  const concateString = chunks.slice(2).join("");
  return extractLink(atob(concateString));
}
