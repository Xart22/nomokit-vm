

/*
   ConfigurableFirmata standard example file, for serial communication.
*/

#include <ConfigurableFirmata.h>
#include <ESP32Servo.h>
#include <DHT.h>
#include "BluetoothSerial.h"

#if !defined(CONFIG_BT_ENABLED) || !defined(CONFIG_BLUEDROID_ENABLED)
#error Bluetooth is not enabled! Please run `make menuconfig` to and enable it
#endif

BluetoothSerial SerialBT;

// Use this to enable WIFI instead of serial communication. Tested on ESP32, but should also
// work with Wifi-enabled Arduinos
// #define ENABLE_WIFI

const char* ssid     = "your-ssid";
const char* password = "your-password";
const int NETWORK_PORT = 27016;

// Use these defines to easily enable or disable certain modules

// #define ENABLE_ONE_WIRE

// Note that the SERVO module currently is not supported on ESP32. So either disable this or patch the library

// #define ENABLE_ACCELSTEPPER

// This is rarely used
#define ENABLE_BASIC_SCHEDULER
#define ENABLE_SERIAL
#define ENABLE_I2C
#define ENABLE_SPI
#define ENABLE_ANALOG
#define ENABLE_DIGITAL
#define ENABLE_FREQUENCY

// Currently supported for AVR and ESP32
#if defined (ESP32) || defined (ARDUINO_ARCH_AVR)
#define ENABLE_SLEEP
#endif

#ifdef ENABLE_DIGITAL
#include <DigitalInputFirmata.h>
DigitalInputFirmata digitalInput;

#include <DigitalOutputFirmata.h>
DigitalOutputFirmata digitalOutput;
#endif


#ifdef ENABLE_ANALOG
#include <AnalogInputFirmata.h>
AnalogInputFirmata analogInput;

#include <AnalogOutputFirmata.h>
AnalogOutputFirmata analogOutput;
#endif


#ifdef ENABLE_WIFI
#include <WiFi.h>
#include "utility/WiFiClientStream.h"
#include "utility/WiFiServerStream.h"
WiFiServerStream serverStream(NETWORK_PORT);
#endif

#ifdef ENABLE_I2C
#include <Wire.h>
#include <I2CFirmata.h>
I2CFirmata i2c;
#endif

#ifdef ENABLE_SPI
#include <Wire.h>
#include <SpiFirmata.h>
SpiFirmata spi;
#endif

#ifdef ENABLE_ONE_WIRE
#include <OneWireFirmata.h>
OneWireFirmata oneWire;
#endif

#ifdef ENABLE_SERIAL
#include <SerialFirmata.h>
SerialFirmata serial;
#endif


#include <FirmataExt.h>
FirmataExt firmataExt;


#include <FirmataReporting.h>
FirmataReporting reporting;

#ifdef ENABLE_ACCELSTEPPER
#include <AccelStepperFirmata.h>
AccelStepperFirmata accelStepper;
#endif

#ifdef ENABLE_FREQUENCY
#include <Frequency.h>
Frequency frequency;
#endif

#ifdef ENABLE_BASIC_SCHEDULER
// The scheduler allows to store scripts on the board, however this requires a kind of compiler on the client side.
// When running dotnet/iot on the client side, prefer using the FirmataIlExecutor module instead
#include <FirmataScheduler.h>
FirmataScheduler scheduler;
#endif

void systemResetCallback()
{
  // Does more harm than good on ESP32 (because may touch pins reserved
  // for memory IO and other reserved functions)
#ifndef ESP32
  for (byte i = 0; i < TOTAL_PINS; i++)
  {
    if (IS_PIN_ANALOG(i))
    {
      Firmata.setPinMode(i, PIN_MODE_ANALOG);
    }
    else if (IS_PIN_DIGITAL(i))
    {
      Firmata.setPinMode(i, PIN_MODE_OUTPUT);
    }
  }
#endif
  firmataExt.reset();
}

