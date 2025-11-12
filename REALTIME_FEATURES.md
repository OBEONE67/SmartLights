# Smart Lights Real-Time Features Documentation# ฟีเจอร์ Real-Time Monitoring System

**คู่มือฟีเจอร์ Real-Time ระบบ Smart Lights Dashboard** ## ✨ ฟีเจอร์ใหม่ที่เพิ่มเข้ามา

**วันที่อัปเดต**: 12 พฤศจิกายน 2025

**เวอร์ชัน**: 2.0### 🔄 Auto-Refresh System

---- **ตรวจสอบข้อมูลใหม่**: ทุก 30 วินาที ระบบจะตรวจสอบว่ามีข้อมูลใหม่ใน Google Sheet หรือไม่

- **การแจ้งเตือนแบบ Real-time**: จะแจ้งเตือนทันทีเมื่อมีข้อมูลใหม่เข้ามาใน Sheet

## 🚀 ภาพรวมฟีเจอร์ Real-Time- **การ Refresh อัตโนมัติ**: Dashboard จะอัปเดตข้อมูลอัตโนมัติเมื่อพบข้อมูลใหม่

ระบบ Smart Lights Dashboard มีความสามารถในการติดตามและอัปเดตข้อมูลแบบ Real-time จาก Google Sheets โดยไม่ต้องรีเฟรชหน้าเว็บด้วยตนเอง### 📊 Row Count Monitoring

### **🎯 วัตถุประสงค์หลัก**- **ติดตามจำนวนแถว**: ระบบจะจดจำจำนวนแถวล่าสุดใน Sheet1

- ติดตามข้อมูลเซ็นเซอร์แบบ Real-time- **ตรวจจับข้อมูลใหม่**: เมื่อจำนวนแถวเพิ่มขึ้น = มีข้อมูลใหม่

- แจ้งเตือนเมื่อมีข้อมูลใหม่หรือความผิดปกติ- **แสดงสถานะ**: Refresh indicator จะแสดงจำนวนแถวปัจจุบัน

- อัปเดต Dashboard อัตโนมัติ

- ตรวจจับปัญหาการเชื่อมต่อ### ⚡ Real-Time Status Check

---- **สถานะข้อมูล**: ตรวจสอบว่าข้อมูลล่าสุดสดใหม่หรือไม่ (ไม่เกิน 10 นาที)

- **การเตือนข้อมูลเก่า**: แจ้งเตือนถ้าข้อมูลล่าสุดเก่ากว่า 15 นาที

## ⚡ ฟีเจอร์ Real-Time หลัก- **สถานะการเชื่อมต่อ**: แสดงสถานะการเชื่อมต่อกับ Google Sheet

### **1. 🔄 Auto-Refresh System**## 🎛️ การใช้งาน

#### **การทำงาน**### การควบคุม Auto-Refresh

- ตรวจสอบข้อมูลใหม่ทุก 30 วินาที (ปรับได้)

- เปรียบเทียบจำนวนแถวใน Google Sheets1. **เปิด/ปิด Auto-refresh**: คลิกที่ refresh indicator ที่มุมขวาล่าง

- อัปเดต Dashboard อัตโนมัติเมื่อพบข้อมูลใหม่2. **Manual Refresh**: คลิกปุ่ม "Manual Refresh" ที่หน้า Dashboard

- ประหยัด API calls ด้วยการตรวจสอบแบบ Smart3. **ดูสถานะ**: ดูสถานะ auto-refresh และเวลาอัปเดตล่าสุดที่ refresh indicator

#### **การใช้งาน**### การแจ้งเตือน

````javascript

// การควบคุม Auto-Refresh- **ข้อมูลใหม่**: แสดงการแจ้งเตือนเมื่อมีข้อมูลใหม่ (สีเขียว)

