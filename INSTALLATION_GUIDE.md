# Smart Lights Dashboard - Installation & Configuration Guide

## System Requirements

### **Hardware Requirements**

- **Solar Panel**: 12V/24V system
- **Battery**: Lead-acid or Lithium-ion 12V
- **Microcontroller**: ESP32 or Arduino compatible
- **Sensors**:
  - Temperature sensor (DHT22/DS18B20)
  - Light sensors (LDR/BH1750)
  - Current sensor (INA219)
  - PIR motion sensor
  - Voltage divider for voltage measurement

### **Software Requirements**

- **Web Browser**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **Google Account**: For Google Sheets integration
- **Internet Connection**: For real-time data sync

## Installation Steps

### **1. Google Sheets Setup**

#### **Create Data Sheet**

1. Create a new Google Sheets file named "SmartLights.xlsx"
2. Set up columns with exact names:
   ```
   Timestamp | Temperature (°C) | Cloudiness (%) | Sunrise | Sunset |
   Lux_A (Control) | Lux_B (Monitor) | Solar_Voltage (V) | Solar_Current (A) |
   Solar_Power (W) | Solar_Energy (kWh) | Motion (PIR) | System_Voltage (V) |
   System_Current (A) | System_Power (W) | System_Energy (kWh) |
   Relay Status | Bulb Status (INA219) | INA219_Current (A) |
   Anomaly Status | Solar_Daily_Wh | System_Daily_Wh
   ```

#### **Google Apps Script Setup**

1. Open Google Apps Script (script.google.com)
2. Create new project
3. Copy the `Code.gs` content into the script editor
4. Deploy as web app with permissions:
   - Execute as: Me
   - Who has access: Anyone

### **2. HTML Dashboard Setup**

#### **File Structure**

```
AppScript/
├── Code.gs              # Google Apps Script backend
├── Index.html           # Main dashboard interface
├── SYSTEM_MANUAL.md     # System manual (this file)
├── SYSTEM_STATUS.md     # System status tracking
└── REALTIME_FEATURES.md # Real-time features documentation
```

#### **Configuration Variables**

Edit the following variables in `Index.html`:

```javascript
// ========== SHEET COLUMN CONFIGURATION ==========
const COL_TIMESTAMP = "Timestamp";
const COL_TEMP = "Temperature (°C)";
const COL_CLOUD = "Cloudiness (%)";
// ... (update column names to match your sheet)

// Auto-refresh settings
let refreshIntervalSeconds = 30; // Check every 30 seconds
let isAutoRefreshEnabled = true;
```

### **3. Hardware Connection**

#### **ESP32 Pin Configuration**

```cpp
// Voltage measurement
#define VOLTAGE_PIN A0
#define VOLTAGE_DIVIDER_RATIO 11.0  // For 0-30V range

// Current sensor (INA219)
#define SDA_PIN 21
#define SCL_PIN 22

// Light sensors
#define LDR_A_PIN A1  // Control sensor
#define LDR_B_PIN A2  // Monitor sensor

// PIR Motion sensor
#define PIR_PIN 14

// Relay control
#define RELAY_PIN 12

// Temperature sensor (DHT22)
#define DHT_PIN 4
```

#### **Sensor Calibration**

Update these values based on your hardware:

```javascript
// Gauge maximum values (adjust based on your system)
drawGauge("gVolt", voltage, 30, "color"); // Solar Voltage Max 30V
drawGauge("gCurr", current, 5, "color"); // Solar Current Max 5A
drawGauge("gPow", power, 100, "color"); // Solar Power Max 100W
drawGauge("gSystemVolt", sysVolt, 15, "color"); // System Voltage Max 15V
drawGauge("gSystemCurr", sysCurr, 10, "color"); // System Current Max 10A
drawGauge("gSystemPow", sysPow, 150, "color"); // System Power Max 150W
```

### **4. Google Apps Script Code Configuration**

#### **Spreadsheet Integration**

```javascript
// In Code.gs, update the spreadsheet ID
const SPREADSHEET_ID = "your-google-sheet-id-here";
const SHEET_NAME = "Sheet1"; // or your sheet name
```

#### **API Endpoints**

Ensure these functions are available in Code.gs:

- `getLatestData()`: Get most recent row
- `getAllData()`: Get all data with filters
- `getDataSummary()`: Get summary statistics
- `addNotification()`: Add system notifications

## Configuration Options

### **Dashboard Customization**

#### **Color Themes**

```css
:root {
  --sidebar-w: 260px;
  --bg: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --card: rgba(255, 255, 255, 0.95);
  --accent: #3b82f6;
  --success: #10b981;
  --warning: #f59e0b;
  --danger: #ef4444;
}
```

#### **Refresh Settings**

```javascript
// Auto-refresh configuration
let refreshIntervalSeconds = 30; // Refresh interval in seconds
let isAutoRefreshEnabled = true; // Enable/disable auto-refresh
const MAX_NOTIFICATIONS = 1000; // Maximum notifications to keep
```

#### **Chart Settings**

```javascript
// Chart time ranges
const chartOptions = {
  hourly: { hours: 24, interval: 1 }, // 24 hours, 1-hour intervals
  daily: { days: 30, interval: 24 }, // 30 days, daily intervals
};
```

### **Anomaly Detection Settings**

#### **Threshold Configuration**