void initTransport()
{
  // Uncomment to save a couple of seconds by disabling the startup blink sequence.
  // Firmata.disableBlinkVersion();

#ifdef ESP8266
  // need to ignore pins 1 and 3 when using an ESP8266 board. These are used for the serial communication.
  Firmata.setPinMode(1, PIN_MODE_IGNORE);
  Firmata.setPinMode(3, PIN_MODE_IGNORE);
#endif
#ifdef ENABLE_WIFI
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  pinMode(VERSION_BLINK_PIN, OUTPUT);
  bool pinIsOn = false;
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(100);
    pinIsOn = !pinIsOn;
    digitalWrite(VERSION_BLINK_PIN, pinIsOn);
  }
  Firmata.begin(serverStream);
  Firmata.blinkVersion(); // Because the above doesn't do it.
#else
  SerialBT.begin("ESP32test");
  Firmata.begin(115200);
#endif
}

void initFirmata()
{
#ifdef ENABLE_DIGITAL
  firmataExt.addFeature(digitalInput);
  firmataExt.addFeature(digitalOutput);
#endif

#ifdef ENABLE_ANALOG
  firmataExt.addFeature(analogInput);
  firmataExt.addFeature(analogOutput);
#endif

#ifdef ENABLE_I2C
  firmataExt.addFeature(i2c);
#endif

#ifdef ENABLE_ONE_WIRE
  firmataExt.addFeature(oneWire);
#endif

#ifdef ENABLE_SERIAL
  firmataExt.addFeature(serial);
#endif

#ifdef ENABLE_BASIC_SCHEDULER
  firmataExt.addFeature(scheduler);
#endif

  firmataExt.addFeature(reporting);
#ifdef ENABLE_SPI
  firmataExt.addFeature(spi);
#endif
#ifdef ENABLE_ACCELSTEPPER
  firmataExt.addFeature(accelStepper);
#endif

#ifdef ENABLE_DHT
  firmataExt.addFeature(dhtFirmata);
#endif

#ifdef ENABLE_FREQUENCY
  firmataExt.addFeature(frequency);
#endif


  Firmata.attach(SYSTEM_RESET, systemResetCallback);
}

float getDistance(int trig, int echo) {
  pinMode(trig, OUTPUT);
  digitalWrite(trig, LOW);
  delayMicroseconds(2);
  digitalWrite(trig, HIGH);
  delayMicroseconds(10);
  digitalWrite(trig, LOW);
  pinMode(echo, INPUT);
  return pulseIn(echo, HIGH) * 0.034 / 2;
}

float getTemperature(int pin, String type) {
  if (type == "DHT11") {
    DHT dht(pin, DHT11);
    dht.begin();
    return dht.readTemperature();
  } else {
    DHT dht(pin, DHT22);
    dht.begin();
    return dht.readTemperature();
  }
  return 0;
}

int readAnalog(int pin) {
  return analogRead(pin);
}

float getHumidity(int pin, String type) {
  if (type == "DHT11") {
    DHT dht(pin, DHT11);
    dht.begin();
    return dht.readHumidity();
  } else {
    DHT dht(pin, DHT22);
    dht.begin();
    return dht.readHumidity();
  }
  return 0;
}

void explode(String str, char separator, String* arr, int* size) {
  int strIndex = 0;
  int arrIndex = 0;
  while (strIndex != -1) {
    int strIndex2 = str.indexOf(separator, strIndex + 1);
    if (strIndex2 == -1) {
      arr[arrIndex] = str.substring(strIndex);
      strIndex = -1;
    } else {
      arr[arrIndex] = str.substring(strIndex, strIndex2);
      strIndex = strIndex2;
    }
    arrIndex++;
  }
  *size = arrIndex;
}

Servo servo[33];

// Setting PWM properties
const int freq = 30000;
const int resolution = 8;

