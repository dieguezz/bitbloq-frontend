/* global MobileDetect */
'use strict';

/**
 * @ngdoc service
 * @name bitbloqApp.common
 * @description
 * # common
 * Service in the bitbloqApp.
 */
angular.module('bitbloqApp')
    .service('common', function($filter, $log, envData, packageData, userApi, User, $location, $rootScope, $q, _, $document, $sessionStorage, $translate, ngDialog, $http, amMoment, $window, $cookieStore, alertsService, utils) {

        var req = {
            method: 'POST',
            url: 'http://localhost:3000/test',
            data: {
                test: 'test'
            }
        };

        $http(req).then(function() {
          console.log("ok");
        }, function() {
          console.log("nok")
        });

        // log out any responses we get from the chrome app

        /* Antiguo método
          var rpcId = 0;

          const rpcCallbacks = {};

          var port;
          var active = false;
          var idPrefix = 'p_' + Math.random() + '_' + Date.now() + '_';

          const editorExtensionId = "jkjgmpkgcpdmdhcpgnojidhinccfofhe";

          function rpc(name, params, callback) {
              var message = {
                  type: 'rpc',
                  params: params,
                  name: name
              };
              if (callback) {
                  rpcId++;
                  message.id = idPrefix + rpcId;
                  rpcCallbacks[message.id] = callback;
                  //TODO handle timeouts?
              }

              postMessage(message, function(msg) {
                  if (msg.error) {
                      callback(error);
                      delete rpcCallbacks[message.id];
                  }
              });
          }

          function postMessage(message, callback) {
              console.log("postMessage");
              connect();
              if (port) {
                  console.log("message before sending");
                  console.log(message);
                  port.postMessage(message);
              } else {
                  if (callback) {
                      callback({
                          error: new Error('not connected to plugin')
                      });
                  }
              }
          }

          function handleMessage(msg) {
              // console.log('handle plugin msg', msg, serverPort);
              if (msg.type === 'rpc' && msg.id && rpcCallbacks[msg.id]) {
                  rpcCallbacks[msg.id](msg.result);
                  delete rpcCallbacks[msg.id];
              } else if (msg.type === 'data' && msg.name && msg.data) {
                  console.log("entro???");
                  //    events.emit('data_' + msg.conType + '_' + msg.name, msg.data);
              }
          }

          function connect() {
              if (!active && window.chrome) {
                  try {
                      var connectedPort = chrome.runtime.connect(editorExtensionId);
                      connectedPort.onDisconnect.addListener(function(d) {
                          console.log('port disconnected', d);
                          active = false;
                          port = null;
                      });

                      connectedPort.onMessage.addListener(handleMessage);

                      port = connectedPort;

                      active = true;

                  } catch (exp) {
                      console.log('cant connect to plugin', exp);
                  }
              }
          }

          /*List portsconnected*/
        /*  rpc('listSerial', [], function(result) {
              //results is an array containing ports available to connect
              console.log("result");
              console.log(result);
              msg.reply(result);
          });*/

        /*
                        rpc('writeFirmware', ['uno', '/dev/ttyACM0', ':100000000C945D000C9485000C9485000C94850084\n:100010000C9485000C9485000C9485000C9485004C\n:100020000C9485000C9485000C9485000C9485003C\n:100030000C9485000C9485000C9485000C9485002C\n:100040000C94B5000C9485000C9474030C94A603D6\n:100050000C9485000C9485000C9485000C9485000C\n:100060000C9485000C94850000000008000201003B\n:100070000003040700000000000000000102040863\n:100080001020408001020408102001020408102002\n:10009000040404040404040402020202020203032E\n:1000A0000303030300000000250028002B000000CC\n:1000B0000000240027002A00D60311241FBECFEF22\n:1000C000D8E0DEBFCDBF11E0A0E0B1E0E0E5F9E0AF\n:1000D00002C005900D92A832B107D9F721E0A8E23D\n:1000E000B1E001C01D92AE3CB207E1F710E0CAEBEF\n:1000F000D0E004C02297FE010E94A204C83BD107B1\n:10010000C9F70E946E040C94A6040C94000026E02B\n:1001100040E855E260E070E081E391E00E94120364\n:1001200061E0809100010C94C001CF93DF9362E005\n:1001300071E081E391E00E945B04C0E0D1E061E006\n:1001400088810E94F90164EF71E080E090E00E94F4\n:10015000220160E088810E94F90164EF71E080E093\n:1001600090E0DF91CF910C9422011F920F920FB675\n:100170000F9211242F933F938F939F93AF93BF932D\n:100180008091290190912A01A0912B01B0912C011D\n:100190003091280123E0230F2D3720F40196A11D73\n:1001A000B11D05C026E8230F0296A11DB11D2093A5\n:1001B00028018093290190932A01A0932B01B093E9\n:1001C0002C0180912D0190912E01A0912F01B091D1\n:1001D00030010196A11DB11D80932D0190932E0138\n:1001E000A0932F01B0933001BF91AF919F918F9158\n:1001F0003F912F910F900FBE0F901F9018953FB712\n:10020000F89480912D0190912E01A0912F01B09131\n:10021000300126B5A89B05C02F3F19F00196A11DFE\n:10022000B11D3FBF6627782F892F9A2F620F711D4E\n:10023000811D911D42E0660F771F881F991F4A9507\n:10024000D1F708958F929F92AF92BF92CF92DF9293\n:10025000EF92FF926B017C010E94FF004B015C0159\n:10026000C114D104E104F104F1F00E947D040E9464\n:10027000FF00681979098A099B09683E7340810566\n:10028000910570F321E0C21AD108E108F10888EE67\n:10029000880E83E0981EA11CB11CC114D104E10496\n:1002A000F10429F7DDCFFF90EF90DF90CF90BF9062\n:1002B000AF909F908F900895789484B5826084BDAC\n:1002C00084B5816084BD85B5826085BD85B581605A\n:1002D00085BDEEE6F0E0808181608083E1E8F0E0BA\n:1002E0001082808182608083808181608083E0E8E9\n:1002F000F0E0808181608083E1EBF0E080818460C8\n:100300008083E0EBF0E0808181608083EAE7F0E0C9\n:10031000808184608083808182608083808181602D\n:1003200080838081806880831092C100089583302B\n:1003300081F028F4813099F08230A1F0089587305F\n:10034000A9F08830B9F08430D1F4809180008F7D9D\n:1003500003C0809180008F7780938000089584B5DA\n:100360008F7702C084B58F7D84BD08958091B000E1\n:100370008F7703C08091B0008F7D8093B000089587\n:10038000CF93DF9390E0FC01E458FF4F2491FC01F0\n:10039000E057FF4F8491882349F190E0880F991F1F\n:1003A000FC01E255FF4FA591B4918C559F4FFC0184\n:1003B000C591D4919FB7611108C0F8948C91209594\n:1003C00082238C93888182230AC0623051F4F8948E\n:1003D0008C91322F309583238C938881822B888354\n:1003E00004C0F8948C91822B8C939FBFDF91CF91A6\n:1003F00008950F931F93CF93DF931F92CDB7DEB76E\n:10040000282F30E0F901E859FF4F8491F901E458B1\n:10041000FF4F1491F901E057FF4F04910023C9F0F9\n:10042000882321F069830E9497016981E02FF0E021\n:10043000EE0FFF1FEC55FF4FA591B4919FB7F894B5\n:100440008C91611103C01095812301C0812B8C9385\n:100450009FBF0F90DF91CF911F910F910895FC01E5\n:10046000818D228D90E0805C9F4F821B91098F735C\n:1004700099270895FC01918D828D981731F0828D16\n:10048000E80FF11D858D90E008958FEF9FEF08959F\n:10049000FC01918D828D981761F0828DDF01A80F8C\n:1004A000B11D5D968C91928D9F5F9F73928F90E0AE\n:1004B00008958FEF9FEF08958CEC93E0892B49F01E\n:1004C00080E090E0892B29F00E94CC0381110C94EC\n:1004D00000000895FC01848DDF01A80FB11DA35A0F\n:1004E000BF4F2C91848D90E001968F739927848F54\n:1004F000A689B7892C93A089B1898C9180648C934B\n:10050000938D848D981306C00288F389E02D808135\n:100510008F7D80830895CF93DF93EC01888D8823AE\n:10052000C9F0EA89FB89808185FD05C0A889B98960\n:100530008C9186FD0FC00FB607FCF5CF808185FF3B\n:10054000F2CFA889B9898C9185FFEDCFCE010E94A9\n:100550006A02E7CFDF91CF910895CF92DF92FF92A9\n:100560000F931F93CF93DF931F92CDB7DEB76C012C\n:1005700081E0D60158968C9358975B969C915B9737\n:100580005C968C915C97981307C05096ED91FC9106\n:100590005197808185FD2EC0F601038D10E00F5F1D\n:1005A0001F4F0F731127F02EF601848DF81211C022\n:1005B0000FB607FCF9CFD6015096ED91FC915197FB\n:1005C000808185FFF1CFC60169830E946A0269813B\n:1005D000EBCF838DE80FF11DE35AFF4F6083D60107\n:1005E0005B960C935B975296ED91FC9153978081AB\n:1005F00080620CC0D6015696ED91FC9157976083AE\n:100600005096ED91FC91519780818064808381E0C8\n:1006100090E00F90DF91CF911F910F91FF90DF90AD\n:10062000CF900895BF92CF92DF92EF92FF92CF9337\n:10063000DF93EC016A017B01B22EE889F98982E03F\n:100640008083411581EE580761057105A1F060E0D6\n:1006500079E08DE390E0A70196010E947E0421508D\n:100660003109410951095695479537952795211527\n:1006700080E1380798F0E889F989108260E874E829\n:100680008EE190E0A70196010E947E04215031097D\n:10069000410951095695479537952795EC85FD8574\n:1006A0003083EE85FF852083188EEC89FD89B0822A\n:1006B000EA89FB89808180618083EA89FB89808166\n:1006C00088608083EA89FB89808180688083EA89E9\n:1006D000FB8980818F7D8083DF91CF91FF90EF90A8\n:1006E000DF90CF90BF9008951F920F920FB60F9298\n:1006F00011242F938F939F93EF93FF93E0914101E8\n:10070000F09142018081E0914701F091480182FD22\n:1007100012C0908180914A018F5F8F7320914B01AD\n:10072000821751F0E0914A01F0E0EF5CFE4F958FA7\n:1007300080934A0101C08081FF91EF919F918F9139\n:100740002F910F900FBE0F901F9018951F920F9230\n:100750000FB60F9211242F933F934F935F936F9394\n:100760007F938F939F93AF93BF93EF93FF9381E317\n:1007700091E00E946A02FF91EF91BF91AF919F912A\n:100780008F917F916F915F914F913F912F910F903A\n:100790000FBE0F901F90189581E391E00E942F02E9\n:1007A00021E0892B09F420E0822F08951092340172\n:1007B0001092330188EE93E0A0E0B0E08093350121\n:1007C00090933601A0933701B09338018BE091E00C\n:1007D000909332018093310185EC90E090933E013B\n:1007E00080933D0184EC90E09093400180933F0121\n:1007F00080EC90E0909342018093410181EC90E085\n:10080000909344018093430182EC90E090934601E1\n:100810008093450186EC90E09093480180934701D6\n:1008200010924A0110924B0110924C0110924D010E\n:100830000895CF92DF92EF92FF920F931F93CF9381\n:10084000DF937C016A01EB0100E010E00C151D054F\n:1008500071F06991D701ED91FC910190F081E02D4B\n:10086000C7010995892B19F00F5F1F4FEFCFC80102\n:10087000DF91CF911F910F91FF90EF90DF90CF907C\n:1008800008956115710581F0DB010D900020E9F7F5\n:10089000AD0141505109461B570BDC01ED91FC9114\n:1008A0000280F381E02D099480E090E0089567E1F3\n:1008B00071E00C9441040F931F93CF93DF93EC01ED\n:1008C0000E9441048C01CE010E945704800F911FA9\n:1008D000DF91CF911F910F91089508950E945C01BF\n:1008E0000E946D040E948700CCE5D2E00E94950032\n:1008F0002097E1F30E945C02F9CF0895A1E21A2E3D\n:10090000AA1BBB1BFD010DC0AA1FBB1FEE1FFF1FB3\n:10091000A217B307E407F50720F0A21BB30BE40B03\n:10092000F50B661F771F881F991F1A9469F760954A\n:100930007095809590959B01AC01BD01CF01089504\n:10094000EE0FFF1F0590F491E02D0994F894FFCF6E\n:100950000800686F6C610000000000AD0219042FF0\n:100960000248023A028B020D0A006E616E00696E47\n:0809700066006F7666002E00A0\n:00000001FF'], function(result) {
                            console.log("result");
                            console.log(result);
                            msg.reply(result);
                        });

                        */
        /*

                        rpc('writeFirmware', ['uno', '/dev/ttyACM0', 'StandardFirmata.cpp.hex'], function(result) {
                            console.log("result");
                            console.log(result);
                            msg.reply(result);
                        });


        */
        var exports = {},
            navigatorLang = $window.navigator.language || $window.navigator.userLanguage;

        $log.log('Bitbloq version:', packageData.version);

        //See drag directives
        exports.draggingElement = {};

        exports.isLoggedIn = userApi.isLoggedIn;

        exports.isAdmin = userApi.isAdmin;

        exports.section = '';

        exports.user = null;

        exports.appAlert = null;

        exports.warnedOfIncompatibility = false;

        exports.properties = null;

        exports.isLoading = false;

        exports.connectedWeb2Board = false;

        exports.session = {
            bloqTab: false,
            project: {},
            save: false
        };

        exports.translate = $filter('translate');

        exports.removeProjects = [];

        exports.refreshTokenPromise = null;

        exports.oldVersionMasthead = false;

        exports.urlImage = envData.config.gCloudUrl + '/images/';

        exports.os = utils.getOs();

        exports.langToBQ = {
            ca: 'es',
            de: 'de',
            en: 'uk',
            es: 'es',
            eu: 'es',
            fr: 'fr',
            gl: 'es',
            it: 'it',
            nl: 'uk',
            pt: 'pt',
            ru: 'ru',
            zh: 'uk'
        };

        var langToAngularLng = {
            ca: 'ca-ES',
            de: 'de-De',
            en: 'en-GB',
            es: 'es-ES',
            eu: 'eu-ES',
            fr: 'fr-FR',
            gl: 'gl',
            it: 'it-IT',
            nl: 'en-GB',
            pt: 'pt-PT',
            ru: 'en-GB',
            zh: 'en-GB'
        };

        exports.setUser = function(user) {
            if (loadedUserPromise.promise.$$state.status !== 0) {
                loadedUserPromise = $q.defer();
            }
            if (user !== null && typeof user === 'object') {
                var lng = user.language || navigatorLang || 'es-ES';
                $translate.use(lng);
                if (user.cookiePolicyAccepted) {
                    $sessionStorage.cookiesAccepted = true;
                    exports.cookiesAccepted = true;
                }
                exports.user = user;
                loadedUserPromise.resolve();
            } else {
                console.log('exports.user.language');
                console.log(exports.user);
                exports.user = null;
                $translate.use(navigatorLang);
                $cookieStore.remove('token');
                loadedUserPromise.reject();
            }
        };

        exports.itsUserLoaded = function() {
            // loadedUserPromise.resolve();
            return loadedUserPromise.promise;
        };

        var md = new MobileDetect(window.navigator.userAgent);

        exports.acceptCookies = function() {
            if (exports.user) {
                userApi.update({
                    cookiePolicyAccepted: true
                });
            }
            $sessionStorage.cookiesAccepted = true;
            exports.cookiesAccepted = true;
        };

        exports.goToLogin = function() {
            var url = $location.url();
            $location.path('login').search({
                init: url
            });
        };

        exports.goToRegister = function() {
            var url = $location.url();
            $location.path('register').search({
                init: url
            });
        };

        function processRoute() {
            ngDialog.closeAll();
            var pathArray = $location.path().split('/'),
                firstPathItem = pathArray[1],
                secondPathItem = pathArray[2];

            if (firstPathItem === 'help' && secondPathItem && secondPathItem === 'forum') {
                $log.debug('section', secondPathItem);
                exports.section = secondPathItem;
            } else {
                $log.debug('section', firstPathItem);
                exports.section = firstPathItem;
            }

            checkForCompatibility($location.path());
        }

        function checkForCompatibility(path) {
            if (path && path !== '' && !$sessionStorage.hasBeenWarnedAboutCompatibility) {
                if (isNaN(md.version('Chrome')) || md.version('Chrome') < 40 || md.phone() || md.tablet()) {
                    if (!exports.continueToURL) {
                        exports.continueToURL = path;
                    }
                    if (isNaN(md.version('Chrome')) && !md.phone() && !md.tablet() || md.version('Chrome') < 40 && !md.phone() && !md.tablet()) {
                        $location.path('/unsupported/desktop');
                    } else if (md.tablet()) {
                        $location.path('/unsupported/tablet');
                    } else if (md.phone()) {
                        $location.path('/unsupported/phone');
                    }
                }
            }
        }

        function getProperties() {
            $http.get(envData.config.serverUrl + 'property').success(function(items) {
                $log.debug('properties', items);
                exports.properties = items[0];
            });
        }

        var loadedUserPromise = $q.defer();

        if (!exports.user) {
            User.get().$promise.then(function(user) {
                if (user.username) {
                    delete user.$promise;
                    delete user.$resolved;
                    exports.setUser(user);
                    exports.userIsLoaded = true;
                } else {
                    exports.userIsLoaded = true;
                    exports.setUser(null);
                }
            }, function() {
                exports.userIsLoaded = true;
                exports.setUser(null);
            });

        }

        if ($sessionStorage.cookiesAccepted) {
            exports.cookiesAccepted = true;
        }

        if (navigatorLang) {
            navigatorLang = langToAngularLng[navigatorLang.split('-')[0]];
        }

        processRoute();

        exports.itsUserLoaded().finally(function() {
            getProperties();
        });

        $rootScope.$on('$locationChangeSuccess', function() {
            processRoute();
        });

        exports.saveUserLanguage = function(newLang) {
            amMoment.changeLocale(newLang);
            if (exports.user && (exports.user.language !== newLang)) {
                exports.user.language = newLang;
                userApi.update({
                    language: newLang
                }).then(function() {
                    alertsService.add('account-saved', 'saved-user', 'ok', 5000);
                }, function() {
                    alertsService.add('account-saved-error', 'saved-user', 'warning');
                });
            }
        };

        return exports;

    });

/* MODALS */
//  This example is using lodash _extend()
//  Type of modals:
//      -Without buttons
//      -With confirm button: set confirmOnly as true in the modal scope
//      -With confirm and reject buttons: set confirmOrReject as true in the modal scope
//  Controller side:
// $scope.clickToOpen = function() {

//     var confirmAction = function(e) {
//             ngDialog.close('ngdialog1');
//         },
//         parent = $rootScope,
//         modalOptions = parent.$new();

//     _.extend(modalOptions, {
//         title: 'hola que ase',
//         confirmOnly: true,
//         buttonConfirm: 'Aceptar',
//         buttonReject: 'Cancelar',
//         confirmAction: confirmAction
//     });

//     ngDialog.open({
//         template: '/views/modal.html',
//         className: 'modal--container',
//         scope: modalOptions,
//         showClose: false
//     });
// };
//
// Template side:
// ng-click="clickToOpen()"
