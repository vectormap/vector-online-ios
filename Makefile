pg-init:
	cp -r phonegap build
	-cd build/phonegap && phonegap platform add ios

pg-clean:
	rm -rf build/phonegap

pg-build: pg-init
	gulp browserify-external-libs build
	cp -r build/online-app/* build/phonegap/www/
	cd build/phonegap && phonegap build

pg-emulate:
	cd build/phonegap && phonegap emulate ios

# pg-copy-app:

# .PHONY: phonegap
