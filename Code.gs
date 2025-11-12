// ====================== CONFIG ======================
const SPREADSHEET_ID = "16WO1PdxHZRGSsDM2JExB7cM6iI3MIkdqmGthp-3g-K8";
const SHEET_NAME = "Sheet1";
// ====================================================

function doGet(e) {
  return HtmlService.createTemplateFromFile("Index")
    .evaluate()
    .setTitle("Dashboard")
    .addMetaTag("viewport", "width=device-width, initial-scale=1");
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function getHeaders() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sh = SHEET_NAME ? ss.getSheetByName(SHEET_NAME) : ss.getSheets()[0];
  if (!sh) throw new Error("Sheet not found: " + SHEET_NAME);
  const values = sh.getDataRange().getValues();
  if (!values || values.length === 0) return [];
  const headers = values[0].map((h) =>
    h === null || h === undefined ? "" : String(h).trim()
  );
  Logger.log("Headers: %s", headers.join(", "));
  return headers;
}

function getSheetData() {
  // Force fresh data - clear cache first
  const cache = CacheService.getScriptCache();
  const cacheKey = "sheetData_v1";

  try {
    // Always get fresh data for debugging
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sh = SHEET_NAME ? ss.getSheetByName(SHEET_NAME) : ss.getSheets()[0];
    if (!sh) {
      throw new Error("Sheet not found: " + SHEET_NAME);
    }

    const values = sh.getDataRange().getValues();
    if (!values || values.length < 1) return [];

    const rawHeaders = values[0];
    const headers = rawHeaders.map((h) =>
      h === null || h === undefined ? "" : String(h).trim()
    );

    const rows = values.slice(1);
    const out = rows.map((row) => {
      const obj = {};
      headers.forEach((h, i) => {
        let v = row[i];
        if (v instanceof Date) {
          try {
            v = v.toISOString();
          } catch (e) {
            const tz = Session.getScriptTimeZone() || "UTC";
            v = Utilities.formatDate(v, tz, "yyyy-MM-dd'T'HH:mm:ss'Z'");
          }
        }
        if (v === null || v === undefined) {
          obj[h] = "";
        } else if (typeof v === "number") {
          obj[h] = v;
        } else {
          obj[h] = String(v).trim();
        }
      });
      return obj;
    });

    // Cache the fresh data
    try {
      cache.put(cacheKey, JSON.stringify(out), 60);
      Logger.log("✅ Fresh data cached. Rows: " + out.length);
    } catch (e) {
      Logger.log("Cache put failed: %s", e);
    }

    return out;
  } catch (e) {
    Logger.log("Error getting fresh sheet data: %s", e);

    // Fallback to cached data if available
    try {
      const cached = cache.get(cacheKey);
      if (cached) {
        Logger.log("⚠️ Using cached data due to error");
        return JSON.parse(cached);
      }
    } catch (cacheError) {
      Logger.log("Cache fallback also failed: %s", cacheError);
    }

    throw e;
  }
}

function getFilteredSheetData(fromDate, toDate) {
  try {
    Logger.log("=== Getting Filtered Sheet Data ===");
    Logger.log("Date range: " + fromDate + " to " + toDate);

    // Get all sheet data first
    const allData = getSheetData();
    if (!allData || allData.length === 0) {
      Logger.log("No data found in sheet");
      return [];
    }

    // Parse date range
    const startDate = new Date(fromDate);
    const endDate = new Date(toDate);
    
    // Set endDate to end of day
    endDate.setHours(23, 59, 59, 999);

    Logger.log("Parsed date range: " + startDate.toISOString() + " to " + endDate.toISOString());

    // Filter data by date range
    const filteredData = allData.filter(row => {
      const timestampField = row['Timestamp'] || row['timestamp'] || '';
      if (!timestampField) return false;

      const rowDate = tryParseDate(timestampField);
      if (!rowDate) return false;

      return rowDate >= startDate && rowDate <= endDate;
    });

    Logger.log("Filtered data: " + filteredData.length + " rows out of " + allData.length + " total rows");
    return filteredData;

  } catch (error) {
    Logger.log("❌ Error filtering sheet data: " + error.toString());
    Logger.log("Error stack: " + error.stack);
    throw error;
  }
}

