export default function extractNameAfterLastDash(url: string): string {
  const lastSegment = url.substring(url.lastIndexOf("/") + 1); 
  const dashIndex = lastSegment.lastIndexOf("-");

  if (dashIndex !== -1) {
    return lastSegment.substring(dashIndex + 1);
  }

  return lastSegment; 
}
