import * as XLSX from 'xlsx';
import * as fs from 'fs';

const filePath = 'Account Requirement Document.xlsx';

if (fs.existsSync(filePath)) {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Read the first row (headers)
    const range = XLSX.utils.decode_range(sheet['!ref']);
    const headers = [];
    for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = { c: C, r: range.s.r };
        const cellRef = XLSX.utils.encode_cell(cellAddress);
        const cell = sheet[cellRef];
        if (cell && cell.v) {
            headers.push(cell.v);
        }
    }

    console.log('Headers found in the Excel file:');
    console.log(JSON.stringify(headers, null, 2));

    // Also print first few rows to see data types/examples if needed, 
    // but headers should be enough for now as per user request.
} else {
    console.error(`File not found: ${filePath}`);
}