void stringCallback(char *myString)
{
  String str = String(myString);
  String arr[10];
  int size;
  explode(str, ',', arr, &size);
  // convert string to char
  for (int i = 0; i < size; i++)
  {
    arr[i].replace(",", "");
  }
 

  if (arr[0] == "UL") {
     float distance = getDistance(arr[1].toInt(), arr[2].toInt());
     String str = "UL-" + String(distance);
     Firmata.sendString(STRING_DATA, str.c_str());
  } else if (arr[0] == "DHT") {
    if (arr[1] == "DHT11" && arr[2] == "Temperature")
    {
      float temperature = getTemperature(arr[3].toInt(), arr[1]);
      String str = "DHT-" + String(temperature);
      Firmata.sendString(STRING_DATA, str.c_str());
    } else if (arr[1] == "DHT11" && arr[2] == "Humidity")
    {
      float humidity = getHumidity(arr[3].toInt(), arr[1]);
      String str = "DHT-" + String(humidity);
      Firmata.sendString(STRING_DATA, str.c_str());
    } else if (arr[1] == "DHT22" && arr[2] == "temperature")
    {
      float temperature = getTemperature(arr[3].toInt(), arr[1]);
      String str = "DHT-" + String(temperature);
      Firmata.sendString(STRING_DATA, str.c_str());
    } else if (arr[1] == "DHT22" && arr[2] == "humidity")
    {
      float humidity = getHumidity(arr[3].toInt(), arr[1]);
      String str = "DHT-" + String(humidity);
      Firmata.sendString(STRING_DATA, str.c_str());
    }
  }else if(arr[0] == "ANALOG"){
    int analog = readAnalog(arr[1].toInt());
    String str = "ANALOG-" + String(analog);
    Firmata.sendString(STRING_DATA, str.c_str());
  }else if (arr[0]=="DIGITAL")
  {
    int digital = digitalRead(arr[1].toInt());
    pinMode(arr[1].toInt(), INPUT);
    String str = "DIGITAL-" + String(digital);
    Firmata.sendString(STRING_DATA, str.c_str());
  }
  else if(arr[0]=="DIGITALOUT"){
    pinMode(arr[1].toInt(), OUTPUT);
    digitalWrite(arr[1].toInt(), arr[2].toInt());
  }
  else if(arr[0] == "TOUCH"){
    int touch = touchRead(arr[1].toInt());
    String str = "TOUCH-" + String(touch);
    Firmata.sendString(STRING_DATA, str.c_str());
  }
  else if(arr[0] == "SERVO"){
    servo[arr[1].toInt()].attach(arr[1].toInt(),0);
    servo[arr[1].toInt()].write(arr[2].toInt());
  }else if(arr[0] == "SETMOTOR"){
    pinMode(arr[1].toInt(), OUTPUT);
    pinMode(arr[2].toInt(), OUTPUT);
    pinMode(arr[3].toInt(), OUTPUT);
    ledcSetup(arr[4].toInt(), freq, resolution);
    ledcAttachPin(arr[3].toInt(), arr[4].toInt());
  } else if (arr[0] =="FORWARD")
  {
    digitalWrite(arr[1].toInt(), HIGH);
    digitalWrite(arr[2].toInt(), LOW);
    ledcWrite(arr[3].toInt(), arr[4].toInt()); 
   
  }else if (arr[0] =="BACKWARD")
  {
    digitalWrite(arr[1].toInt(), LOW);
    digitalWrite(arr[2].toInt(), HIGH);
    ledcWrite(arr[3].toInt(), arr[4].toInt());
  }else if (arr[0] =="STOP")
  {
    digitalWrite(arr[1].toInt(), LOW);
    digitalWrite(arr[2].toInt(), LOW);
    ledcWrite(arr[3].toInt(), 0);
  }else if(arr[0]="RELAY"){
    pinMode(arr[1].toInt(), OUTPUT);
    digitalWrite(arr[1].toInt(), arr[2].toInt());
  }

}




void setup()
{
  // Set firmware name and version.
  // Do this before initTransport(), because some client libraries expect that a reset sends this automatically.
  Firmata.setFirmwareNameAndVersion("ConfigurableFirmata", FIRMATA_FIRMWARE_MAJOR_VERSION, FIRMATA_FIRMWARE_MINOR_VERSION);
  initTransport();
  Firmata.sendString(F("Booting device. Stand by..."));
  initFirmata();
  Firmata.attach(STRING_DATA, stringCallback);

  Firmata.parse(SYSTEM_RESET);
}

void loop()
{
  if (Serial.available()) {
    SerialBT.write(Serial.read());
  }
  if (SerialBT.available()) {
    Serial.write(SerialBT.read());
  }
  while (Firmata.available())
  {
    Firmata.processInput();
    if (!Firmata.isParsingMessage())
    {
      break;
    }
  }

  firmataExt.report(reporting.elapsed());
#ifdef ENABLE_WIFI
  serverStream.maintain();
#endif
}
