#include <ESP8266WiFi.h>      // Usa <WiFi.h> si es ESP32
#include <ESP8266HTTPClient.h> // Usa <HTTPClient.h> si es ESP32

const char* ssid = "SEGOVIA3";
const char* password = "76840574";
const char* serverUrl = "https://p-h-iota.vercel.app/api/ph-data"; // Cambiado al dominio real

const int phPin = A0; // Pin analógico donde está conectado el sensor de pH

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  Serial.print("Conectando a WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi conectado");
}

void loop() {
  float phValue = analogRead(phPin) * (14.0 / 1023.0); // Ajusta la conversión según tu sensor

  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");

    // Construir el JSON
    String json = "{\"ph\":";
    json += String(phValue, 2);
    json += ",\"timestamp\":\"";
    json += getISOTime();
    json += "\"}";

    int httpResponseCode = http.POST(json);
    Serial.print("Enviando: ");
    Serial.println(json);
    Serial.print("Respuesta: ");
    Serial.println(httpResponseCode);

    http.end();
  } else {
    Serial.println("WiFi no conectado");
  }

  delay(30000); // Espera 30 segundos
}

// Función para obtener la hora en formato ISO (solo si tienes un RTC o NTP configurado)
// Si no tienes RTC/NTP, puedes omitir el campo "timestamp" y que el backend lo ponga
String getISOTime() {
  // Ejemplo simple: solo devuelve una cadena vacía o la hora local si tienes NTP
  return "";
}