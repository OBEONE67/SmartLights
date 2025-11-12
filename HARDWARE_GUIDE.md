# Smart Lights Hardware & Sensor Guide

## ภาพรวมระบบฮาร์ดแวร์

ระบบ Smart Lights ประกอบด้วยเซ็นเซอร์และอุปกรณ์ต่างๆ เพื่อติดตามและควบคุมระบบไฟอัจฉริยะที่ใช้พลังงานแสงอาทิตย์

## รายการเซ็นเซอร์และอุปกรณ์

### **1. เซ็นเซอร์วัดแรงดันและกระแส**

#### **Solar Voltage Sensor (แรงดันแสงอาทิตย์)**

- **ขอบเขตการวัด**: 0-30V
- **ความแม่นยำ**: ±0.1V
- **วิธีการวัด**: Voltage Divider Circuit
- **การเชื่อมต่อ**: Analog Pin A0

**Circuit Diagram:**

```
Solar Panel (+) ----[R1: 100kΩ]----+----[R2: 10kΩ]---- GND
                                   |
                               ESP32 A0
```

**การคำนวณ:**

```cpp
float voltage = (analogRead(A0) * 3.3 / 4095.0) * 11.0; // 11.0 = Divider ratio
```

#### **Solar Current Sensor (กระแสแสงอาทิตย์)**

- **ขอบเขตการวัด**: 0-5A
- **ความแม่นยำ**: ±50mA
- **วิธีการวัด**: Hall Effect Sensor (ACS712-5A)
- **การเชื่อมต่อ**: Analog Pin A1

**การคำนวณ:**

```cpp
float current = (analogRead(A1) * 3.3 / 4095.0 - 1.65) / 0.185; // 0.185V/A for ACS712-5A
```

#### **INA219 Current/Power Monitor**

- **ขอบเขตการวัด**: 0-3.2A, 0-26V
- **ความแม่นยำ**: ±0.5%
- **การเชื่อมต่อ**: I2C (SDA: Pin 21, SCL: Pin 22)
- **Address**: 0x40 (default)

**ไลบรารี่และโค้ด:**

```cpp
#include <Adafruit_INA219.h>
Adafruit_INA219 ina219;

void setup() {
    ina219.begin();
}

void readINA219() {
    float shuntvoltage = ina219.getShuntVoltage_mV();
    float busvoltage = ina219.getBusVoltage_V();
    float current_mA = ina219.getCurrent_mA();
    float power_mW = ina219.getPower_mW();
}
```

### **2. เซ็นเซอร์วัดแสง**

#### **Lux_A (Control Sensor) - ตัวควบคุม**

- **เซ็นเซอร์**: BH1750 Light Sensor
- **ขอบเขตการวัด**: 1-65535 lux
- **ความแม่นยำ**: ±20%
- **การเชื่อมต่อ**: I2C (Address: 0x23)

**การใช้งาน:**

```cpp
#include <BH1750.h>
BH1750 lightMeter(0x23);

void setup() {
    lightMeter.begin(BH1750::CONTINUOUS_HIGH_RES_MODE);
}

float readLux() {
    return lightMeter.readLightLevel();
}
```

#### **Lux_B (Monitor Sensor) - ตัวติดตาม**

- **เซ็นเซอร์**: LDR (Light Dependent Resistor)
- **ขอบเขตการวัด**: 0-1023 (analog value)
- **การเชื่อมต่อ**: Analog Pin A2
- **วงจร**: Voltage Divider with 10kΩ resistor

**การคำนวณ:**

```cpp
int ldrValue = analogRead(A2);
float lux = map(ldrValue, 0, 1023, 0, 1000); // Convert to approximate lux
```

### **3. เซ็นเซอร์สิ่งแวดล้อม**

#### **Temperature Sensor (เซ็นเซอร์อุณหภูมิ)**

- **เซ็นเซอร์**: DHT22 หรือ DS18B20
- **ขอบเขตการวัด**: -40°C to +80°C
- **ความแม่นยำ**: ±0.5°C
- **การเชื่อมต่อ**: Digital Pin 4

**DHT22 Code:**

```cpp
#include <DHT.h>
#define DHT_PIN 4
#define DHT_TYPE DHT22
DHT dht(DHT_PIN, DHT_TYPE);

void setup() {
    dht.begin();
}

float readTemperature() {
    return dht.readTemperature();
}
```

#### **PIR Motion Sensor (เซ็นเซอร์ตรวจจับการเคลื่อนไหว)**

