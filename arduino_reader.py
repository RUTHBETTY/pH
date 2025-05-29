import serial
import requests
import json
import time
from datetime import datetime

# Configuración del puerto serial (ajusta COM3 según tu puerto)
PUERTO_ARDUINO = 'COM3'
BAUDRATE = 9600

# URL de tu API (ajusta según tu dominio en Vercel)
API_URL = "https://tu-app.vercel.app/api/ph-data"

def conectar_arduino():
    try:
        return serial.Serial(PUERTO_ARDUINO, BAUDRATE)
    except:
        print(f"No se pudo conectar al puerto {PUERTO_ARDUINO}")
        return None

def main():
    arduino = conectar_arduino()
    if not arduino:
        return

    print("Conectado al Arduino. Esperando datos...")
    
    while True:
        try:
            if arduino.in_waiting:
                # Leer dato del Arduino
                linea = arduino.readline().decode('utf-8').strip()
                try:
                    ph_valor = float(linea)
                    timestamp = datetime.now().isoformat()
                    
                    # Preparar datos para enviar
                    datos = {
                        "ph": ph_valor,
                        "timestamp": timestamp
                    }
                    
                    # Enviar a tu API
                    response = requests.post(API_URL, json=datos)
                    print(f"Dato enviado: pH={ph_valor}, Respuesta: {response.status_code}")
                    
                except ValueError:
                    print(f"Error: No se pudo convertir el dato a número: {linea}")
                
            time.sleep(0.1)  # Pequeña pausa para no saturar el CPU
            
        except Exception as e:
            print(f"Error: {e}")
            time.sleep(1)

if __name__ == "__main__":
    main()
