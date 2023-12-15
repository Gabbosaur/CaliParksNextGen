#!/bin/bash

raspivid -n -w 640 -h 480 -fps 15 -t 0 -o - | gst-launch-1.0 -v fdsrc ! h264parse ! rtph264pay config-interval=10 pt=96 ! udpsink host=10.8.0.22 port=6000