- **ขอบเขตการตรวจจับ**: 3-7 เมตร
- **มุมการตรวจจับ**: 120°
- **เวลาหน่วงการทำงาน**: 5-300 วินาที (ปรับได้)
- **การเชื่อมต่อ**: Digital Pin 14

**การใช้งาน:**

```cpp
#define PIR_PIN 14
bool motionDetected = false;

void setup() {
    pinMode(PIR_PIN, INPUT);
}

void checkMotion() {
    motionDetected = digitalRead(PIR_PIN);
}
```

### **4. อุปกรณ์ควบคุม**

#### **Relay Module (รีเลย์ควบคุม)**

- **ประเภท**: 5V Single Channel Relay
- **กำลังสูงสุด**: 10A 250V AC / 10A 30V DC
- **การเชื่อมต่อ**: Digital Pin 12
- **การใช้งาน**: ควบคุมการเปิด/ปิดไฟ

**การควบคุม:**

```cpp
#define RELAY_PIN 12

void setup() {
    pinMode(RELAY_PIN, OUTPUT);
    digitalWrite(RELAY_PIN, LOW); // ปิดรีเลย์เริ่มต้น
}

void controlRelay(bool state) {
    digitalWrite(RELAY_PIN, state ? HIGH : LOW);
}
```

#### **LED Bulb Status Monitoring**

- **วิธีการ**: ตรวจสอบผ่าน INA219
- **การวัด**: กระแสไฟฟ้าที่ไหลผ่านหลอดไฟ
- **เกณฑ์**: > 0.1A = หลอดไฟเปิด, < 0.1A = หลอดไฟปิด

## การติดตั้งฮาร์ดแวร์

### **1. ESP32 Pinout Configuration**

```
ESP32 DevKit v1 Pinout:
┌─────────────────────────────────┐
│  3V3  []           [] GPIO23    │
│  GND  []           [] GPIO22    │ ← SCL (INA219)
│ GPIO15[]           [] GPIO1     │
│ GPIO2 []           [] GPIO3     │
│ GPIO0 []           [] GPIO21    │ ← SDA (INA219)
│ GPIO4 []           [] GND       │ ← DHT22
│GPIO16 []           [] GPIO19    │
│GPIO17 []           [] GPIO18    │
│GPIO5  []           [] GPIO5     │
│GPIO18 []           [] GPIO17    │
│GPIO19 []           [] GPIO16    │
│GPIO21 []           [] GPIO4     │
│ RXD0  []           [] GPIO2     │
│ TXD0  []           [] GPIO15    │
│GPIO22 []           [] GPIO8     │
│GPIO23 []           [] GPIO7     │
│ EN    []           [] GPIO6     │
│ BOOT  []           [] GPIO0     │
│ GND   []           [] 3V3       │
│ VIN   []           [] GND       │
└─────────────────────────────────┘

Analog Pins:
- A0 (GPIO36): Solar Voltage Divider
- A1 (GPIO39): Solar Current Sensor
- A2 (GPIO34): LDR Light Sensor
- A3 (GPIO35): Reserved

Digital Pins:
- GPIO4:  DHT22 Temperature Sensor
- GPIO12: Relay Control
- GPIO14: PIR Motion Sensor
- GPIO21: I2C SDA (INA219, BH1750)
- GPIO22: I2C SCL (INA219, BH1750)
```

### **2. การเชื่อมต่อวงจร**

#### **Power Supply Circuit**

```
12V Battery ─┬─── Solar Charge Controller ─── Solar Panel
             │
             ├─── Buck Converter (12V→5V) ─── ESP32 VIN
             │
             └─── Load (LED Bulbs) ←─── Relay Module
```

#### **Voltage Divider for Solar Panel (30V max)**

```
Solar Panel (+) ───[100kΩ]───┬───[10kΩ]─── GND
                              │
                         ESP32 GPIO36 (A0)

Calculation: Vout = Vin × (10kΩ / 110kΩ) = Vin × 0.091
Max Input: 30V → 2.73V (within ESP32 3.3V limit)
```

#### **Current Sensor Connection (ACS712)**

```
Solar Panel (+) ───[ACS712]─── Battery/Load
                      │
                   GPIO39 (A1)

Output: 1.65V at 0A, +185mV/A
```

#### **I2C Sensor Connection**

```
ESP32          INA219         BH1750
GPIO21 (SDA) ─── SDA ─────────── SDA
GPIO22 (SCL) ─── SCL ─────────── SCL
3.3V ─────────── VCC ─────────── VCC
GND ──────────── GND ─────────── GND
```

