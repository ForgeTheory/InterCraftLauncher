// This script has been fixed to ACTUALLY find Java home

/* Copyright 2013 Joseph Spencer.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *			 http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var which = require('which');
var fs = require('fs');
var path = require('path');
var dirname = path.dirname;
var exec = require('child_process').exec;
var exists = fs.existsSync;
var stat = fs.statSync;
var readlink = fs.readlinkSync;
var resolve = path.resolve;
var lstat = fs.lstatSync;
var WinReg = require("winreg");
var utils = require("./utils");
var javaHome;

module.exports = findJava;

var isWindows = process.platform.indexOf('win') === 0;
var JAVA_FILENAME = 'javaw' + (isWindows?'.exe':'');

function findJava(options, cb){
	if(typeof options === 'function'){
		cb = options;
		options = null;
	}
	options = options || {
		allowJre: true
	};
	var macUtility;
	var possibleKeyPaths;

	if(process.env.JAVA_HOME && dirIsJavaHome(process.env.JAVA_HOME)){
		javaHome = process.env.JAVA_HOME;
	}

	if(javaHome) return next(cb, null, path.join(javaHome, 'bin', JAVA_FILENAME));

	var finalSearch = () => {
		which(JAVA_FILENAME, function(err, proposed){
			if(err)return next(cb, err, null);

			//resolve symlinks
			proposed = findLinkedFile(proposed);

			//get the /bin directory
			proposed = dirname(proposed);

			//on mac, java install has a utility script called java_home that does the
			//dirty work for us
			macUtility = resolve(proposed, 'java_home');
			if(exists(macUtility)){
				exec(macUtility, {cwd:proposed}, function(error, out, err){
					if(error || err)return next(cb, error || ''+err, null);
					javaHome = ''+out.replace(/\n$/, '');
					next(cb, null, path.join(javaHome, 'bin', JAVA_FILENAME));
				}) ;
				return;
			}

			next(cb, null, path.join(proposed, JAVA_FILENAME));
		});
	};

	//windows
	if(process.platform.indexOf('win') === 0){
		utils.findMinecraftJava((path) => {
			if (path) {
				next(cb, null, path);
			} else {
				//java_home can be in many places
				//JDK paths
				possibleKeyPaths = [				
					"SOFTWARE\\JavaSoft\\Java Development Kit"
				];
				//JRE paths
				if(options.allowJre){
					possibleKeyPaths = possibleKeyPaths.concat([
					"SOFTWARE\\JavaSoft\\Java Runtime Environment",
					]);
				}

				javaHome = findInRegistry(possibleKeyPaths);
				if(javaHome)return next(cb, null, path.join(javaHome, 'bin', JAVA_FILENAME));

				finalSearch();
			}
		});
	} else
		finalSearch();
}

function findInRegistry(paths){
	if(!paths.length) return null; 
	
	var keysFound =[];
	var keyPath = paths.forEach(function(element) {
		var key = new WinReg({ key: keyPath });
		key.keys(function(err, javaKeys){
			keysFound.concat(javaKeys);
		});
	}, this);
	
	if(!keysFound.length) return null;

	keysFound = keysFound.sort(function(a,b){
		 var aVer = parseFloat(a.key);
		 var bVer = parseFloat(b.key);
		 return bVer - aVer;
	});
	var registryJavaHome;
	keysFound[0].get('JavaHome',function(err,home){
	 registryJavaHome = home.value; 
	});

	return registryJavaHome;
}

// iterate through symbolic links until
// file is found
function findLinkedFile(file){
	if(!lstat(file).isSymbolicLink()) return file;
	return findLinkedFile(readlink(file));
}

function next(cb, err, home){
	process.nextTick(function(){cb(err, home);});
}

function dirIsJavaHome(dir){
	return exists(''+dir)
		&& stat(dir).isDirectory()
		&& exists(path.resolve(dir, 'bin', JAVA_FILENAME));
}

function after(count, cb){
	return function(){
		if(count <= 1)return process.nextTick(cb);
		--count;
	};
}