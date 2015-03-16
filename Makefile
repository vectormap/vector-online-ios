init:
	cp -r phonegap build
	-cd build/phonegap && phonegap platform add ios

clean:
	rm -rf build/phonegap

build: 
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

release:
	gulp browserify-external-libs build
	make copy-app
	uglifyjs build/online-app/external-libs-bundle.js -cm > build/phonegap/www/external-libs-bundle.js
	uglifyjs build/online-app/app.js -cm > build/phonegap/www/app.js
	cssmin build/online-app/app.css > build/phonegap/www/app.css
	cd build/phonegap && phonegap build ios --device


.PHONY: phonegap build
