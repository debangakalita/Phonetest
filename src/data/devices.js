/**
 * Device presets for the mobile browser simulator.
 * viewport = CSS logical resolution (device-independent pixels)
 * borderRadius = outer chassis corner radius in px
 */

export const devices = [
  {
    id: 'iphone-16-pro',
    name: 'iPhone 16 Pro',
    viewport: { width: 402, height: 874 },
    borderRadius: 62,
    screenRadius: 54,
    os: 'ios',
    cutout: 'dynamic-island',
  },
  {
    id: 'iphone-13',
    name: 'iPhone 13',
    viewport: { width: 390, height: 844 },
    borderRadius: 55,
    screenRadius: 47,
    os: 'ios',
    cutout: 'notch',
  },
  {
    id: 'galaxy-s24',
    name: 'Samsung Galaxy S24',
    viewport: { width: 360, height: 780 },
    borderRadius: 36,
    screenRadius: 28,
    os: 'android',
    cutout: 'punch-hole',
  },
  {
    id: 'oneplus-12',
    name: 'OnePlus 12',
    viewport: { width: 450, height: 980 },
    borderRadius: 40,
    screenRadius: 32,
    os: 'android',
    cutout: 'punch-hole',
  },
]

export function getDeviceById(id) {
  return devices.find((device) => device.id === id) ?? devices[0]
}