### **3. การสอบเทียบเซ็นเซอร์**

#### **Voltage Sensor Calibration**

```cpp
// วัดแรงดันจริงด้วยมัลติมิเตอร์และปรับค่า
float calibrationFactor = 11.0; // เริ่มต้น
float measuredVoltage = (analogRead(A0) * 3.3 / 4095.0) * calibrationFactor;

// ปรับ calibrationFactor ให้ตรงกับค่าจริง
```

#### **Current Sensor Calibration**

```cpp
// หาค่า offset เมื่อไม่มีกระแสไหล
float zeroCurrentOffset = 1.65; // ค่าเริ่มต้น
float sensitivity = 0.185; // 185mV/A

float current = (analogRead(A1) * 3.3 / 4095.0 - zeroCurrentOffset) / sensitivity;
```

#### **Light Sensor Calibration**

```cpp
// สำหรับ LDR - ปรับตามสภาพแวดล้อม
float maxLux = 1000.0; // ค่าสูงสุดในที่แสงสว่าง
float minLux = 0.1;    // ค่าต่ำสุดในที่มด

int ldrRaw = analogRead(A2);
float lux = map(ldrRaw, 0, 1023, minLux, maxLux);
```

## การบำรุงรักษาฮาร์ดแวร์

### **การตรวจสอบประจำ**

#### **รายสัปดาห์**

- ✅ ตรวจสอบการเชื่อมต่อสายไฟ
- ✅ ทำความสะอาดแผงโซลาร์เซลล์
- ✅ ตรวจสอบสถานะ LED แสดงสถานะ
- ✅ ทดสอบการทำงานของ PIR

#### **รายเดือน**

- ✅ ตรวจสอบแรงดันแบตเตอรี่
- ✅ ทำความสะอาดเซ็นเซอร์แสง
- ✅ ตรวจสอบการทำงานของรีเลย์
- ✅ สอบเทียบเซ็นเซอร์อุณหภูมิ

#### **รายไตรมาส**

- ✅ ตรวจสอบการกัดกร่อนของจุดเชื่อมต่อ
- ✅ ทดสอบการทำงานในสภาวะโหลดเต็ม
- ✅ ตรวจสอบฉนวนและการห่อหุ้มสายไฟ
- ✅ สำรองข้อมูลการสอบเทียบ

### **การแก้ไขปัญหาฮาร์ดแวร์**

#### **ปัญหา: แรงดันวัดไม่ถูกต้อง**

**อาการ**: ค่าแรงดันแสดงผลผิดปกติ  
**สาเหตุ**:

- ตัวต้านทานใน Voltage Divider เสื่อมสภาพ
- การเชื่อมต่อหลวม
- Analog pin ไม่สามารถอ่านค่าได้

**วิธีแก้ไข**:

1. ตรวจสอบค่าความต้านทานด้วยมัลติมิเตอร์
2. เชื่อมต่อสายใหม่
3. ทดสอบ Analog pin ด้วยแหล่งจ่ายแรงดันที่ทราบค่า
4. สอบเทียบใหม่ด้วยโค้ด:

```cpp
// Test voltage divider
float testVoltage = 24.0; // Known voltage
float readValue = (analogRead(A0) * 3.3 / 4095.0) * 11.0;
float error = testVoltage - readValue;
Serial.printf("Error: %.2fV, Correction factor: %.3f\n", error, testVoltage/readValue);
```

#### **ปัญหา: กระแสวัดไม่ถูกต้อง**

**อาการ**: ค่ากระแสแสดงผลติดลบหรือไม่เปลี่ยนแปลง
**สาเหตุ**:

- ACS712 เสียหาย
- การเชื่อมต่อผิดทิศทาง
- สัญญาณรบกวน

**วิธีแก้ไข**:

1. ตรวจสอบแรงดันขาออกของ ACS712 ต้องเป็น 1.65V เมื่อไม่มีกระแส
2. ใช้ตัวกรอง noise:

```cpp
float readCurrentFiltered() {
    float sum = 0;
    for(int i = 0; i < 10; i++) {
        sum += analogRead(A1);
        delay(10);
    }
    float avgReading = sum / 10.0;
    return (avgReading * 3.3 / 4095.0 - 1.65) / 0.185;
}
```

#### **ปัญหา: I2C sensor ไม่ตอบสนง**

