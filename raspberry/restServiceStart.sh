#!/bin/bash
cd /home/garage/Desktop # change to the path where led.py is located
uvicorn led:app --host 0.0.0.0 --port 8123