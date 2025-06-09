export function getPlatformById(id: string): PlatformConfig | null {
  // Search through all categories to find the platform
  const allCategories = ["major", "gaming", "social", "professional", "alternative"]

  for (const category of allCategories) {
    const platforms = getPlatformsByCategory(category)
    const platform = platforms.find((p) => p.id === id)
    if (platform) {
      return platform
    }
  }

  return null
}
