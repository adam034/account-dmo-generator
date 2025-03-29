import ExcelJS from "exceljs";
import fs from "fs";

export async function exportToCsv(
  datas: {
    email: string | undefined;
    password_mail: string | undefined;
    user_id_game: string | undefined;
    password_game: string | undefined;
  }[],
  filePath: string
) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("account");

  worksheet.columns = [
    { header: "Email", key: "email", width: 10 },
    { header: "Password Email", key: "password_mail", width: 32 },
    { header: "User ID Game", key: "user_id_game", width: 32 },
    { header: "Password Game", key: "password_game", width: 32 },
    { header: "Link", key: "link", width: 10, outlineLevel: 1 },
  ];

  worksheet.addRows(datas);

  const csvData = (await workbook.csv.writeBuffer()) as Buffer;
  fs.writeFileSync(filePath, csvData);
}
