import fs from 'file-saver';
import XLSX from 'xlsx';

//导出 excel文件

//该方法需要传 3个参数，分别是：json格式的数据，表头对象，文件名

export function xlsx(json, fields, filename = '.xlsx') {
    //导出 xlsx
    json.forEach(item => {
        for (let i in item) {
            // eslint-disable-next-line no-prototype-builtins
            if (fields.hasOwnProperty(i)) {
                item[fields[i]] = item[i];
            }

            //删除原先的对象属性
            delete item[i];
        }
    });

    // excel的文件名称
    let sheetName = filename;
    //工作簿对象包含一个 SheetNames数组，以及一个表对象映射表名称到表对象
    // XLSX.utils.book_new()
    let wb = XLSX.utils.book_new();
    //将 JS 对象数组转化为工作表
    let ws = XLSX.utils.json_to_sheet(json, {
        header: Object.values(fields)
    });
    wb.SheetNames.push(sheetName);
    wb.Sheets[sheetName] = ws;

    //设置表格样式
    const defaultCellStyle = {
        font: {
            name: 'Verdana',
            sz: 13,
            color: 'FF00FF88'
        },
        fill: {
            fgColor: {
                rgb: "FFFFAA00"
            }
        },
    }


    let wopts = {
        bookType: 'xlsx',
        bookSST: false,
        type: "binary",
        cellStyles: true,
        defaultCellStyle: defaultCellStyle,
        showGridLines: false,
    }

    //写入的样式
    let wbout = XLSX.write(wb, wopts);
    let blob = new Blob([s2ab(wbout)], {
        type: "application/octet-stream"
    });
    fs.saveAs(blob, filename + '.xlsx');
}


function s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i !== s.length; ++i) {
        view[i] = s.charCodeAt(i) & 0xFF;
    }
    return buf;
}