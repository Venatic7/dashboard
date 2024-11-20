import Papa from 'papaparse'

export const parseCSV = async (filePath) => {
  const response = await fetch(filePath)
  const csvText = await response.text()
  
  return new Promise((resolve) => {
    Papa.parse(csvText, {
      header: true,
      complete: (results) => {
        resolve(results.data[0])
      }
    })
  })
}