function tryParseDate(v) {
  if (!v && v !== 0) return null;
  if (v instanceof Date) return v;
  const s = String(v).trim();
  let d = new Date(s);
  if (!isNaN(d.getTime())) return d;
  let m = s.match(
    /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})(?:\s+(\d{1,2}):(\d{2}):?(\d{0,2})?)?/
  );
  if (m) {
    const p1 = Number(m[1]),
      p2 = Number(m[2]),
      yyyy = Number(m[3]);
    let month, day;
    if (p1 > 12) {
      day = p1;
      month = p2 - 1;
    } else {
      month = p1 - 1;
      day = p2;
    }
    const hh = m[4] ? Number(m[4]) : 0;
    const mi = m[5] ? Number(m[5]) : 0;
    const ss = m[6] ? Number(m[6]) : 0;
    return new Date(yyyy, month, day, hh, mi, ss);
  }
  m = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (m) {
    const dd = Number(m[1]),
      mm = Number(m[2]) - 1,
      yyyy = Number(m[3]);
    return new Date(yyyy, mm, dd);
  }
  return null;
}

function formatTimeValue(v) {
  if (v === "" || v === null || v === undefined) return "";
  const tz = Session.getScriptTimeZone() || "UTC";

  if (typeof v === "number") {
    const secs = Math.round(v * 24 * 3600);
    const hh = Math.floor(secs / 3600) % 24;
    const mm = Math.floor((secs % 3600) / 60);
    const ss = secs % 60;
    const dt = new Date(1970, 0, 1, hh, mm, ss);
    return Utilities.formatDate(dt, tz, "hh:mm:ss a");
  }

  try {
    const d = new Date(String(v));
    if (!isNaN(d.getTime())) {
      if (d.getFullYear() < 1900) {
        const hh = d.getHours(),
          mm = d.getMinutes(),
          ss = d.getSeconds();
        const dt = new Date(1970, 0, 1, hh, mm, ss);
        return Utilities.formatDate(dt, tz, "hh:mm:ss a");
      } else {
        return Utilities.formatDate(d, tz, "hh:mm:ss a");
      }
    }
  } catch (e) {
    // ignore
  }
  return String(v);
}

function getLatestRowData() {
  const data = getSheetData();
  if (!data || data.length === 0) return {};
  return data[data.length - 1];
}

function getLatestRowByTimestamp(timestampHeader) {
  if (!timestampHeader) throw new Error("timestampHeader is required");
  const data = getSheetData();
  if (!data || data.length === 0) return {};

  let latest = null;
  let latestTime = -Infinity;

  data.forEach((row) => {
    const raw = row[timestampHeader];
    if (!raw && raw !== 0) return;
    let d = tryParseDate(raw);
    if (!d) return;
    const t = d.getTime();
    if (t > latestTime) {
      latestTime = t;
      latest = row;
    }
  });

  return latest || {};
}

function getLatestSummary() {
  // ใช้แถวล่าสุดในไฟล์เป็นหลัก แล้วถึงจะใช้ timestamp เป็นสำรอง
  const latest = getLatestRowData();
  if (!latest || Object.keys(latest).length === 0) {
    // ถ้าไม่มีข้อมูลจากแถวล่าสุด ให้ลองหาจาก timestamp
    const timestampHeader = "Timestamp";
    const timestampBased = getLatestRowByTimestamp(timestampHeader);
    if (timestampBased && Object.keys(timestampBased).length > 0) {
      return buildSummaryObject(timestampBased);
    }
    return {};
  }

  return buildSummaryObject(latest);
}

