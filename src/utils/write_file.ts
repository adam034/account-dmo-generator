import ExcelJS from "exceljs";
import fs from "fs";

export async function exportToCsv(
  datas: { email: string; password: string; link: string }[],
  filePath: string
) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("account");

  worksheet.columns = [
    { header: "Email", key: "email", width: 10 },
    { header: "Password", key: "password", width: 32 },
    { header: "Link", key: "link", width: 10, outlineLevel: 1 },
  ];

  worksheet.addRows(datas);

  const csvData = (await workbook.csv.writeBuffer()) as Buffer;
  fs.writeFileSync(filePath, csvData);
}
