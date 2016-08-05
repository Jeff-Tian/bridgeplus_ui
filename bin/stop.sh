#!/bin/sh

APP_NAME="bplus"


################################
#      STOP PM2 INSTANCE	   #
################################
pm2 stop "$APP_NAME"