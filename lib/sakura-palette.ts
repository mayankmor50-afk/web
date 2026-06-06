/**
 * Cherry blossom palette — derived from the hero video asset.
 *
 * Structure (Somei-Yoshino / cinematic 3D tree):
 * - Canopy reads as soft emissive clusters: hot white core → magenta blush → fuchsia edge.
 * - Individual petals (when detached) are obovate with an emarginate (notched) apex,
 *   a faint central vein, and pale stamen warmth at the base.
 * - Trunk/branches are dark umber; blossoms are the only light source in frame.
 */
export const SAKURA = {
  /** Hot emissive core — brightest bloom in the canopy */
  core: '#FFF8FC',
  /** Open petal face — cream-white with pink flush */
  face: '#FCE8F0',
  /** Mid lamina — blush magenta (matches video mid-tones) */
  blush: '#E890B0',
  /** Edge catch / deeper cluster rim — saturated fuchsia */
  edge: '#C84878',
  /** Petal base where it meets the receptacle */
  base: '#D87898',
  /** Stamens / warm specular hint at petal root */
  stamen: '#F5E0B8',
  /** Ambient glow cast onto dark background */
  glow: 'rgba(232, 120, 160, 0.035)',
  glowHot: 'rgba(255, 245, 250, 0.022)',
} as const;
