from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pygame import mixer
import RPi.GPIO as GPIO
import time

GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)

app = FastAPI()
mixer.init()
mixer.music.load('1000.wav')
mixer.music.set_volume(1)

app.add_middleware(
	CORSMiddleware,
	allow_origins=["*"],
	allow_methods=["*"],
	allow_headers=["*"],
)
 
class SetGPIO(BaseModel):
    on: bool
 
@app.get("/read/{gpio}")
def read_root(gpio: int):
    GPIO.setup(gpio, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
    return {"gpio": gpio, "on": GPIO.input(gpio)}

def playSound(seconds):
    mixer.music.play()
    time.sleep(seconds)
    mixer.music.stop()

@app.patch("/set/{gpio}")
def read_item(gpio: int, value: SetGPIO):
    if value.on:
       	GPIO.setup(gpio, GPIO.OUT, initial=GPIO.HIGH)
        playSound(0.2) # da valutare se crea ritardi
    else:
        GPIO.setup(gpio, GPIO.OUT, initial=GPIO.LOW)
    return {"gpio": gpio, "on": value.on}