**อาการ**: INA219 หรือ BH1750 ไม่ส่งข้อมูล
**สาเหตุ**:

- การเชื่อมต่อ SDA/SCL ผิด
- แรงดันจ่ายไม่เพียงพอ
- Address conflict

**วิธีแก้ไข**:

1. สแกนหา I2C devices:

```cpp
void scanI2C() {
    for(byte address = 1; address < 127; address++) {
        Wire.beginTransmission(address);
        if (Wire.endTransmission() == 0) {
            Serial.printf("I2C device found at address 0x%02X\n", address);
        }
    }
}
```

2. ตรวจสอบการเชื่อมต่อ:
   - SDA: GPIO21
   - SCL: GPIO22
   - VCC: 3.3V (ไม่ใช่ 5V)
   - GND: Common ground

#### **ปัญหา: PIR sensor ทำงานผิดปกติ**

**อาการ**: ตรวจจับการเคลื่อนไหวไม่ถูกต้อง
**สาเหตุ**:

- การปรับตั้งความไวผิด
- ตำแหน่งติดตั้งไม่เหมาะสม
- สัญญาณรบกวนจากอุปกรณ์อื่น

**วิธีแก้ไข**:

1. ปรับตัวแปรค่า sensitivity บน PIR module
2. ปรับตัแปร delay time
3. เพิ่ม debounce ในโค้ด:

```cpp
bool readPIRDebounced() {
    static unsigned long lastTrigger = 0;
    static bool lastState = false;

    bool currentState = digitalRead(PIR_PIN);
    if (currentState != lastState && millis() - lastTrigger > 1000) {
        lastTrigger = millis();
        lastState = currentState;
        return currentState;
    }
    return lastState;
}
```

### **ข้อมูลอะไหล่และการเปลี่ยน**

#### **อะไหล่หลัก**

- **ตัวต้านทาน**: 100kΩ, 10kΩ (สำหรับ voltage divider)
- **ACS712-5A**: Current sensor module
- **DHT22**: Temperature/Humidity sensor
- **PIR HC-SR501**: Motion sensor
- **Relay Module**: 5V single channel
- **INA219**: Current/Power monitor
- **BH1750**: Light intensity sensor

#### **เครื่องมือที่จำเป็น**

- มัลติมิเตอร์ (วัดแรงดัน กระแส ความต้านทาน)
- Oscilloscope (ตรวจสอบสัญญาณ analog)
- Logic analyzer (ตรวจสอบ I2C communication)
- แหล่งจ่ายไฟปรับค่าได้ (สำหรับทดสอบ)
- Load resistor (สำหรับทดสอบ current sensor)

#### **การเปลี่ยนอะไหล่**

1. **ตัด power** ก่อนเปลี่ยนอะไหล่เสมอ
2. **ถ่ายภาพ** การเชื่อมต่อก่อนถอด
3. **ทดสอบ** อะไหล่ใหม่ก่อนติดตั้ง
4. **สอบเทียบ** ระบบใหม่หลังเปลี่ยน
5. **บันทึก** การเปลี่ยนแปลงในไฟล์ log

## การเพิ่มเติม/อัพเกรดระบบ

### **เซ็นเซอร์เพิ่มเติม**

- **Wind Speed Sensor**: วัดความเร็วลม
- **Rain Sensor**: ตรวจจับฝน
- **UV Sensor**: วัดรังสี UV
- **Air Quality Sensor**: วัดคุณภาพอากาศ

### **การสื่อสารเพิ่มเติม**

- **LoRa Module**: สำหรับระยะไกล
- **GSM Module**: แจ้งเตือนผ่าน SMS
- **Bluetooth**: ควบคุมผ่านมือถือ

### **การจัดเก็บข้อมูล**

- **SD Card Module**: บันทึกข้อมูลท้องถิ่น
- **EEPROM**: เก็บการตั้งค่า
- **RTC Module**: นาฬิกาความแม่นยำสูง

---

**หมายเหตุความปลอดภัย:**

- ใช้ความระมัดระวังเมื่อทำงานกับไฟฟ้า
- ตรวจสอบ polarity ก่อนเชื่อมต่อ
- ใช้ฟิวส์ป้องกันการลัดวงจร
- ติดตั้งอุปกรณ์ป้องกันฟ้าผ่า
- ทำ ground connection ที่ดี

**เอกสารอ้างอิง:**

- ESP32 Datasheet
- INA219 Application Notes
- ACS712 User Manual
- DHT22 Specification Sheet
