pg-init:
	cp -r phonegap build
	-cd build/phonegap && phonegap platform add ios

pg-clean:
	rm -rf build/phonegap

pg-build: pg-init
	gulp browserify-external-libs build
	make pg-copy-app
	cd build/phonegap && phonegap build

pg-emulate:
	cd build/phonegap && phonegap emulate ios

pg-device:
	cd build/phonegap && phonegap run ios --device # --release

pg-copy-app:
	cp -r build/online-app/* build/phonegap/www/

.PHONY: phonegap