function buildSummaryObject(latest) {
  // Debug: log the latest row data
  Logger.log("Latest row data: %s", JSON.stringify(latest));
  Logger.log("Available keys: %s", Object.keys(latest).join(", "));

  return {
    timestamp: latest["Timestamp"] || latest["timestamp"] || "",
    temperature: latest["Temperature (°C)"] || latest["Temperature"] || "",
    cloudiness: latest["Cloudiness (%)"] || latest["Cloudiness"] || "",
    sunrise: formatTimeValue(latest["Sunrise"] || latest["sunrise"] || ""),
    sunset: formatTimeValue(latest["Sunset"] || latest["sunset"] || ""),
    luxA: latest["Lux_A (Control)"] || latest["Lux_A"] || latest["LuxA"] || "",
    luxB: latest["Lux_B (Monitor)"] || latest["Lux_B"] || latest["LuxB"] || "",
    voltage:
      latest["Solar_Voltage (V)"] ||
      latest["Solar Voltage"] ||
      latest["Voltage"] ||
      "",
    current:
      latest["Solar_Current (A)"] ||
      latest["Solar Current"] ||
      latest["Current"] ||
      "",
    power:
      latest["Solar_Power (W)"] ||
      latest["Solar Power"] ||
      latest["Power"] ||
      "",
    energy:
      latest["Solar_Energy (Wh)"] ||
      latest["Solar Energy"] ||
      latest["Energy"] ||
      "",
    motion:
      latest["Motion (PIR)"] || latest["Motion"] || latest["motion"] || "0",
    systemVoltage:
      latest["System_Voltage (V)"] ||
      latest["System Voltage"] ||
      latest["System_Voltage"] ||
      "",
    systemCurrent:
      latest["System_Current (A)"] ||
      latest["System Current"] ||
      latest["System_Current"] ||
      "",
    systemPower:
      latest["System_Power (W)"] ||
      latest["System Power"] ||
      latest["System_Power"] ||
      "",
    systemEnergy:
      latest["System_Energy (Wh)"] ||
      latest["System Energy"] ||
      latest["System_Energy"] ||
      "",
    relay: latest["Relay Status"] || latest["Relay"] || "off",
    bulb: latest["Bulb Status (INA219)"] || latest["Bulb Status"] || "",
    currentINA219:
      latest["INA219_Current (A)"] ||
      latest["INA219 Current"] ||
      latest["Current (INA219)"] ||
      "",
    anomaly:
      latest["Anomaly Status"] ||
      latest["Anomaly"] ||
      latest["anomaly"] ||
      "normal",
    solarDaily:
      latest["Solar_Daily_Wh"] ||
      latest["Solar Daily"] ||
      latest["Solar_Daily"] ||
      "",
    systemDaily:
      latest["System_Daily_Wh"] ||
      latest["System Daily"] ||
      latest["System_Daily"] ||
      "",
  };
}

function testGetHeaders() {
  const headers = getHeaders();
  Logger.log("Current sheet headers:");
  headers.forEach((header, index) => {
    Logger.log(`Column ${index + 1}: "${header}"`);
  });
  return headers;
}

function testGetSheetData() {
  const data = getSheetData();
  Logger.log("Rows returned: %s", data.length);
  if (data.length)
    Logger.log("First row keys: %s", Object.keys(data[0]).join(", "));
  return data;
}

function debugLatestRow() {
  try {
    Logger.log("=== Debug Latest Row Data ===");

    const allData = getSheetData();
    Logger.log("Total rows in sheet data: " + allData.length);

    if (allData.length > 0) {
      const lastRow = allData[allData.length - 1];
      Logger.log("Last row data: " + JSON.stringify(lastRow));

      // Show specific fields we're interested in
      Logger.log(
        "Temperature from last row: " +
          (lastRow["Temperature (°C)"] || "NOT FOUND")
      );
      Logger.log(
        "Cloudiness from last row: " +
          (lastRow["Cloudiness (%)"] || "NOT FOUND")
      );
      Logger.log(
        "Timestamp from last row: " + (lastRow["Timestamp"] || "NOT FOUND")
      );

      // Test latest summary
      const summary = getLatestSummary();
      Logger.log("Summary temperature: " + summary.temperature);
      Logger.log("Summary cloudiness: " + summary.cloudiness);
      Logger.log("Summary timestamp: " + summary.timestamp);
    }

    return {
      totalRows: allData.length,
      lastRowData: allData.length > 0 ? allData[allData.length - 1] : null,
      summary: getLatestSummary(),
    };
  } catch (error) {
    Logger.log("Error in debugLatestRow: " + error.toString());
    return { error: error.toString() };
  }
}

