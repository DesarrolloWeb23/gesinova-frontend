import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export function exportToExcel<T extends object>(data: T[], fileName: string) {
    if (!data || data.length === 0) {
        console.warn("No hay datos para exportar");
        return;
    }

    // Crea la hoja de trabajo
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Crea el libro (workbook)
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte");

    // Convierte a binario
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

    // Crea el archivo Blob
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

    // Descarga
    saveAs(blob, `${fileName}.xlsx`);
}
