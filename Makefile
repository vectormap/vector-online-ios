ONLINE_APP = build/online-app
ONLINE_DIST = $(ONLINE_APP)/mobile-vmp-online-dist

init:
	cp -r phonegap build
	-cd build/phonegap && phonegap platform add ios

clean:
	rm -rf build

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

release-phonegap:
	NODE_ENV=production gulp browserify-external-libs build
	make copy-app
	uglifyjs $(ONLINE_APP)/external-libs-bundle.js -cm > build/phonegap/www/external-libs-bundle.js
	uglifyjs $(ONLINE_APP)/app.js -c drop_console=true -m > build/phonegap/www/app.js
	cssmin $(ONLINE_APP)/app.css > build/phonegap/www/app.css
	cd build/phonegap && phonegap build ios --device

release-web:
	NODE_ENV=production gulp browserify-external-libs build
	mkdir -p $(ONLINE_DIST)
	cp -r $(ONLINE_APP)/fonts $(ONLINE_APP)/images $(ONLINE_APP)/leaflet.css  $(ONLINE_DIST)
	 cp $(ONLINE_APP)/index.html $(ONLINE_DIST)/index-mobile.html
	uglifyjs $(ONLINE_APP)/mobile-external-libs-bundle.js -cm > $(ONLINE_DIST)/mobile-external-libs-bundle.js
	uglifyjs $(ONLINE_APP)/online-mobile-app.js -c drop_console=true -m > $(ONLINE_DIST)/online-mobile-app.js
	uglifyjs $(ONLINE_APP)/mobile-app-loader.js -cm > $(ONLINE_DIST)/mobile-app-loader.js
	cssmin $(ONLINE_APP)/online-mobile-app.css > $(ONLINE_DIST)/online-mobile-app.css

pack:
	cd $(ONLINE_APP) && zip -r mobile-vmp-online-dist.zip mobile-vmp-online-dist

deploy:
  scp build/online-app/mobile-vmp-online-dist.zip vmponline:/var/vmp

.PHONY: phonegap build