// Quick debug function that can be called from JavaScript
function getDebugInfo() {
  try {
    const allData = getSheetData();
    const totalRows = allData.length;
    let lastRowData = null;
    let summary = null;

    if (totalRows > 0) {
      lastRowData = allData[totalRows - 1];
      summary = getLatestSummary();
    }

    return {
      totalRows: totalRows,
      lastRowIndex: totalRows - 1,
      lastRowData: {
        timestamp: lastRowData ? lastRowData["Timestamp"] || "N/A" : "N/A",
        temperature: lastRowData
          ? lastRowData["Temperature (°C)"] || "N/A"
          : "N/A",
        cloudiness: lastRowData
          ? lastRowData["Cloudiness (%)"] || "N/A"
          : "N/A",
      },
      summary: {
        timestamp: summary ? summary.timestamp : "N/A",
        temperature: summary ? summary.temperature : "N/A",
        cloudiness: summary ? summary.cloudiness : "N/A",
      },
    };
  } catch (error) {
    return { error: error.toString() };
  }
}

// ====================== AUTO-REFRESH FUNCTIONS ======================
function getLatestRowCount() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sh = SHEET_NAME ? ss.getSheetByName(SHEET_NAME) : ss.getSheets()[0];
    if (!sh) {
      throw new Error("Sheet not found: " + SHEET_NAME);
    }

    const lastRow = sh.getLastRow();
    return {
      rowCount: lastRow,
      timestamp: new Date().toISOString(),
    };
  } catch (e) {
    Logger.log("getLatestRowCount error: %s", e);
    return {
      rowCount: 0,
      timestamp: new Date().toISOString(),
      error: e.toString(),
    };
  }
}

function checkForNewData(lastKnownRowCount = 0) {
  try {
    Logger.log("=== Checking for new data ===");
    Logger.log("Last known row count: " + lastKnownRowCount);

    const currentInfo = getLatestRowCount();
    const currentRowCount = currentInfo.rowCount;

    Logger.log("Current row count: " + currentRowCount);

    const hasNewData = currentRowCount > lastKnownRowCount;
    const newRowsCount = hasNewData ? currentRowCount - lastKnownRowCount : 0;

    Logger.log("Has new data: " + hasNewData);
    Logger.log("New rows count: " + newRowsCount);

    return {
      hasNewData: hasNewData,
      currentRowCount: currentRowCount,
      newRowsCount: newRowsCount,
      lastKnownRowCount: lastKnownRowCount,
      timestamp: new Date().toISOString(),
      status: "success",
    };
  } catch (e) {
    Logger.log("checkForNewData error: %s", e);
    return {
      hasNewData: false,
      currentRowCount: 0,
      newRowsCount: 0,
      lastKnownRowCount: lastKnownRowCount,
      timestamp: new Date().toISOString(),
      status: "error",
      error: e.toString(),
    };
  }
}

function getRealTimeStatus() {
  try {
    const currentInfo = getLatestRowCount();
    const latestSummary = getLatestSummary();
    const lastTimestamp = latestSummary.timestamp || "";

    // คำนวณเวลาที่ผ่านไปตั้งแต่ข้อมูลล่าสุด
    let minutesSinceLastUpdate = 0;
    if (lastTimestamp) {
      try {
        const lastTime = new Date(lastTimestamp);
        const now = new Date();
        minutesSinceLastUpdate = Math.floor((now - lastTime) / (1000 * 60));
      } catch (e) {
        Logger.log("Error calculating time since last update: " + e);
      }
    }

    return {
      currentRowCount: currentInfo.rowCount,
      lastDataTimestamp: lastTimestamp,
      minutesSinceLastUpdate: minutesSinceLastUpdate,
      isDataFresh: minutesSinceLastUpdate <= 10, // ถือว่าข้อมูลสดใหม่ถ้าไม่เกิน 10 นาที
      systemTime: new Date().toISOString(),
      status: "online",
    };
  } catch (e) {
    Logger.log("getRealTimeStatus error: %s", e);
    return {
      currentRowCount: 0,
      lastDataTimestamp: "",
      minutesSinceLastUpdate: 999,
      isDataFresh: false,
      systemTime: new Date().toISOString(),
      status: "error",
      error: e.toString(),
    };
  }
}