```javascript
// Voltage thresholds
const VOLTAGE_MIN = 10.0; // Minimum safe voltage
const VOLTAGE_MAX = 28.0; // Maximum safe voltage

// Current thresholds
const CURRENT_MAX = 4.5; // Maximum safe current

// Power thresholds
const POWER_MAX = 90.0; // Maximum safe power

// Temperature thresholds
const TEMP_MIN = -10.0; // Minimum temperature
const TEMP_MAX = 60.0; // Maximum temperature
```

### **Notification Configuration**

#### **Notification Types**

```javascript
const NOTIFICATION_TYPES = {
  SYSTEM: "system",
  ANOMALY: "anomaly",
  WARNING: "warning",
  SUCCESS: "success",
  ERROR: "error",
};
```

#### **Alert Conditions**

```javascript
// Configure when to trigger alerts
const ALERT_CONDITIONS = {
  voltage_low: { threshold: 11.5, type: "warning" },
  voltage_high: { threshold: 26.0, type: "warning" },
  voltage_critical: { threshold: 28.0, type: "anomaly" },
  current_high: { threshold: 4.0, type: "warning" },
  power_high: { threshold: 80.0, type: "warning" },
  temperature_high: { threshold: 50.0, type: "warning" },
};
```

## Deployment

### **Local Development**

1. Open `Index.html` in a web browser
2. Configure Google Apps Script URL
3. Test all functionality locally

### **Production Deployment**

#### **Option 1: Google Apps Script Web App**

1. Deploy Google Apps Script as web app
2. Use the provided URL for access
3. Set appropriate permissions

#### **Option 2: Web Server Hosting**

1. Upload HTML file to web server
2. Configure CORS for Google Sheets API
3. Set up SSL certificate for HTTPS

### **Mobile Access**

The dashboard is responsive and works on mobile devices:

- Portrait mode: Stacked layout
- Landscape mode: Side-by-side layout
- Touch-friendly interface

## Security Considerations

### **Data Access**

- Use Google Apps Script for secure data access
- Implement proper authentication
- Limit API access permissions

### **HTTPS Requirements**

- Always use HTTPS in production
- Google APIs require secure connections
- Prevents data interception

### **API Rate Limits**

- Google Apps Script: 6 minutes execution limit per trigger
- Google Sheets API: 300 requests per minute per project
- Implement proper error handling

## Backup and Maintenance

### **Data Backup**

```javascript
// Automated backup function (add to Code.gs)
function backupData() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME);

  // Create backup sheet with timestamp
  const backupName = `Backup_${new Date().toISOString().split("T")[0]}`;
  sheet.copyTo(ss).setName(backupName);
}
```

### **Regular Maintenance Tasks**

1. **Daily**: Check system status indicators
2. **Weekly**: Review notification history
3. **Monthly**: Backup Google Sheets data
4. **Quarterly**: Update sensor calibration
5. **Annually**: Review and update thresholds

### **Performance Monitoring**

- Monitor page load times
- Check JavaScript console for errors
- Verify Google Apps Script execution logs
- Test mobile responsiveness

## Troubleshooting

### **Common Issues**

#### **Data Not Loading**

```javascript
// Debug steps:
1. Check Google Apps Script deployment URL
2. Verify spreadsheet permissions
3. Check browser console for errors
4. Test API endpoints manually
```

#### **Charts Not Displaying**

```javascript
// Solutions:
1. Verify Chart.js library loading
2. Check data format in console
3. Ensure canvas elements exist
4. Verify responsive CSS
```

#### **Notifications Not Working**

```javascript
// Check:
1. Browser notification permissions
2. JavaScript console errors
3. Notification history storage
4. Auto-refresh functionality
```

### **Debug Mode**

Add this to enable debug logging:

```javascript
const DEBUG_MODE = true;

function debugLog(message, data) {
  if (DEBUG_MODE) {
    console.log(`[DEBUG] ${message}`, data);
  }
}
```

## API Documentation

### **Available Endpoints** (Google Apps Script)

#### **GET /getLatestData**

Returns the most recent data row

```json
{
  "timestamp": "2025-11-12 14:30:00",
  "temperature": 25.5,
  "voltage": 24.8,
  "current": 3.2,
  "power": 79.36
  // ... other fields
}
```

#### **GET /getAllData?from=date&to=date&mode=hourly**

Returns filtered data array

```json
[
  {
    "timestamp": "2025-11-12 14:00:00",
    "temperature": 25.5
    // ... other fields
  }
]
```

#### **POST /addNotification**

Add system notification

```json
{
  "type": "anomaly",
  "title": "Voltage Alert",
  "message": "Voltage exceeded safe limits",
  "timestamp": "2025-11-12 14:30:00"
}
```

## Support and Updates

### **Version Control**

- Current Version: 1.0
- Last Updated: November 12, 2025
- Next Review: February 12, 2026

### **Support Channels**

- System Manual: `SYSTEM_MANUAL.md`
- Real-time Features: `REALTIME_FEATURES.md`
- System Status: `SYSTEM_STATUS.md`

### **Update Procedure**

1. Backup current configuration
2. Test new version in development environment
3. Update production files during maintenance window
4. Verify all functionality
5. Update documentation

---

**Important Notes:**

- Always test changes in a development environment first
- Keep backups of working configurations
- Monitor system performance after updates
- Document any custom modifications
