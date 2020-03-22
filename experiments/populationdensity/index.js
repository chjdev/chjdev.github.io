/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(Object.prototype.hasOwnProperty.call(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 	};
/******/
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		"main": 0
/******/ 	};
/******/
/******/
/******/
/******/ 	// script path function
/******/ 	function jsonpScriptSrc(chunkId) {
/******/ 		return __webpack_require__.p + "" + chunkId + ".index.js"
/******/ 	}
/******/
/******/ 	// object to store loaded and loading wasm modules
/******/ 	var installedWasmModules = {};
/******/
/******/ 	function promiseResolve() { return Promise.resolve(); }
/******/
/******/ 	var wasmImportObjects = {
/******/ 		"./pkg/index_bg.wasm": function() {
/******/ 			return {
/******/ 				"./index.js": {
/******/ 					"__wbindgen_cb_drop": function(p0i32) {
/******/ 						return installedModules["./pkg/index.js"].exports["__wbindgen_cb_drop"](p0i32);
/******/ 					},
/******/ 					"__wbindgen_string_new": function(p0i32,p1i32) {
/******/ 						return installedModules["./pkg/index.js"].exports["__wbindgen_string_new"](p0i32,p1i32);
/******/ 					},
/******/ 					"__wbindgen_object_drop_ref": function(p0i32) {
/******/ 						return installedModules["./pkg/index.js"].exports["__wbindgen_object_drop_ref"](p0i32);
/******/ 					},
/******/ 					"__wbg_instanceof_Window_04bba8b54ef81db0": function(p0i32) {
/******/ 						return installedModules["./pkg/index.js"].exports["__wbg_instanceof_Window_04bba8b54ef81db0"](p0i32);
/******/ 					},
/******/ 					"__wbg_document_f023a2b0d5b3d060": function(p0i32) {
/******/ 						return installedModules["./pkg/index.js"].exports["__wbg_document_f023a2b0d5b3d060"](p0i32);
/******/ 					},
/******/ 					"__wbg_innerWidth_92ed193bd8aa828e": function(p0i32) {
/******/ 						return installedModules["./pkg/index.js"].exports["__wbg_innerWidth_92ed193bd8aa828e"](p0i32);
/******/ 					},
/******/ 					"__wbg_innerHeight_1f092bd5c34f22b9": function(p0i32) {
/******/ 						return installedModules["./pkg/index.js"].exports["__wbg_innerHeight_1f092bd5c34f22b9"](p0i32);
/******/ 					},
/******/ 					"__wbg_requestAnimationFrame_c1ca5bf33b036c59": function(p0i32,p1i32) {
/******/ 						return installedModules["./pkg/index.js"].exports["__wbg_requestAnimationFrame_c1ca5bf33b036c59"](p0i32,p1i32);
/******/ 					},
/******/ 					"__wbg_getElementById_87fd6611f51eaa51": function(p0i32,p1i32,p2i32) {
/******/ 						return installedModules["./pkg/index.js"].exports["__wbg_getElementById_87fd6611f51eaa51"](p0i32,p1i32,p2i32);
/******/ 					},
/******/ 					"__wbg_instanceof_WebGlRenderingContext_5ee8b57eea5fdde4": function(p0i32) {
/******/ 						return installedModules["./pkg/index.js"].exports["__wbg_instanceof_WebGlRenderingContext_5ee8b57eea5fdde4"](p0i32);
/******/ 					},
/******/ 					"__wbg_bufferData_1c2f9ac2efa0aa55": function(p0i32,p1i32,p2i32,p3i32) {
/******/ 						return installedModules["./pkg/index.js"].exports["__wbg_bufferData_1c2f9ac2efa0aa55"](p0i32,p1i32,p2i32,p3i32);
/******/ 					},
/******/ 					"__wbg_attachShader_73bfffddf871dee0": function(p0i32,p1i32,p2i32) {
/******/ 						return installedModules["./pkg/index.js"].exports["__wbg_attachShader_73bfffddf871dee0"](p0i32,p1i32,p2i32);
/******/ 					},
/******/ 					"__wbg_bindBuffer_9902290b995315c0": function(p0i32,p1i32,p2i32) {
/******/ 						return installedModules["./pkg/index.js"].exports["__wbg_bindBuffer_9902290b995315c0"](p0i32,p1i32,p2i32);
/******/ 					},
/******/ 					"__wbg_blendFunc_41e02f39566f1b3b": function(p0i32,p1i32,p2i32) {
/******/ 						return installedModules["./pkg/index.js"].exports["__wbg_blendFunc_41e02f39566f1b3b"](p0i32,p1i32,p2i32);
/******/ 					},
/******/ 					"__wbg_clear_bf281d2794f8d6c6": function(p0i32,p1i32) {
/******/ 						return installedModules["./pkg/index.js"].exports["__wbg_clear_bf281d2794f8d6c6"](p0i32,p1i32);
/******/ 					},
/******/ 					"__wbg_compileShader_6e9e300a75a021b1": function(p0i32,p1i32) {
/******/ 						return installedModules["./pkg/index.js"].exports["__wbg_compileShader_6e9e300a75a021b1"](p0i32,p1i32);
/******/ 					},
/******/ 					"__wbg_createBuffer_71a36e3b24a6fe55": function(p0i32) {
/******/ 						return installedModules["./pkg/index.js"].exports["__wbg_createBuffer_71a36e3b24a6fe55"](p0i32);
/******/ 					},
/******/ 					"__wbg_createProgram_6cba8a735f8ea6cb": function(p0i32) {
/******/ 						return installedModules["./pkg/index.js"].exports["__wbg_createProgram_6cba8a735f8ea6cb"](p0i32);
/******/ 					},
/******/ 					"__wbg_createShader_c5c64298269c5a6e": function(p0i32,p1i32) {
/******/ 						return installedModules["./pkg/index.js"].exports["__wbg_createShader_c5c64298269c5a6e"](p0i32,p1i32);
/******/ 					},
/******/ 					"__wbg_drawArrays_7f96725a62319b4b": function(p0i32,p1i32,p2i32,p3i32) {
/******/ 						return installedModules["./pkg/index.js"].exports["__wbg_drawArrays_7f96725a62319b4b"](p0i32,p1i32,p2i32,p3i32);
/******/ 					},
/******/ 					"__wbg_enable_09e06855698405c4": function(p0i32,p1i32) {
/******/ 						return installedModules["./pkg/index.js"].exports["__wbg_enable_09e06855698405c4"](p0i32,p1i32);
/******/ 					},
/******/ 					"__wbg_enableVertexAttribArray_c179309e602794a1": function(p0i32,p1i32) {
/******/ 						return installedModules["./pkg/index.js"].exports["__wbg_enableVertexAttribArray_c179309e602794a1"](p0i32,p1i32);
/******/ 					},
/******/ 					"__wbg_getProgramInfoLog_a5f2ea92c5808978": function(p0i32,p1i32,p2i32) {
/******/ 						return installedModules["./pkg/index.js"].exports["__wbg_getProgramInfoLog_a5f2ea92c5808978"](p0i32,p1i32,p2i32);
/******/ 					},
/******/ 					"__wbg_getProgramParameter_559011a8a9828aba": function(p0i32,p1i32,p2i32) {
/******/ 						return installedModules["./pkg/index.js"].exports["__wbg_getProgramParameter_559011a8a9828aba"](p0i32,p1i32,p2i32);
/******/ 					},
/******/ 					"__wbg_getShaderInfoLog_0ea4b55f79381cff": function(p0i32,p1i32,p2i32) {
/******/ 						return installedModules["./pkg/index.js"].exports["__wbg_getShaderInfoLog_0ea4b55f79381cff"](p0i32,p1i32,p2i32);
/******/ 					},
/******/ 					"__wbg_getShaderParameter_6ead6144a6d5ec96": function(p0i32,p1i32,p2i32) {
/******/ 						return installedModules["./pkg/index.js"].exports["__wbg_getShaderParameter_6ead6144a6d5ec96"](p0i32,p1i32,p2i32);
/******/ 					},
/******/ 					"__wbg_getUniformLocation_54581133c30d8412": function(p0i32,p1i32,p2i32,p3i32) {
/******/ 						return installedModules["./pkg/index.js"].exports["__wbg_getUniformLocation_54581133c30d8412"](p0i32,p1i32,p2i32,p3i32);
/******/ 					},
/******/ 					"__wbg_linkProgram_4aa482eff67ec70f": function(p0i32,p1i32) {
/******/ 						return installedModules["./pkg/index.js"].exports["__wbg_linkProgram_4aa482eff67ec70f"](p0i32,p1i32);
/******/ 					},
/******/ 					"__wbg_shaderSource_dda1391a65c6436e": function(p0i32,p1i32,p2i32,p3i32) {
/******/ 						return installedModules["./pkg/index.js"].exports["__wbg_shaderSource_dda1391a65c6436e"](p0i32,p1i32,p2i32,p3i32);
/******/ 					},
/******/ 					"__wbg_uniform1f_9204950d854cc564": function(p0i32,p1i32,p2f32) {
/******/ 						return installedModules["./pkg/index.js"].exports["__wbg_uniform1f_9204950d854cc564"](p0i32,p1i32,p2f32);
/******/ 					},
/******/ 					"__wbg_useProgram_fb2ec9874f8b29a4": function(p0i32,p1i32) {
/******/ 						return installedModules["./pkg/index.js"].exports["__wbg_useProgram_fb2ec9874f8b29a4"](p0i32,p1i32);
/******/ 					},
/******/ 					"__wbg_vertexAttribPointer_99b70d8bcc23800d": function(p0i32,p1i32,p2i32,p3i32,p4i32,p5i32,p6i32) {
/******/ 						return installedModules["./pkg/index.js"].exports["__wbg_vertexAttribPointer_99b70d8bcc23800d"](p0i32,p1i32,p2i32,p3i32,p4i32,p5i32,p6i32);
/******/ 					},
/******/ 					"__wbg_viewport_a76743827062cd86": function(p0i32,p1i32,p2i32,p3i32,p4i32) {
/******/ 						return installedModules["./pkg/index.js"].exports["__wbg_viewport_a76743827062cd86"](p0i32,p1i32,p2i32,p3i32,p4i32);
/******/ 					},
/******/ 					"__wbg_instanceof_HtmlInputElement_4d332a28ab7863fb": function(p0i32) {
/******/ 						return installedModules["./pkg/index.js"].exports["__wbg_instanceof_HtmlInputElement_4d332a28ab7863fb"](p0i32);
/******/ 					},
/******/ 					"__wbg_value_af5a0b9336dbeb2c": function(p0i32,p1i32) {
/******/ 						return installedModules["./pkg/index.js"].exports["__wbg_value_af5a0b9336dbeb2c"](p0i32,p1i32);
/******/ 					},
/******/ 					"__wbg_instanceof_HtmlCanvasElement_69ef8df401e5d26d": function(p0i32) {
/******/ 						return installedModules["./pkg/index.js"].exports["__wbg_instanceof_HtmlCanvasElement_69ef8df401e5d26d"](p0i32);
/******/ 					},
/******/ 					"__wbg_width_c780f3aa15468362": function(p0i32,p1i32) {
/******/ 						return installedModules["./pkg/index.js"].exports["__wbg_width_c780f3aa15468362"](p0i32,p1i32);
/******/ 					},
/******/ 					"__wbg_height_ab2b0aa93160e434": function(p0i32,p1i32) {
/******/ 						return installedModules["./pkg/index.js"].exports["__wbg_height_ab2b0aa93160e434"](p0i32,p1i32);
/******/ 					},
/******/ 					"__wbg_getContext_fc68e7f629e2b10a": function(p0i32,p1i32,p2i32) {
/******/ 						return installedModules["./pkg/index.js"].exports["__wbg_getContext_fc68e7f629e2b10a"](p0i32,p1i32,p2i32);
/******/ 					},
/******/ 					"__wbg_newnoargs_4f6527054d7f1f1d": function(p0i32,p1i32) {
/******/ 						return installedModules["./pkg/index.js"].exports["__wbg_newnoargs_4f6527054d7f1f1d"](p0i32,p1i32);
/******/ 					},
/******/ 					"__wbg_call_183c0b733b35a027": function(p0i32,p1i32) {
/******/ 						return installedModules["./pkg/index.js"].exports["__wbg_call_183c0b733b35a027"](p0i32,p1i32);
/******/ 					},
/******/ 					"__wbg_now_bcad4cf5936b8b8d": function() {
/******/ 						return installedModules["./pkg/index.js"].exports["__wbg_now_bcad4cf5936b8b8d"]();
/******/ 					},
/******/ 					"__wbg_globalThis_eb9027a878db64ad": function() {
/******/ 						return installedModules["./pkg/index.js"].exports["__wbg_globalThis_eb9027a878db64ad"]();
/******/ 					},
/******/ 					"__wbg_self_69a78003cf074413": function() {
/******/ 						return installedModules["./pkg/index.js"].exports["__wbg_self_69a78003cf074413"]();
/******/ 					},
/******/ 					"__wbg_window_db757fdea9443777": function() {
/******/ 						return installedModules["./pkg/index.js"].exports["__wbg_window_db757fdea9443777"]();
/******/ 					},
/******/ 					"__wbg_global_8efdae4f126ac8b4": function() {
/******/ 						return installedModules["./pkg/index.js"].exports["__wbg_global_8efdae4f126ac8b4"]();
/******/ 					},
/******/ 					"__wbg_newwithbyteoffsetandlength_4f25ce3a5bb4486f": function(p0i32,p1i32,p2i32) {
/******/ 						return installedModules["./pkg/index.js"].exports["__wbg_newwithbyteoffsetandlength_4f25ce3a5bb4486f"](p0i32,p1i32,p2i32);
/******/ 					},
/******/ 					"__wbg_buffer_459b85bd7a0b346a": function(p0i32) {
/******/ 						return installedModules["./pkg/index.js"].exports["__wbg_buffer_459b85bd7a0b346a"](p0i32);
/******/ 					},
/******/ 					"__wbindgen_is_undefined": function(p0i32) {
/******/ 						return installedModules["./pkg/index.js"].exports["__wbindgen_is_undefined"](p0i32);
/******/ 					},
/******/ 					"__wbindgen_object_clone_ref": function(p0i32) {
/******/ 						return installedModules["./pkg/index.js"].exports["__wbindgen_object_clone_ref"](p0i32);
/******/ 					},
/******/ 					"__wbindgen_number_get": function(p0i32,p1i32) {
/******/ 						return installedModules["./pkg/index.js"].exports["__wbindgen_number_get"](p0i32,p1i32);
/******/ 					},
/******/ 					"__wbindgen_boolean_get": function(p0i32) {
/******/ 						return installedModules["./pkg/index.js"].exports["__wbindgen_boolean_get"](p0i32);
/******/ 					},
/******/ 					"__wbindgen_debug_string": function(p0i32,p1i32) {
/******/ 						return installedModules["./pkg/index.js"].exports["__wbindgen_debug_string"](p0i32,p1i32);
/******/ 					},
/******/ 					"__wbindgen_throw": function(p0i32,p1i32) {
/******/ 						return installedModules["./pkg/index.js"].exports["__wbindgen_throw"](p0i32,p1i32);
/******/ 					},
/******/ 					"__wbindgen_rethrow": function(p0i32) {
/******/ 						return installedModules["./pkg/index.js"].exports["__wbindgen_rethrow"](p0i32);
/******/ 					},
/******/ 					"__wbindgen_memory": function() {
/******/ 						return installedModules["./pkg/index.js"].exports["__wbindgen_memory"]();
/******/ 					},
/******/ 					"__wbindgen_closure_wrapper219": function(p0i32,p1i32,p2i32) {
/******/ 						return installedModules["./pkg/index.js"].exports["__wbindgen_closure_wrapper219"](p0i32,p1i32,p2i32);
/******/ 					}
/******/ 				}
/******/ 			};
/******/ 		},
/******/ 	};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/ 	// This file contains only the entry chunk.
/******/ 	// The chunk loading function for additional chunks
/******/ 	__webpack_require__.e = function requireEnsure(chunkId) {
/******/ 		var promises = [];
/******/
/******/
/******/ 		// JSONP chunk loading for javascript
/******/
/******/ 		var installedChunkData = installedChunks[chunkId];
/******/ 		if(installedChunkData !== 0) { // 0 means "already installed".
/******/
/******/ 			// a Promise means "currently loading".
/******/ 			if(installedChunkData) {
/******/ 				promises.push(installedChunkData[2]);
/******/ 			} else {
/******/ 				// setup Promise in chunk cache
/******/ 				var promise = new Promise(function(resolve, reject) {
/******/ 					installedChunkData = installedChunks[chunkId] = [resolve, reject];
/******/ 				});
/******/ 				promises.push(installedChunkData[2] = promise);
/******/
/******/ 				// start chunk loading
/******/ 				var script = document.createElement('script');
/******/ 				var onScriptComplete;
/******/
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.src = jsonpScriptSrc(chunkId);
/******/
/******/ 				// create error before stack unwound to get useful stacktrace later
/******/ 				var error = new Error();
/******/ 				onScriptComplete = function (event) {
/******/ 					// avoid mem leaks in IE.
/******/ 					script.onerror = script.onload = null;
/******/ 					clearTimeout(timeout);
/******/ 					var chunk = installedChunks[chunkId];
/******/ 					if(chunk !== 0) {
/******/ 						if(chunk) {
/******/ 							var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 							var realSrc = event && event.target && event.target.src;
/******/ 							error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 							error.name = 'ChunkLoadError';
/******/ 							error.type = errorType;
/******/ 							error.request = realSrc;
/******/ 							chunk[1](error);
/******/ 						}
/******/ 						installedChunks[chunkId] = undefined;
/******/ 					}
/******/ 				};
/******/ 				var timeout = setTimeout(function(){
/******/ 					onScriptComplete({ type: 'timeout', target: script });
/******/ 				}, 120000);
/******/ 				script.onerror = script.onload = onScriptComplete;
/******/ 				document.head.appendChild(script);
/******/ 			}
/******/ 		}
/******/
/******/ 		// Fetch + compile chunk loading for webassembly
/******/
/******/ 		var wasmModules = {"1":["./pkg/index_bg.wasm"]}[chunkId] || [];
/******/
/******/ 		wasmModules.forEach(function(wasmModuleId) {
/******/ 			var installedWasmModuleData = installedWasmModules[wasmModuleId];
/******/
/******/ 			// a Promise means "currently loading" or "already loaded".
/******/ 			if(installedWasmModuleData)
/******/ 				promises.push(installedWasmModuleData);
/******/ 			else {
/******/ 				var importObject = wasmImportObjects[wasmModuleId]();
/******/ 				var req = fetch(__webpack_require__.p + "" + {"./pkg/index_bg.wasm":"3d42f10923831551dbb2"}[wasmModuleId] + ".module.wasm");
/******/ 				var promise;
/******/ 				if(importObject instanceof Promise && typeof WebAssembly.compileStreaming === 'function') {
/******/ 					promise = Promise.all([WebAssembly.compileStreaming(req), importObject]).then(function(items) {
/******/ 						return WebAssembly.instantiate(items[0], items[1]);
/******/ 					});
/******/ 				} else if(typeof WebAssembly.instantiateStreaming === 'function') {
/******/ 					promise = WebAssembly.instantiateStreaming(req, importObject);
/******/ 				} else {
/******/ 					var bytesPromise = req.then(function(x) { return x.arrayBuffer(); });
/******/ 					promise = bytesPromise.then(function(bytes) {
/******/ 						return WebAssembly.instantiate(bytes, importObject);
/******/ 					});
/******/ 				}
/******/ 				promises.push(installedWasmModules[wasmModuleId] = promise.then(function(res) {
/******/ 					return __webpack_require__.w[wasmModuleId] = (res.instance || res).exports;
/******/ 				}));
/******/ 			}
/******/ 		});
/******/ 		return Promise.all(promises);
/******/ 	};
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// on error function for async loading
/******/ 	__webpack_require__.oe = function(err) { console.error(err); throw err; };
/******/
/******/ 	// object with all WebAssembly.instance exports
/******/ 	__webpack_require__.w = {};
/******/
/******/ 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// Note that a dynamic `import` statement here is required due to\n// webpack/webpack#6615, but in theory `import { greet } from './pkg';`\n// will work here one day as well!\nconst rust = Promise.all(/*! import() */[__webpack_require__.e(0), __webpack_require__.e(1)]).then(__webpack_require__.bind(null, /*! ./pkg */ \"./pkg/index.js\"));\n\nrust\n    // .then(m => {\n    // })\n    .catch(console.error);\n\n\n//# sourceURL=webpack:///./index.js?");

/***/ })

/******/ });