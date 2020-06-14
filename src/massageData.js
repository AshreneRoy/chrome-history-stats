function massageData(row) {
  return {
    id: row.id,
    url: row.url,
    fromVisit: row.from_visit
  }
}

export { massageData };