function testConnection() {
  try {
    Logger.log("=== Testing Connection ===");

    // Test 1: Check spreadsheet access
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    Logger.log("✅ Spreadsheet access: OK");

    // Test 2: Check sheet access
    const sh = ss.getSheetByName(SHEET_NAME);
    Logger.log("✅ Sheet access: OK");

    // Test 3: Check data range
    const values = sh.getDataRange().getValues();
    Logger.log("✅ Data rows: " + values.length);

    // Test 4: Check headers
    if (values.length > 0) {
      const headers = values[0];
      Logger.log("✅ Headers count: " + headers.length);
      Logger.log("✅ Headers: " + headers.join(", "));
    }

    // Test 5: Check latest summary
    const summary = getLatestSummary();
    Logger.log("✅ Latest summary: " + JSON.stringify(summary));

    return {
      status: "success",
      rows: values.length,
      headers: values.length > 0 ? values[0] : [],
      summary: summary,
    };
  } catch (error) {
    Logger.log("❌ Error: " + error.toString());
    return {
      status: "error",
      error: error.toString(),
    };
  }
}

function getDataSummaryWithCount() {
  try {
    const summary = getLatestSummary();
    const rowInfo = getLatestRowCount();

    return {
      ...summary,
      rowCount: rowInfo.rowCount,
      lastChecked: rowInfo.timestamp,
    };
  } catch (e) {
    Logger.log("getDataSummaryWithCount error: %s", e);
    return {
      timestamp: new Date().toISOString(),
      error: e.toString(),
      rowCount: 0,
    };
  }
}

// ====================== NOTIFICATION FUNCTIONS ======================
function saveNotificationToSheet(notificationData) {
  try {
    Logger.log("=== Saving Notification to Sheet2 ===");
    Logger.log("Notification data: " + JSON.stringify(notificationData));

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let notificationSheet = ss.getSheetByName("sheet2");

    // สร้าง sheet2 ถ้ายังไม่มี
    if (!notificationSheet) {
      Logger.log("Creating new sheet2...");
      notificationSheet = ss.insertSheet("sheet2");

      // เพิ่ม headers สำหรับ sheet2
      const headers = [
        "Timestamp",
        "ID",
        "Title",
        "Message",
        "Type",
        "Icon",
        "Acknowledged",
        "Created_Date",
      ];

      notificationSheet.getRange(1, 1, 1, headers.length).setValues([headers]);

      // จัดรูปแบบ headers
      const headerRange = notificationSheet.getRange(1, 1, 1, headers.length);
      headerRange
        .setFontWeight("bold")
        .setBackground("#4285f4")
        .setFontColor("#ffffff")
        .setBorder(true, true, true, true, true, true);

      // กำหนดความกว้างของคอลัมน์
      notificationSheet.setColumnWidth(1, 150); // Timestamp
      notificationSheet.setColumnWidth(2, 100); // ID
      notificationSheet.setColumnWidth(3, 200); // Title
      notificationSheet.setColumnWidth(4, 300); // Message
      notificationSheet.setColumnWidth(5, 100); // Type
      notificationSheet.setColumnWidth(6, 50); // Icon
      notificationSheet.setColumnWidth(7, 100); // Acknowledged
      notificationSheet.setColumnWidth(8, 150); // Created_Date

      Logger.log("✅ Created new sheet2 for notifications with headers");
    }

    // เตรียมข้อมูลสำหรับบันทึก
    const timestamp = new Date(notificationData.timestamp || new Date());
    const rowData = [
      timestamp, // Timestamp
      notificationData.id || Date.now(), // ID
      notificationData.title || "No Title", // Title
      notificationData.message || "No Message", // Message
      notificationData.type || "system", // Type
      notificationData.icon || "🔔", // Icon
      notificationData.acknowledged ? "Yes" : "No", // Acknowledged
      new Date(), // Created_Date
    ];

    // เพิ่มข้อมูลในแถวใหม่
    notificationSheet.appendRow(rowData);

    // จัดรูปแบบแถวที่เพิ่มใหม่
    const lastRow = notificationSheet.getLastRow();
    const dataRange = notificationSheet.getRange(lastRow, 1, 1, rowData.length);

    // กำหนดสีตามประเภทการแจ้งเตือน
    let backgroundColor = "#ffffff";
    const notificationType = notificationData.type || "system";

    switch (notificationType) {
      case "anomaly":
      case "error":
        backgroundColor = "#fee2e2"; // Light red
        break;
      case "warning":
        backgroundColor = "#fef3c7"; // Light yellow
        break;
      case "success":
        backgroundColor = "#d1fae5"; // Light green
        break;
      case "system":
      default:
        backgroundColor = "#e0f2fe"; // Light blue
        break;
    }

    dataRange
      .setBackground(backgroundColor)
      .setBorder(
        true,
        true,
        true,
        true,
        true,
        true,
        "#cccccc",
        SpreadsheetApp.BorderStyle.SOLID
      );

    Logger.log("✅ Notification saved to sheet2: " + notificationData.title);
    Logger.log("Row added at: " + lastRow);

    return {
      status: "success",
      message: "Notification saved successfully to sheet2",
      sheetName: "sheet2",
      rowNumber: lastRow,
      timestamp: timestamp.toISOString(),
    };
  } catch (error) {
    Logger.log("❌ Error saving notification to sheet: " + error.toString());
    Logger.log("Error stack: " + error.stack);

    return {
      status: "error",
      message: error.toString(),
      error: error.stack,
    };
  }
}