function toggleAutoRefresh() {- **ข้อมูลเก่า**: แสดงคำเตือนเมื่อข้อมูลเก่า (สีเหลือง)

    isAutoRefreshEnabled = !isAutoRefreshEnabled;- **ข้อผิดพลาด**: แสดงข้อผิดพลาดการเชื่อมต่อ (สีแดง)

    updateRefreshIndicator();

    ### Refresh Indicator

    if (isAutoRefreshEnabled) {

        startAutoRefresh();```

    } else {🟢 Auto-refresh: ON (245 rows) Last: 14:30

        stopAutoRefresh();```

    }

}- **จุดสี**: เขียว = เปิด, เทา = ปิด

```- **จำนวนแถว**: แสดงจำนวนข้อมูลปัจจุบันใน Sheet

- **เวลาล่าสุด**: เวลาที่ตรวจสอบครั้งล่าสุด

#### **การปรับค่า**

```javascript## 🔧 ฟังก์ชันใหม่ใน Code.gs

// ปรับช่วงเวลาการตรวจสอบ

let refreshIntervalSeconds = 30;  // 30 วินาที### 1. checkForNewData(lastKnownRowCount)

let refreshIntervalSeconds = 60;  // 1 นาที

let refreshIntervalSeconds = 300; // 5 นาที```javascript

```// ตรวจสอบว่ามีข้อมูลใหม่หรือไม่โดยเปรียบเทียบจำนวนแถว

````

### **2. 📊 Smart Data Detection**

### 2. getRealTimeStatus()

#### **การตรวจจับข้อมูลใหม่**

`javascript`javascript

// ฟังก์ชันตรวจสอบข้อมูลใหม่// ได้ข้อมูลสถานะแบบ real-time รวมทั้งความสดใหม่ของข้อมูล

async function checkForNewData() {```

    try {

        const response = await fetch(`${SCRIPT_URL}?action=getRowCount`);### 3. getLatestRowCount()

        const data = await response.json();

        ```javascript

        if (data.rowCount > lastKnownRowCount) {// ได้จำนวนแถวปัจจุบันใน Sheet (ปรับปรุงแล้ว)

            // พบข้อมูลใหม่```

            showNotification('success', 'ข้อมูลใหม่', 'มีข้อมูลใหม่เข้ามาแล้ว');

            loadDashboard(); // โหลดข้อมูลใหม่## 🚨 การตรวจจับ Anomaly

            lastKnownRowCount = data.rowCount;

        }- **ตรวจสอบทุกครั้ง**: ตรวจสอบค่า Anomaly Status ทุกครั้งที่ refresh

        - **แสดง Popup**: แสดง popup แจ้งเตือนเมื่อพบ anomaly

        updateRefreshIndicator(data);- **Indicator**: แสดงจำนวน anomaly ที่มุมขวาบน



    } catch (error) {## 🎯 ประโยชน์

        console.error('Error checking for new data:', error);

        showNotification('error', 'ข้อผิดพลาด', 'ไม่สามารถตรวจสอบข้อมูลใหม่ได้');1. **ไม่ต้อง Refresh ด้วยตัวเอง**: ระบบจะอัปเดตอัตโนมัติ

    }2. **ได้ข้อมูลล่าสุดเสมอ**: ไม่เสี่ยงดูข้อมูลเก่า

}3. **ประหยัดเวลา**: ไม่ต้องคอยตรวจสอบ Sheet ด้วยตัวเอง

````4. **แจ้งเตือนทันที**: รู้ทันทีเมื่อมีข้อมูลใหม่หรือปัญหา

5. **ตรวจจับปัญหา**: แจ้งเตือนเมื่อข้อมูลหยุดอัปเดต

#### **การตรวจสอบความสดใหม่ของข้อมูล**

