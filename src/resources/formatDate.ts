const formatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

export function formatDate(date: string): string {
  return formatter.format(new Date(`${date}T00:00:00Z`))
}