function getNotificationHistory() {
  try {
    Logger.log("=== Getting Notification History ===");

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const notificationSheet = ss.getSheetByName("sheet2");

    if (!notificationSheet) {
      Logger.log("Sheet2 not found, returning empty array");
      return [];
    }

    const values = notificationSheet.getDataRange().getValues();
    if (!values || values.length <= 1) {
      Logger.log("No data found in sheet2 (only headers or empty)");
      return [];
    }

    const headers = values[0];
    const rows = values.slice(1);

    Logger.log("Found " + rows.length + " notification records");
    Logger.log("Headers: " + headers.join(", "));

    // แปลงข้อมูลเป็น object array
    const notifications = rows.map((row, index) => {
      const obj = {};
      headers.forEach((header, columnIndex) => {
        let value = row[columnIndex];

        // แปลงวันที่เป็น ISO string
        if (value instanceof Date) {
          value = value.toISOString();
        } else if (value === null || value === undefined) {
          value = "";
        } else {
          value = String(value);
        }

        obj[header] = value;
      });

      Logger.log("Notification " + (index + 1) + ": " + JSON.stringify(obj));
      return obj;
    });

    // เรียงลำดับจากใหม่ไปเก่า (ตาม Timestamp)
    notifications.sort((a, b) => {
      const dateA = new Date(a.Timestamp || a.timestamp || 0);
      const dateB = new Date(b.Timestamp || b.timestamp || 0);
      return dateB.getTime() - dateA.getTime();
    });

    Logger.log(
      "✅ Retrieved " + notifications.length + " notifications from sheet2"
    );
    return notifications;
  } catch (error) {
    Logger.log("❌ Error getting notification history: " + error.toString());
    Logger.log("Error stack: " + error.stack);
    return [];
  }
}

function clearNotificationSheet() {
  try {
    Logger.log("=== Clearing Notification Sheet ===");

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const notificationSheet = ss.getSheetByName("sheet2");

    if (!notificationSheet) {
      Logger.log("No sheet2 found to clear");
      return {
        status: "success",
        message: "No notification sheet found to clear",
      };
    }

    // ลบข้อมูลทั้งหมดยกเว้น header (แถวแรก)
    const lastRow = notificationSheet.getLastRow();
    if (lastRow > 1) {
      notificationSheet.deleteRows(2, lastRow - 1);
      Logger.log("Deleted " + (lastRow - 1) + " notification records");
    } else {
      Logger.log("No data rows to delete (only headers)");
    }

    Logger.log("✅ Cleared all notifications from sheet2");

    return {
      status: "success",
      message: "Notification history cleared successfully",
      deletedRows: Math.max(0, lastRow - 1),
    };
  } catch (error) {
    Logger.log("❌ Error clearing notification sheet: " + error.toString());
    Logger.log("Error stack: " + error.stack);

    return {
      status: "error",
      message: error.toString(),
      error: error.stack,
    };
  }
}
