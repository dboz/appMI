#!/bin/bash

SINATRA_HOME=/var/appMi/server; export SINATRA_HOME
SINATRA_OWNER=root; export SINATRA_OWNER

SINATRA_1="ruby server.rb"; export SINATRA_1


start() {

	echo "Starting Sinatra: "
	cd $SINATRA_HOME
	/usr/bin/ruby server.rb 2>&1>/dev/null &
	sleep 1s
}

stop() {
	echo -n "Stopping Sinatra: "
	pkill -f "${SINATRA_1}"
}

status() {
	echo -n "Sinatra Server PID: "
	pgrep -f "${SINATRA_1}"
	echo
}

# See how we were called.
case "$1" in
  start)
        start
        ;;
  stop)
        stop
        ;;
  status)
        status
        ;;
  restart)
        stop
        start
        ;;
  *)
        echo $"Usage: sinatra-server {start|stop|restart|status}" 
        exit
esac
