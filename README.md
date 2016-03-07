# Prestissimo 
*Playing as fast as one can*


Advantages:
- Non biased, non opiniated minimalist framework (mostly vanilla implementation with naming conventions) 
- Isomorphic web application (both side created with JavaScript) Server side using [Hapi.js][1] framework with non intrusive view engine: Dust.js, client side using any 3rd party framework: vanilla-js, jQuery, bootstrap, and the same dust view engine.
- Dual rendering. For higher performance views can be executed on both server and client side. For maximum performance initial rendering happens on the server and any additional DOM manipulation (partial rendering) occur on the client side. ([Google Performance Conference Video][3])
- View models are containing the view related logic (transformation, rendering and configuration options) and 100% reused on both server and client side.
- View engine syntax is not intruding or distorting HTML domain. Minimal overlap provides more freedom to UX designers and developers both. Views are reused on both server and client side.
- Server side unit tests for all models and every other piece of business logic (100% coverage). Using [Lab.js test runner][6] and [Chai assertion library][7]
- UI testing with test harnesses to isolate individual elements and decrease testing complexity. Test harnesses also help UX designers and developers to work with smaller components. Also helps QA to test with simplified isolated use cases.
- Full validation with [Joi.js][5] framework (comes with Hapi) 
- Module separation based on naming conventions and a single build process to combine all client and server side resources using [Gulp.js][4]

## Commands
.sh = MAC
.bat = PC

* install.bat - install with C++ version specified
* run (.bat/.sh) or `node index.js`
* debug (.bat/.sh) or `node-debug index.js`
* gulp - lint 
* gulp - bundle
* gulp (default is bundle)

## Links
- [http://hapijs.com][1] (MVC framework)
- [http://dustjs.com][2] (View engine)
- [https://github.com/hapijs/joi][5] (Validation)
- [http://gulpjs.com][4] (Application build process)
- [http://swagger.io](http://swagger.io) (Service API test framework)
- [https://github.com/hapijs/lab][6] (JS unit test execution framework)
- [http://chaijs.com][7] (Assertion library)


[1]:http://hapijs.com
[2]:http://dustjs.com
[3]:https://www.youtube.com/watch?v=VKTWdaupft0&feature=youtu.be&t=14m28s
[4]:http://gulpjs.com
[5]:https://github.com/hapijs/joi
[6]:https://github.com/hapijs/lab
[7]:http://chaijs.com
