# 🌟 Smart Lights Dashboard

A comprehensive IoT dashboard system for monitoring and controlling solar-powered smart lighting systems with real-time data visualization and anomaly detection.

## 🚀 Features

### 📊 Real-time Dashboard
- **Live Data Monitoring**: Solar voltage, current, power consumption tracking
- **Interactive Gauges**: Visual representation of system performance
- **Historical Charts**: Voltage/current waveforms, power trends, energy consumption
- **Anomaly Detection**: Automated alerts for unusual system behavior
- **Auto-refresh System**: Continuous data updates every 30 seconds

### 🔧 System Components
- **ESP32 Microcontroller**: Main hardware controller
- **Solar Panel Monitoring**: Real-time voltage/current measurement
- **Environmental Sensors**: Temperature, light intensity, motion detection
- **Google Sheets Integration**: Cloud data storage and API integration
- **Chart.js Visualization**: Professional data visualization

### ⚡ Smart Features
- **Automatic Light Control**: PIR motion detection and relay switching
- **Cloud Integration**: Weather data and solar conditions
- **Energy Efficiency**: Solar power generation vs consumption analysis
- **Maintenance Alerts**: Proactive system health monitoring
- **Multi-device Support**: Responsive design for desktop and mobile

## 📁 Project Structure

```
Smart-Lights-Dashboard/
├── Index.html              # Main dashboard interface
├── Code.gs                 # Google Apps Script backend
├── SmartLights.xlsx        # Data storage spreadsheet
├── SYSTEM_MANUAL.md        # Complete system documentation
├── INSTALLATION_GUIDE.md   # Setup and configuration guide
├── HARDWARE_GUIDE.md       # Hardware specifications and wiring
├── QUICK_REFERENCE.md      # Quick access reference guide
├── SYSTEM_STATUS.md        # System status and monitoring
├── REALTIME_FEATURES.md    # Real-time feature documentation
└── README.md              # This file
```

## 🛠️ Installation & Setup

### Prerequisites
- Google Account with Google Sheets access
- Web browser with JavaScript enabled
- ESP32 microcontroller (for hardware implementation)
- Required sensors (DHT22, BH1750, INA219, PIR, ACS712)

### Quick Start
1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/smart-lights-dashboard.git
   cd smart-lights-dashboard
   ```

2. **Set up Google Sheets**
   - Create a new Google Sheet
   - Import the SmartLights.xlsx template
   - Deploy the Code.gs as a web app

3. **Configure the Dashboard**
   - Open Index.html in a web browser
   - Update API endpoints in the JavaScript code
   - Test the connection with your Google Sheet

4. **Hardware Setup** (Optional)
   - Follow the HARDWARE_GUIDE.md for physical installation
   - Upload firmware to ESP32
   - Configure sensor connections

## 📊 Dashboard Pages

### 🏠 Main Dashboard
- **Top Cards**: Date/time, temperature, cloudiness, sunrise/sunset times
- **System Gauges**: Real-time voltage, current, power measurements
- **Charts**: Solar voltage/current waveforms, power trends, daily energy consumption

### 📈 Reports & Statistics
- **Data Tables**: Historical readings with filtering options
- **Export Options**: Download data for analysis
- **Performance Metrics**: System efficiency calculations

### 🔔 Notifications & Alerts
- **Anomaly Detection**: Automated system health monitoring
- **Alert History**: Comprehensive notification tracking
- **Status Indicators**: Visual system status overview

## 🔧 Technical Specifications

### Data Collection
- **Sampling Rate**: Every 30 seconds
- **Data Storage**: Google Sheets cloud storage
- **API Integration**: RESTful Google Apps Script endpoints
- **Real-time Updates**: WebSocket-like refresh mechanism

### Sensor Integration
- **DHT22**: Temperature and humidity monitoring
- **BH1750**: Light intensity measurement (dual sensors)
- **INA219**: Precision current/voltage monitoring
- **PIR**: Motion detection for automatic control
- **ACS712**: AC current measurement

### Performance
- **Response Time**: < 2 seconds for data updates
- **Uptime**: 99.9% availability target
- **Data Retention**: Unlimited cloud storage
- **Browser Support**: Chrome, Firefox, Safari, Edge

## 🚨 Anomaly Detection System

The system includes intelligent anomaly detection for:
- **Voltage Fluctuations**: Unusual solar panel performance
- **Current Spikes**: Potential hardware issues
- **Temperature Extremes**: Environmental monitoring
- **Motion Patterns**: Security and usage analysis
- **Energy Efficiency**: Performance degradation alerts

## 📱 Mobile Responsive Design

- **Adaptive Layout**: Optimized for all screen sizes
- **Touch Interface**: Mobile-friendly controls
- **Performance**: Lightweight design for mobile networks
- **Offline Capability**: Limited offline functionality

## 🔐 Security Features

- **HTTPS Encryption**: Secure data transmission
- **API Authentication**: Google OAuth integration
- **Data Validation**: Input sanitization and validation
- **Access Control**: User permission management

## 🌍 Supported Languages

- **Interface**: English with Thai language support
- **Documentation**: Bilingual (English/Thai)
- **Localization**: Timezone and date formatting

## 📞 Support & Documentation

- **System Manual**: Complete operation guide
- **Installation Guide**: Step-by-step setup instructions
- **Hardware Guide**: Detailed hardware documentation
- **Quick Reference**: Fast troubleshooting guide

## 🎯 Use Cases

- **Residential Solar Monitoring**: Home energy management
- **Commercial Applications**: Building automation systems
- **Research Projects**: Academic IoT implementations
- **Industrial Monitoring**: Manufacturing energy efficiency
- **Educational Demonstrations**: STEM learning projects

## 🚀 Future Enhancements

- **Machine Learning**: Predictive analytics integration
- **Weather API**: Enhanced environmental data
- **Mobile App**: Native iOS/Android applications
- **Database Integration**: MySQL/PostgreSQL support
- **Multi-site Support**: Multiple location monitoring

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests for any improvements.

## 📊 Project Status

- **Version**: 1.0.0
- **Status**: Production Ready
- **Last Updated**: November 2024
- **Maintenance**: Actively maintained

---

**Made with ❤️ for Smart Energy Management**

For detailed documentation, please refer to the individual guide files included in this repository.