```javascript## ⚙️ การปรับแต่ง

// ตรวจสอบว่าข้อมูลล่าสุดสดใหม่หรือไม่

function checkDataFreshness(lastTimestamp) {### เปลี่ยนช่วงเวลา Refresh

    const now = new Date();

    const lastUpdate = new Date(lastTimestamp);```javascript

    const minutesDiff = (now - lastUpdate) / (1000 * 60);// ใน HTML ปรับตัวแปร refreshIntervalSeconds

    let refreshIntervalSeconds = 30; // ปรับเป็น 60 สำหรับ 1 นาที

    if (minutesDiff > 15) {```

        showNotification('warning', 'ข้อมูลเก่า',

            `ข้อมูลล่าสุดเก่า ${Math.round(minutesDiff)} นาทีแล้ว`);### เปลี่ยนเกณฑ์ข้อมูลสดใหม่

    }

    ```javascript

    return minutesDiff <= 10; // ข้อมูลสดใหม่ถ้าไม่เกิน 10 นาที// ใน Code.gs ปรับเงื่อนไขใน getRealTimeStatus()

}isDataFresh: minutesSinceLastUpdate <= 10; // เปลี่ยนจาก 10 เป็น 15 นาที

````

### **3. 🚨 Anomaly Detection Real-Time**## 🔍 การแก้ไขปัญหา

#### **การตรวจจับความผิดปกติ**### ถ้า Auto-refresh ไม่ทำงาน

```javascript

// ตรวจสอบ Anomaly Status แบบ Real-time1. ตรวจสอบว่า refresh indicator แสดงสถานะ "ON"

function checkAnomalies(data) {2. เปิด Console (F12) เพื่อดู error messages

    const anomalies = [];3. ลอง Manual Refresh เพื่อทดสอบการเชื่อมต่อ



    // ตรวจสอบแรงดันผิดปกติ### ถ้าข้อมูลไม่อัปเดต

    if (data.voltage > 28 || data.voltage < 10) {

        anomalies.push({1. ตรวจสอบใน Console ว่ามี error หรือไม่

            type: 'voltage',2. ตรวจสอบว่า SPREADSHEET_ID และ SHEET_NAME ถูกต้อง

            message: `แรงดันผิดปกติ: ${data.voltage}V`,3. ตรวจสอบ permissions ของ Google Sheet

            severity: data.voltage > 28 ? 'critical' : 'warning'

        });### ถ้าแจ้งเตือนมากเกินไป

    }

    1. ปรับเกณฑ์การแจ้งเตือนใน checkForNewData()

    // ตรวจสอบกระแสผิดปกติ  2. เปลี่ยนช่วงเวลา refresh ให้นานขึ้น

    if (data.current > 4.5) {

        anomalies.push({---

            type: 'current',

            message: `กระแสสูง: ${data.current}A`,**อัปเดต**: พฤศจิกายน 2025 - เพิ่มระบบ Real-time Monitoring

            severity: 'warning'
        });
    }

    // ตรวจสอบอุณหภูมิ
    if (data.temperature > 50) {
        anomalies.push({
            type: 'temperature',
            message: `อุณหภูมิสูง: ${data.temperature}°C`,
            severity: 'warning'
        });
    }

    // แสดง Anomaly Popup ถ้าพบ
    if (anomalies.length > 0) {
        showAnomalyPopup(anomalies);
        updateAnomalyIndicator(anomalies.length);
    }

    return anomalies;
}
```

### **4. 📱 Enhanced Notification System**

#### **ประเภทการแจ้งเตือน**

```javascript
const NOTIFICATION_TYPES = {
  SUCCESS: { icon: "✅", color: "#10b981" },
  WARNING: { icon: "⚠️", color: "#f59e0b" },
  ERROR: { icon: "❌", color: "#ef4444" },
  INFO: { icon: "ℹ️", color: "#3b82f6" },
  ANOMALY: { icon: "🚨", color: "#dc2626" },
};
```

#### **การแจ้งเตือนขั้นสูง**

