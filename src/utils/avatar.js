import multiavatar from '@multiavatar/multiavatar';

export function generateAvatar(name) {
  const svgCode = multiavatar(name);
  return `data:image/svg+xml;base64,${btoa(svgCode)}`;
}