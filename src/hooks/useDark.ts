export function useDarkTheme() {
  const isDark = useDark()
  const toggleDark = useToggle(isDark)
  return {
    toggleDark,
  }
}