```javascript
// ฟังก์ชันแจ้งเตือนแบบ Advanced
function showNotification(type, title, message, duration = 5000) {
  const notification = document.getElementById("notification");
  const notificationType = NOTIFICATION_TYPES[type.toUpperCase()];

  // อัปเดตเนื้อหา
  document.getElementById("notificationIcon").textContent =
    notificationType.icon;
  document.getElementById("notificationTitleText").textContent = title;
  document.getElementById("notificationMessage").textContent = message;

  // อัปเดตสี
  notification.style.borderLeftColor = notificationType.color;

  // แสดงการแจ้งเตือน
  notification.classList.add("show");

  // ซ่อนอัตโนมัติ
  setTimeout(() => {
    notification.classList.remove("show");
  }, duration);

  // บันทึกลงประวัติ
  addNotificationToHistory(type, title, message);
}
```

### **5. 🎛️ Interactive Refresh Indicator**

#### **Enhanced Refresh Indicator**

```html
<!-- Refresh Indicator Structure -->
<div class="refresh-indicator" id="refreshIndicator">
  <div class="status-dot" id="statusDot"></div>
  <span class="refresh-icon" id="refreshIcon">🔄</span>
  <span id="refreshStatus">Auto-refresh: ON</span>
  <span id="intervalStatus">30s</span>
  <span id="rowCount">(-- rows)</span>
  <span id="lastUpdate">Last: --:--</span>
</div>
```

#### **การควบคุมแบบ Interactive**

```javascript
// Left-click: Toggle Auto-refresh
document
  .getElementById("refreshIndicator")
  .addEventListener("click", function (e) {
    if (e.button === 0) {
      // Left click
      toggleAutoRefresh();
    }
  });

// Right-click: Change Interval
document
  .getElementById("refreshIndicator")
  .addEventListener("contextmenu", function (e) {
    e.preventDefault();
    showIntervalMenu();
  });
```

---

## 🔧 การตั้งค่าและปรับแต่ง

### **การปรับ Refresh Interval**

```javascript
// แสดงเมนูเลือกช่วงเวลา
function showIntervalMenu() {
  const intervals = [
    { seconds: 15, label: "15 วินาที" },
    { seconds: 30, label: "30 วินาที" },
    { seconds: 60, label: "1 นาที" },
    { seconds: 120, label: "2 นาที" },
    { seconds: 300, label: "5 นาที" },
  ];

  const menu = intervals
    .map((interval, index) => `${index + 1}. ${interval.label}`)
    .join("\n");

  const choice = prompt(`เลือกช่วงเวลา Auto-refresh:\n${menu}`, "2");

  if (choice && choice >= 1 && choice <= intervals.length) {
    const selectedInterval = intervals[choice - 1];
    setRefreshInterval(selectedInterval.seconds);
  }
}
```

### **การปรับแต่งประสิทธิภาพ**

```javascript
// การปรับแต่งประสิทธิภาพ
const PERFORMANCE_SETTINGS = {
  // ลดการเรียก API เมื่อไม่มี focus
  pauseWhenInactive: true,

  // ลด refresh rate เมื่อข้อมูลไม่เปลี่ยนแปลง
  adaptiveRefresh: true,

  // จำกัดจำนวนการแจ้งเตือน
  maxNotificationsPerMinute: 5,

  // Cache ข้อมูลเพื่อลด API calls
  enableCaching: true,
  cacheTimeout: 60000, // 1 นาที
};
```

---

## 📊 Google Apps Script Integration

### **getRealTimeStatus() Function**

```javascript
// Google Apps Script Function
function getRealTimeStatus() {
  try {
    const sheet =
      SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    const lastRow = sheet.getLastRow();

    if (lastRow <= 1) {
      return {
        success: false,
        message: "No data available",
        rowCount: 0,
      };
    }

    // ดึงข้อมูลแถวล่าสุด
    const lastRowData = sheet
      .getRange(lastRow, 1, 1, sheet.getLastColumn())
      .getValues()[0];
    const headers = sheet
      .getRange(1, 1, 1, sheet.getLastColumn())
      .getValues()[0];

    // สร้าง object ข้อมูล
    const data = {};
    headers.forEach((header, index) => {
      data[header] = lastRowData[index];
    });

    // ตรวจสอบความสดใหม่
    const timestamp = new Date(data["Timestamp"]);
    const now = new Date();
    const minutesDiff = (now - timestamp) / (1000 * 60);

    return {
      success: true,
      data: data,
      rowCount: lastRow - 1, // ลบ header
      lastUpdate: timestamp,
      isDataFresh: minutesDiff <= 10,
      minutesSinceUpdate: Math.round(minutesDiff),
    };
  } catch (error) {
    return {
      success: false,
      message: error.toString(),
      rowCount: 0,
    };
  }
}
```

