init:
	cp -r phonegap build
	-cd build/phonegap && phonegap platform add ios

clean:
	rm -rf build/phonegap

build: init
	cd build/phonegap && phonegap build

build-all: init
	gulp browserify-external-libs build
	make copy-app
	cd build/phonegap && phonegap build

emulate: copy-app
	cd build/phonegap && phonegap build &&  phonegap emulate ios

device: copy-app
	#-pkill lldb
	cd build/phonegap && phonegap run ios --device # --release

copy-app:
	cp -r build/online-app/* build/phonegap/www/

install-plugins:
	cd build/phonegap && node ./scripts/install_plugins.js

rm-plugins:
	cd build/phonegap && node ./scripts/rm_plugins.js

.PHONY: phonegap