### **checkForNewData() Function**

```javascript
// ตรวจสอบข้อมูลใหม่
function checkForNewData(lastKnownCount = 0) {
  try {
    const sheet =
      SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    const currentRowCount = sheet.getLastRow() - 1; // ลบ header

    const hasNewData = currentRowCount > lastKnownCount;

    return {
      success: true,
      hasNewData: hasNewData,
      currentRowCount: currentRowCount,
      newRowsCount: hasNewData ? currentRowCount - lastKnownCount : 0,
      checkTime: new Date(),
    };
  } catch (error) {
    return {
      success: false,
      message: error.toString(),
      currentRowCount: lastKnownCount,
    };
  }
}
```

---

## 🔍 การแก้ไขปัญหา

### **ปัญหาที่พบบ่อย**

#### **Auto-refresh ไม่ทำงาน**

1. ✅ ตรวจสอบ refresh indicator แสดง "ON"
2. 🔍 เปิด Console (F12) ดู error messages
3. 🔄 ลอง Manual Refresh ทดสอบการเชื่อมต่อ
4. 🔒 ตรวจสอบ CORS และ permissions

#### **ข้อมูลไม่อัปเดต**

1. 🔍 ตรวจสอบ Console หา error
2. 📊 ตรวจสอบ SPREADSHEET_ID และ SHEET_NAME
3. 🔐 ตรวจสอบ Google Sheet permissions
4. 🌐 ทดสอบการเชื่อมต่อ internet

#### **แจ้งเตือนมากเกินไป**

1. ⚙️ ปรับเกณฑ์การแจ้งเตือนใน checkForNewData()
2. ⏰ เปลี่ยนช่วงเวลา refresh ให้นานขึ้น
3. 🔕 ตั้งค่า maxNotificationsPerMinute

### **Debug Mode**

```javascript
// เปิดใช้งาน Debug Mode
localStorage.setItem("smartLightsDebug", "true");

// ปิดใช้งาน Debug Mode
localStorage.setItem("smartLightsDebug", "false");
```

---

## 📈 Performance Metrics

### **เมตริกที่ติดตาม**

- API Response Time
- Data Update Frequency
- Success/Failure Rate
- Anomaly Detection Count
- User Engagement

### **การปรับปรุงประสิทธิภาพ**

- Smart Caching
- Adaptive Refresh Rates
- Background Processing
- Error Recovery

---

## 🎯 ฟีเจอร์อนาคต

### **แผนพัฒนา**

- **WebSocket Integration**: Real-time ที่เร็วขึ้น
- **Machine Learning**: Anomaly Detection อัจฉริยะ
- **Mobile Push**: การแจ้งเตือนบนมือถือ
- **Voice Alerts**: การแจ้งเตือนด้วยเสียง
- **Predictive Analytics**: การวิเคราะห์เชิงทำนาย

### **การพัฒนาต่อ**

- Integration กับ IoT Platforms อื่นๆ
- API สำหรับ External Systems
- Advanced Dashboard Customization
- Multi-language Support

---

**📝 สรุป**: ระบบ Real-Time Features ทำให้ Smart Lights Dashboard มีความทันสมัยและใช้งานง่าย พร้อมการแจ้งเตือนและการตรวจสอบอัตโนมัติที่ครบครัน

**🔄 อัปเดตล่าสุด**: 12 พฤศจิกายน 2025  
**📧 ติดต่อ**: dev@smartlights.local  
**📋 เวอร์ชัน**: 2.0 - Enhanced Real-Time Features
