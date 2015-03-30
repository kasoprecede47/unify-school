/*!
 *
 * SchoolAdminApp - Bootstrap Admin App + AngularJS
 *
 * Author: @themicon_co
 * Website: http://themicon.co
 * License: http://support.wrapbootstrap.com/knowledge_base/topics/usage-licenses
 *
 */

if (typeof $ === 'undefined') {
    throw new Error('This application\'s JavaScript requires jQuery');
}

// APP START
// -----------------------------------

var App = angular.module('SchoolAdminApp', [
    'ngRoute',
    'ngAnimate',
    'ngStorage',
    'ngCookies',
    'pascalprecht.translate',
    'ui.bootstrap',
    'ui.router',
    'oc.lazyLoad',
    'cfp.loadingBar',
    'ngSanitize',
    'ngResource',
    'ui.utils',
    'SchoolAdminApp.services'
]);

App.run(
    ["$rootScope", "$state", "$stateParams", '$window', '$templateCache', 'SchoolDataService',
        function ($rootScope, $state, $stateParams, $window, $templateCache, SchoolDataService) {
            // Set reference to access them from any scope
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
            $rootScope.$storage = $window.localStorage;

            // Uncomment this to disable template cache
            /*$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
             if (typeof(toState) !== 'undefined'){
             $templateCache.remove(toState.templateUrl);
             }
             });*/

            // Scope Globals
            // -----------------------------------
            $rootScope.app = {
                name: 'SchoolAdminApp',
                description: 'UnifySchools Admin App',
                year: ((new Date()).getFullYear()),
                layout: {
                    isFixed: true,
                    isCollapsed: false,
                    isBoxed: false,
                    isRTL: false,
                    horizontal: false,
                    isFloat: false,
                    asideHover: false,
                    theme: null
                },
                useFullLayout: false,
                hiddenFooter: false,
                viewAnimation: 'ng-fadeInUp'
            };
            $rootScope.user = SchoolDataService.adminUser;

        }]);

/**=========================================================
 * Module: config.js
 * App routes and resources configuration
 =========================================================*/

App.constant('ViewBaseURL', '/admin/dashboard/partial');
App.constant('AssetsBaseURL', '/framework');

App.config(['$ocLazyLoadProvider', 'APP_REQUIRES', function ($ocLazyLoadProvider, APP_REQUIRES) {
    'use strict';

    // Lazy Load modules configuration
    $ocLazyLoadProvider.config({
        debug: false,
        events: true,
        modules: APP_REQUIRES.modules
    });

}]).config(['$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
    function ($controllerProvider, $compileProvider, $filterProvider, $provide) {
        'use strict';
        // registering components after bootstrap
        App.controller = $controllerProvider.register;
        App.directive = $compileProvider.directive;
        App.filter = $filterProvider.register;
        App.factory = $provide.factory;
        App.service = $provide.service;
        App.constant = $provide.constant;
        App.value = $provide.value;

    }]).config(['$translateProvider', function ($translateProvider) {

    $translateProvider.useStaticFilesLoader({
        prefix: '/framework/app/i18n/',
        suffix: '.json'
    });
    $translateProvider.preferredLanguage('en');
    $translateProvider.useLocalStorage();
    $translateProvider.usePostCompiling(true);

}]).config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeBar = true;
    cfpLoadingBarProvider.includeSpinner = false;
    cfpLoadingBarProvider.latencyThreshold = 500;
    cfpLoadingBarProvider.parentSelector = '.wrapper > section';
}]).config(['$tooltipProvider', function ($tooltipProvider) {

    $tooltipProvider.options({appendToBody: true});

}])
;

/**=========================================================
 * Module: constants.js
 * Define constants to inject across the application
 =========================================================*/
App
    .constant('APP_COLORS', {
        'primary': '#5d9cec',
        'success': '#27c24c',
        'info': '#23b7e5',
        'warning': '#ff902b',
        'danger': '#f05050',
        'inverse': '#131e26',
        'green': '#37bc9b',
        'pink': '#f532e5',
        'purple': '#7266ba',
        'dark': '#3a3f51',
        'yellow': '#fad732',
        'gray-darker': '#232735',
        'gray-dark': '#3a3f51',
        'gray': '#dde6e9',
        'gray-light': '#e4eaec',
        'gray-lighter': '#edf1f2'
    })
    .constant('APP_MEDIAQUERY', {
        'desktopLG': 1200,
        'desktop': 992,
        'tablet': 768,
        'mobile': 480
    })
    .constant('APP_REQUIRES', {
        // jQuery based and standalone scripts
        scripts: {
            'modernizr': ['/framework/vendor/modernizr/modernizr.js'],
            'icons': ['/framework/vendor/fontawesome/css/font-awesome.min.css',
                '/framework/vendor/simple-line-icons/css/simple-line-icons.css']
        },
        // Angular based script (use the right module name)
        modules: [
            {
                name: 'toaster',
                files: ['/framework/vendor/angularjs-toaster/toaster.js', '/framework/vendor/angularjs-toaster/toaster.css']
            },
            {
                name: 'ngTable', files: ['/framework/vendor/ng-table/dist/ng-table.min.js',
                '/framework/vendor/ng-table/dist/ng-table.min.css']
            },
            {name: 'ngTableExport', files: ['/framework/vendor/ng-table-export/ng-table-export.js']},
            {name: 'xeditable',files: ['/framework/vendor/angular-xeditable/dist/js/xeditable.js',
                '/framework/vendor/angular-xeditable/dist/css/xeditable.css']},
        ]

    })
;
/**=========================================================
 * Module: main.js
 * Main Application Controller
 =========================================================*/

App.controller('AppController',
    ['$rootScope', '$scope', '$state', '$translate', '$window', '$localStorage', '$timeout', 'toggleStateService', 'colors', 'browser', 'cfpLoadingBar',
        function ($rootScope, $scope, $state, $translate, $window, $localStorage, $timeout, toggle, colors, browser, cfpLoadingBar) {
            "use strict";

            // Setup the layout mode
            $rootScope.app.layout.horizontal = ( $rootScope.$stateParams.layout == 'app-h');

            // Loading bar transition
            // -----------------------------------
            var thBar;
            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                if ($('.wrapper > section').length) // check if bar container exists
                    thBar = $timeout(function () {
                        cfpLoadingBar.start();
                    }, 0); // sets a latency Threshold
            });
            $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                event.targetScope.$watch("$viewContentLoaded", function () {
                    $timeout.cancel(thBar);
                    cfpLoadingBar.complete();
                });
            });


            // Hook not found
            $rootScope.$on('$stateNotFound',
                function (event, unfoundState, fromState, fromParams) {
                    console.log(unfoundState.to); // "lazy.state"
                    console.log(unfoundState.toParams); // {a:1, b:2}
                    console.log(unfoundState.options); // {inherit:false} + default options
                });
            // Hook error
            $rootScope.$on('$stateChangeError',
                function (event, toState, toParams, fromState, fromParams, error) {
                    console.log(error);
                });
            // Hook success
            $rootScope.$on('$stateChangeSuccess',
                function (event, toState, toParams, fromState, fromParams) {
                    // display new view from top
                    $window.scrollTo(0, 0);
                    // Save the route title
                    $rootScope.currTitle = $state.current.title;
                });

            $rootScope.currTitle = $state.current.title;
            $rootScope.pageTitle = function () {
                var title = $rootScope.app.name + ' - ' + ($rootScope.currTitle || $rootScope.app.description);
                document.title = title;
                return title;
            };

            // iPad may presents ghost click issues
            // if( ! browser.ipad )
            // FastClick.attach(document.body);

            // Close submenu when sidebar change from collapsed to normal
            $rootScope.$watch('app.layout.isCollapsed', function (newValue, oldValue) {
                if (newValue === false)
                    $rootScope.$broadcast('closeSidebarMenu');
            });

            // Restore layout settings
            if (angular.isDefined($localStorage.layout))
                $scope.app.layout = $localStorage.layout;
            else
                $localStorage.layout = $scope.app.layout;

            $rootScope.$watch("app.layout", function () {
                $localStorage.layout = $scope.app.layout;
            }, true);


            // Allows to use branding color with interpolation
            // {{ colorByName('primary') }}
            $scope.colorByName = colors.byName;

            // Internationalization
            // ----------------------

            $scope.language = {
                // Handles language dropdown
                listIsOpen: false,
                // list of available languages
                available: {
                    'en': 'English',
                    'es_AR': 'Espa�ol'
                },
                // display always the current ui language
                init: function () {
                    var proposedLanguage = $translate.proposedLanguage() || $translate.use();
                    var preferredLanguage = $translate.preferredLanguage(); // we know we have set a preferred one in app.config
                    $scope.language.selected = $scope.language.available[(proposedLanguage || preferredLanguage)];
                },
                set: function (localeId, ev) {
                    // Set the new idiom
                    $translate.use(localeId);
                    // save a reference for the current language
                    $scope.language.selected = $scope.language.available[localeId];
                    // finally toggle dropdown
                    $scope.language.listIsOpen = !$scope.language.listIsOpen;
                }
            };

            $scope.language.init();

            // Restore application classes state
            toggle.restoreState($(document.body));

            // cancel click event easily
            $rootScope.cancel = function ($event) {
                $event.stopPropagation();
            };

        }]);

/**=========================================================
 * Module: sidebar-menu.js
 * Handle sidebar collapsible elements
 =========================================================*/

App.controller('SidebarController', ['$rootScope', '$scope', '$state', '$http', '$timeout', 'Utils', 'ResourcesService',
    function ($rootScope, $scope, $state, $http, $timeout, Utils, ResourcesService) {

        var collapseList = [];

        // demo: when switch from collapse to hover, close all items
        $rootScope.$watch('app.layout.asideHover', function (oldVal, newVal) {
            if (newVal === false && oldVal === true) {
                closeAllBut(-1);
            }
        });

        $rootScope.$on('selectedSchoolCategoryChanged', function (event, obj) {
            console.log('event selectedSchoolCat received');

            if (angular.isDefined($scope.menuItems)) {
                angular.forEach($scope.menuItems, function (value, key) {
                    if (value.text == 'Classes') {
                        value.submenu = prepareSubmenuItems(obj.value.school_category_arms);
                    }
                });
            }
        });

        function prepareSubmenuItems(school_cat_arms) {
            var response = [];

            angular.forEach(school_cat_arms, function (value, key) {
                var item = {};
                item.text = value.display_name;
                item.sref = 'app.viewClassArm';
                item.params = {id: value.id};

                this.push(item);
            }, response);

            return response;
        }

        // Check item and children active state
        var isActive = function (item) {

            if (!item) return;

            if (!item.sref || item.sref == '#') {
                var foundActive = false;
                angular.forEach(item.submenu, function (value, key) {
                    if (isActive(value)) foundActive = true;
                });
                return foundActive;
            }
            else
                return $state.is(item.sref) || $state.includes(item.sref);
        };

        // Load menu from json file
        // -----------------------------------

        $scope.getMenuItemPropClasses = function (item) {
            return (item.heading ? 'nav-heading' : '') +
                (isActive(item) ? ' active' : '');
        };

        $scope.loadSidebarMenu = function () {

            var menuURL = ResourcesService.getMenuResourceUrl();
            $http.get(menuURL)
                .success(function (items) {
                    $scope.menuItems = items;
                })
                .error(function (data, status, headers, config) {
                    alert('Failure loading menu');
                });
        };

        $scope.loadSidebarMenu();

        // Handle sidebar collapse items
        // -----------------------------------

        $scope.addCollapse = function ($index, item) {
            collapseList[$index] = $rootScope.app.layout.asideHover ? true : !isActive(item);
        };

        $scope.isCollapse = function ($index) {
            return (collapseList[$index]);
        };

        $scope.toggleCollapse = function ($index, isParentItem) {


            // collapsed sidebar doesn't toggle drodopwn
            if (Utils.isSidebarCollapsed() || $rootScope.app.layout.asideHover) return true;

            // make sure the item index exists
            if (angular.isDefined(collapseList[$index])) {
                if (!$scope.lastEventFromChild) {
                    collapseList[$index] = !collapseList[$index];
                    closeAllBut($index);
                }
            }
            else if (isParentItem) {
                closeAllBut(-1);
            }

            $scope.lastEventFromChild = isChild($index);

            return true;

        };

        function closeAllBut(index) {
            index += '';
            for (var i in collapseList) {
                if (index < 0 || index.indexOf(i) < 0)
                    collapseList[i] = true;
            }
        }

        function isChild($index) {
            return (typeof $index === 'string') && !($index.indexOf('-') < 0);
        }

    }]);

/**=========================================================
 * Module: navbar-search.js
 * Navbar search toggler * Auto dismiss on ESC key
 =========================================================*/

App.directive('searchOpen', ['navSearch', function (navSearch) {
    'use strict';

    return {
        restrict: 'A',
        controller: ["$scope", "$element", function ($scope, $element) {
            $element
                .on('click', function (e) {
                    e.stopPropagation();
                })
                .on('click', navSearch.toggle);
        }]
    };

}]).directive('searchDismiss', ['navSearch', function (navSearch) {
    'use strict';

    var inputSelector = '.navbar-form input[type="text"]';

    return {
        restrict: 'A',
        controller: ["$scope", "$element", function ($scope, $element) {

            $(inputSelector)
                .on('click', function (e) {
                    e.stopPropagation();
                })
                .on('keyup', function (e) {
                    if (e.keyCode == 27) // ESC
                        navSearch.dismiss();
                });

            // click anywhere closes the search
            $(document).on('click', navSearch.dismiss);
            // dismissable options
            $element
                .on('click', function (e) {
                    e.stopPropagation();
                })
                .on('click', navSearch.dismiss);
        }]
    };

}]);


/**=========================================================
 * Module: sidebar.js
 * Wraps the sidebar and handles collapsed state
 =========================================================*/

App.directive('sidebar', ['$rootScope', '$window', 'Utils', function ($rootScope, $window, Utils) {

    var $win = $($window);
    var $body = $('body');
    var $scope;
    var $sidebar;
    var currentState = $rootScope.$state.current.name;

    return {
        restrict: 'EA',
        template: '<nav class="sidebar" ng-transclude></nav>',
        transclude: true,
        replace: true,
        link: function (scope, element, attrs) {

            $scope = scope;
            $sidebar = element;

            var eventName = Utils.isTouch() ? 'click' : 'mouseenter';
            var subNav = $();
            $sidebar.on(eventName, '.nav > li', function () {

                if (Utils.isSidebarCollapsed() || $rootScope.app.layout.asideHover) {

                    subNav.trigger('mouseleave');
                    subNav = toggleMenuItem($(this));

                    // Used to detect click and touch events outside the sidebar
                    sidebarAddBackdrop();

                }

            });

            scope.$on('closeSidebarMenu', function () {
                removeFloatingNav();
            });

            // Normalize state when resize to mobile
            $win.on('resize', function () {
                if (!Utils.isMobile())
                    $body.removeClass('aside-toggled');
            });

            // Adjustment on route changes
            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                currentState = toState.name;
                // Hide sidebar automatically on mobile
                $('body.aside-toggled').removeClass('aside-toggled');

                $rootScope.$broadcast('closeSidebarMenu');
            });

        }
    };

    function sidebarAddBackdrop() {
        var $backdrop = $('<div/>', {'class': 'dropdown-backdrop'});
        $backdrop.insertAfter('.aside-inner').on("click mouseenter", function () {
            removeFloatingNav();
        });
    }

    // Open the collapse sidebar submenu items when on touch devices
    // - desktop only opens on hover
    function toggleTouchItem($element) {
        $element
            .siblings('li')
            .removeClass('open')
            .end()
            .toggleClass('open');
    }

    // Handles hover to open items under collapsed menu
    // -----------------------------------
    function toggleMenuItem($listItem) {

        removeFloatingNav();

        var ul = $listItem.children('ul');

        if (!ul.length) return $();
        if ($listItem.hasClass('open')) {
            toggleTouchItem($listItem);
            return $();
        }

        var $aside = $('.aside');
        var $asideInner = $('.aside-inner'); // for top offset calculation
        // float aside uses extra padding on aside
        var mar = parseInt($asideInner.css('padding-top'), 0) + parseInt($aside.css('padding-top'), 0);
        var subNav = ul.clone().appendTo($aside);

        toggleTouchItem($listItem);

        var itemTop = ($listItem.position().top + mar) - $sidebar.scrollTop();
        var vwHeight = $win.height();

        subNav
            .addClass('nav-floating')
            .css({
                position: $scope.app.layout.isFixed ? 'fixed' : 'absolute',
                top: itemTop,
                bottom: (subNav.outerHeight(true) + itemTop > vwHeight) ? 0 : 'auto'
            });

        subNav.on('mouseleave', function () {
            toggleTouchItem($listItem);
            subNav.remove();
        });

        return subNav;
    }

    function removeFloatingNav() {
        $('.dropdown-backdrop').remove();
        $('.sidebar-subnav.nav-floating').remove();
        $('.sidebar li.open').removeClass('open');
    }

}]);
/**=========================================================
 * Module: toggle-state.js
 * Toggle a classname from the BODY Useful to change a state that
 * affects globally the entire layout or more than one item
 * Targeted elements must have [toggle-state="CLASS-NAME-TO-TOGGLE"]
 * User no-persist to avoid saving the sate in browser storage
 =========================================================*/

App.directive('toggleState', ['toggleStateService', function (toggle) {
    'use strict';

    return {
        restrict: 'A',
        link: function (scope, element, attrs) {

            var $body = $('body');

            $(element)
                .on('click', function (e) {
                    e.preventDefault();
                    var classname = attrs.toggleState;

                    if (classname) {
                        if ($body.hasClass(classname)) {
                            $body.removeClass(classname);
                            if (!attrs.noPersist)
                                toggle.removeState(classname);
                        }
                        else {
                            $body.addClass(classname);
                            if (!attrs.noPersist)
                                toggle.addState(classname);
                        }

                    }

                });
        }
    };

}]);

/**=========================================================
 * Module: browser.js
 * Browser detection
 =========================================================*/

App.service('browser', function () {
    "use strict";

    var matched, browser;

    var uaMatch = function (ua) {
        ua = ua.toLowerCase();

        var match = /(opr)[\/]([\w.]+)/.exec(ua) ||
            /(chrome)[ \/]([\w.]+)/.exec(ua) ||
            /(version)[ \/]([\w.]+).*(safari)[ \/]([\w.]+)/.exec(ua) ||
            /(webkit)[ \/]([\w.]+)/.exec(ua) ||
            /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
            /(msie) ([\w.]+)/.exec(ua) ||
            ua.indexOf("trident") >= 0 && /(rv)(?::| )([\w.]+)/.exec(ua) ||
            ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) ||
            [];

        var platform_match = /(ipad)/.exec(ua) ||
            /(iphone)/.exec(ua) ||
            /(android)/.exec(ua) ||
            /(windows phone)/.exec(ua) ||
            /(win)/.exec(ua) ||
            /(mac)/.exec(ua) ||
            /(linux)/.exec(ua) ||
            /(cros)/i.exec(ua) ||
            [];

        return {
            browser: match[3] || match[1] || "",
            version: match[2] || "0",
            platform: platform_match[0] || ""
        };
    };

    matched = uaMatch(window.navigator.userAgent);
    browser = {};

    if (matched.browser) {
        browser[matched.browser] = true;
        browser.version = matched.version;
        browser.versionNumber = parseInt(matched.version);
    }

    if (matched.platform) {
        browser[matched.platform] = true;
    }

    // These are all considered mobile platforms, meaning they run a mobile browser
    if (browser.android || browser.ipad || browser.iphone || browser["windows phone"]) {
        browser.mobile = true;
    }

    // These are all considered desktop platforms, meaning they run a desktop browser
    if (browser.cros || browser.mac || browser.linux || browser.win) {
        browser.desktop = true;
    }

    // Chrome, Opera 15+ and Safari are webkit based browsers
    if (browser.chrome || browser.opr || browser.safari) {
        browser.webkit = true;
    }

    // IE11 has a new token so we will assign it msie to avoid breaking changes
    if (browser.rv) {
        var ie = "msie";

        matched.browser = ie;
        browser[ie] = true;
    }

    // Opera 15+ are identified as opr
    if (browser.opr) {
        var opera = "opera";

        matched.browser = opera;
        browser[opera] = true;
    }

    // Stock Android browsers are marked as Safari on Android.
    if (browser.safari && browser.android) {
        var android = "android";

        matched.browser = android;
        browser[android] = true;
    }

    // Assign the name and platform variable
    browser.name = matched.browser;
    browser.platform = matched.platform;


    return browser;

});
/**=========================================================
 * Module: colors.js
 * Services to retrieve global colors
 =========================================================*/

App.factory('colors', ['APP_COLORS', function (colors) {

    return {
        byName: function (name) {
            return (colors[name] || '#fff');
        }
    };

}]);

/**=========================================================
 * Module: nav-search.js
 * Services to share navbar search functions
 =========================================================*/

App.service('navSearch', function () {
    var navbarFormSelector = 'form.navbar-form';
    return {
        toggle: function () {

            var navbarForm = $(navbarFormSelector);

            navbarForm.toggleClass('open');

            var isOpen = navbarForm.hasClass('open');

            navbarForm.find('input')[isOpen ? 'focus' : 'blur']();

        },

        dismiss: function () {
            $(navbarFormSelector)
                .removeClass('open')      // Close control
                .find('input[type="text"]').blur() // remove focus
                .val('')                    // Empty input
            ;
        }
    };

});
/**=========================================================
 * Module: helpers.js
 * Provides helper functions for routes definition
 =========================================================*/

App.provider('RouteHelpers', ['APP_REQUIRES', function (appRequires) {
    "use strict";

    // Set here the base of the relative path
    // for all app views
    this.basepath = function (uri) {
        return '/framework/app/views/' + uri;
    };

    // Generates a resolve object by passing script names
    // previously configured in constant.APP_REQUIRES
    this.resolveFor = function () {
        var _args = arguments;
        return {
            deps: ['$ocLazyLoad', '$q', function ($ocLL, $q) {
                // Creates a promise chain for each argument
                var promise = $q.when(1); // empty promise
                for (var i = 0, len = _args.length; i < len; i++) {
                    promise = andThen(_args[i]);
                }
                return promise;

                // creates promise to chain dynamically
                function andThen(_arg) {
                    // also support a function that returns a promise
                    if (typeof _arg == 'function')
                        return promise.then(_arg);
                    else
                        return promise.then(function () {
                            // if is a module, pass the name. If not, pass the array
                            var whatToLoad = getRequired(_arg);
                            // simple error check
                            if (!whatToLoad) return $.error('Route resolve: Bad resource name [' + _arg + ']');
                            // finally, return a promise
                            return $ocLL.load(whatToLoad);
                        });
                }

                // check and returns required data
                // analyze module items with the form [name: '', files: []]
                // and also simple array of script files (for not angular js)
                function getRequired(name) {
                    if (appRequires.modules)
                        for (var m in appRequires.modules)
                            if (appRequires.modules[m].name && appRequires.modules[m].name === name)
                                return appRequires.modules[m];
                    return appRequires.scripts && appRequires.scripts[name];
                }

            }]
        };
    }; // resolveFor

    // not necessary, only used in config block for routes
    this.$get = function () {
    };

}]);


/**=========================================================
 * Module: toggle-state.js
 * Services to share toggle state functionality
 =========================================================*/

App.service('toggleStateService', ['$rootScope', function ($rootScope) {

    var storageKeyName = 'toggleState';

    // Helper object to check for words in a phrase //
    var WordChecker = {
        hasWord: function (phrase, word) {
            return new RegExp('(^|\\s)' + word + '(\\s|$)').test(phrase);
        },
        addWord: function (phrase, word) {
            if (!this.hasWord(phrase, word)) {
                return (phrase + (phrase ? ' ' : '') + word);
            }
        },
        removeWord: function (phrase, word) {
            if (this.hasWord(phrase, word)) {
                return phrase.replace(new RegExp('(^|\\s)*' + word + '(\\s|$)*', 'g'), '');
            }
        }
    };

    // Return service public methods
    return {
        // Add a state to the browser storage to be restored later
        addState: function (classname) {
            var data = angular.fromJson($rootScope.$storage[storageKeyName]);

            if (!data) {
                data = classname;
            }
            else {
                data = WordChecker.addWord(data, classname);
            }

            $rootScope.$storage[storageKeyName] = angular.toJson(data);
        },

        // Remove a state from the browser storage
        removeState: function (classname) {
            var data = $rootScope.$storage[storageKeyName];
            // nothing to remove
            if (!data) return;

            data = WordChecker.removeWord(data, classname);

            $rootScope.$storage[storageKeyName] = angular.toJson(data);
        },

        // Load the state string and restore the classlist
        restoreState: function ($elem) {
            var data = angular.fromJson($rootScope.$storage[storageKeyName]);

            // nothing to restore
            if (!data) return;
            $elem.addClass(data);
        }

    };

}]);
/**=========================================================
 * Module: utils.js
 * Utility library to use across the theme
 =========================================================*/

App.service('Utils', ["$window", "APP_MEDIAQUERY", function ($window, APP_MEDIAQUERY) {
    'use strict';

    var $html = angular.element("html"),
        $win = angular.element($window),
        $body = angular.element('body');

    return {
        // DETECTION
        support: {
            transition: (function () {
                var transitionEnd = (function () {

                    var element = document.body || document.documentElement,
                        transEndEventNames = {
                            WebkitTransition: 'webkitTransitionEnd',
                            MozTransition: 'transitionend',
                            OTransition: 'oTransitionEnd otransitionend',
                            transition: 'transitionend'
                        }, name;

                    for (name in transEndEventNames) {
                        if (element.style[name] !== undefined) return transEndEventNames[name];
                    }
                }());

                return transitionEnd && {end: transitionEnd};
            })(),
            animation: (function () {

                var animationEnd = (function () {

                    var element = document.body || document.documentElement,
                        animEndEventNames = {
                            WebkitAnimation: 'webkitAnimationEnd',
                            MozAnimation: 'animationend',
                            OAnimation: 'oAnimationEnd oanimationend',
                            animation: 'animationend'
                        }, name;

                    for (name in animEndEventNames) {
                        if (element.style[name] !== undefined) return animEndEventNames[name];
                    }
                }());

                return animationEnd && {end: animationEnd};
            })(),
            requestAnimationFrame: window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            },
            touch: (
            ('ontouchstart' in window && navigator.userAgent.toLowerCase().match(/mobile|tablet/)) ||
            (window.DocumentTouch && document instanceof window.DocumentTouch) ||
            (window.navigator['msPointerEnabled'] && window.navigator['msMaxTouchPoints'] > 0) || //IE 10
            (window.navigator['pointerEnabled'] && window.navigator['maxTouchPoints'] > 0) || //IE >=11
            false
            ),
            mutationobserver: (window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver || null)
        },
        // UTILITIES
        isInView: function (element, options) {

            var $element = $(element);

            if (!$element.is(':visible')) {
                return false;
            }

            var window_left = $win.scrollLeft(),
                window_top = $win.scrollTop(),
                offset = $element.offset(),
                left = offset.left,
                top = offset.top;

            options = $.extend({topoffset: 0, leftoffset: 0}, options);

            if (top + $element.height() >= window_top && top - options.topoffset <= window_top + $win.height() &&
                left + $element.width() >= window_left && left - options.leftoffset <= window_left + $win.width()) {
                return true;
            } else {
                return false;
            }
        },
        langdirection: $html.attr("dir") == "rtl" ? "right" : "left",
        isTouch: function () {
            return $html.hasClass('touch');
        },
        isSidebarCollapsed: function () {
            return $body.hasClass('aside-collapsed');
        },
        isSidebarToggled: function () {
            return $body.hasClass('aside-toggled');
        },
        isMobile: function () {
            return $win.width() < APP_MEDIAQUERY.tablet;
        }
    };
}]);
// To run this code, edit file
// index.html or index.jade and change
// html data-ng-app attribute from
// SchoolAdminApp to myAppName
// -----------------------------------

var myAppRoutes = angular.module('SchoolAdminApp');

myAppRoutes.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider', 'ViewBaseURL',
    function ($stateProvider, $locationProvider, $urlRouterProvider, helper, ViewBaseURL) {
        'use strict';

        // Set the following to true to enable the HTML5 Mode
        // You may have to set <base> tag in index and a routing configuration in your server
        $locationProvider.html5Mode(false);

        // default route
        $urlRouterProvider.otherwise('/app/home');

        //
        // Application Routes
        // -----------------------------------

        $stateProvider
            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: ViewBaseURL + '/ui/app',
                controller: 'AppController',
                resolve: helper.resolveFor('modernizr', 'icons')
            })
            .state('app.home',
            {
                url: '/home',
                templateUrl: ViewBaseURL + '/home',
                title: 'School Dashboard',
                controller: ['$scope',
                    function ($scope) {

                    }]
            })
            .state('app.viewClassArm',
            {
                url: '/class/:id',
                templateUrl: ViewBaseURL + '/pages/school_class',
                title: 'Class Dashboard',
                controller: ['$scope',
                    function ($scope) {
                    }
                ]
            })
            .state('app.settings',
            {
                url: '/settings',
                templateUrl: ViewBaseURL + '/settings/index',
                title: 'Settings',
                resolve: helper.resolveFor('xeditable'),
                controller: ['$scope',
                    function ($scope) {
                    }
                ]
            })
            .state('app.settings.session_term',
            {
                url: '/session_term',
                templateUrl: ViewBaseURL + '/settings/session_term',
                title: 'Session & Term Settings',
                controller: 'SettingsSessionTermController'
            })
            .state('app.settings.students',
            {
                url: '/students',
                templateUrl: ViewBaseURL + '/settings/students',
                title: 'Students Settings',
                controller: 'SettingsStudentsController'
            })
            .state('app.settings.school',
            {
                url: '/school',
                templateUrl: ViewBaseURL + '/settings/school',
                title: 'School Settings',
                controller: 'SettingsSchoolController'
            })
            .state('app.settings.staff',
            {
                url: '/staff',
                templateUrl: ViewBaseURL + '/settings/staff',
                title: 'Staff Settings',
                controller: 'SettingsStaffController'
            })
            .state('app.settings.classes',
            {
                url: '/classes',
                templateUrl: ViewBaseURL + '/settings/class',
                title: 'Classes Settings',
                controller: 'SettingsClassesController'
            })
            .state('app.settings.courses',
            {
                url: '/courses',
                templateUrl: ViewBaseURL + '/settings/courses',
                title: 'Courses Settings',
                controller: 'SettingsCoursesController'
            })
            .state('app.settings.academics',
            {
                url: '/academics',
                templateUrl: ViewBaseURL + '/settings/academics',
                title: 'Academics Settings',
                controller: 'SettingsAcademicsController'
            })
            .state('app.settings.reports',
            {
                url: '/reports',
                templateUrl: ViewBaseURL + '/settings/reports',
                title: 'Reports Settings',
                controller: 'SettingsReportController'
            })
            .state('app.settings.financials',
            {
                url: '/financial',
                templateUrl: ViewBaseURL + '/settings/financials',
                title: 'Financial Settings',
                controller: 'SettingsFinancialController'
            })
            .state('app.settings.notifications',
            {
                url: '/notifications',
                templateUrl: ViewBaseURL + '/settings/notifications',
                title: 'Notification Settings',
                controller: 'SettingsNotificationController'
            })
            .state('app.settings.administrators',
            {
                url: '/administrators',
                templateUrl: ViewBaseURL + '/settings/administrators',
                title: 'Administrators Settings',
                controller: 'SettingsAdministratorsController'
            })
            //Student Module Routes
            .state('app.enroll_student',
            {
                url: '/students/enroll-student',
                templateUrl: ViewBaseURL + '/students/enroll_student',
                title: 'Enroll A New Student',
                controller: ['$scope',
                    function ($scope) {
                    }
                ]
            })
            .state('app.enroll_students',
            {
                url: '/students/enroll-students',
                templateUrl: ViewBaseURL + '/students/enroll_students',
                title: 'Enroll Many Students',
                controller: ['$scope',
                    function ($scope) {
                    }
                ]
            })
            .state('app.import_students',
            {
                url: '/students/import',
                templateUrl: ViewBaseURL + '/students/import-students',
                title: 'Import Students',
                controller: 'StudentsImportController'
            })
            .state('app.export_students',
            {
                url: '/students/export',
                templateUrl: ViewBaseURL + '/students/export-students',
                title: 'Export Students',
                controller: ['$scope',
                    function ($scope) {
                    }
                ]
            });
        //
        // CUSTOM RESOLVES
        //   Add your own resolves properties
        //   following this object extend
        //   method
        // -----------------------------------
        // .state('app.someroute', {
        //   url: '/some_url',
        //   templateUrl: 'path_to_template.html',
        //   controller: 'someController',
        //   resolve: angular.extend(
        //     helper.resolveFor(), {
        //     // YOUR RESOLVES GO HERE
        //     }
        //   )
        // })
}]);
/**
 * Created by Ak on 2/19/2015.
 */

var app = angular.module('SchoolAdminApp.services', []);

app.factory('TicketServ', ['$resource', 'URLServ', function ($resource, URLServ) {
    return $resource('/resources/ticket/:id', {id: '@id'}, {
        'update': {method: 'PUT'}
    });//URLServ.getResourceUrlFor("ticket"));
}]);

//TicketConfigServ
app.factory('TicketConfigServ', ['$resource', 'URLServ', function ($resource, URLServ) {
    return $resource('/resources/ticket-config/:id', {id: '@id'}, {
        'update': {method: 'PUT'}
    });//URLServ.getResourceUrlFor("ticket"));
}]);

app.factory('DeviceBrandsServ', ['$resource', 'URLServ', function ($resource, URLServ) {
    return $resource('/resources/device_makers/:id', {id: '@id'}, {
        'update': {method: 'PUT'}
    });//URLServ.getResourceUrlFor("ticket"));
}]);

app.factory('AdvisersServ', ['$resource', 'URLServ', function ($resource, URLServ) {
    return $resource('/resources/advisers/:id', {id: '@id'}, {
        'update': {method: 'PUT'}
    });//URLServ.getResourceUrlFor("ticket"));
}]);

app.factory('DevicesServ', ['$resource', 'URLServ', function ($resource, URLServ) {
    return $resource('/resources/devices/:id', {id: '@id'}, {
        'update': {method: 'PUT'}
    });//URLServ.getResourceUrlFor("ticket"));
}]);

app.factory('GradingSystemServ', ['$resource', 'URLServ', function ($resource, URLServ) {
    return $resource('/resources/grading-system-config/:id', {id: '@id'}, {
        'update': {method: 'PUT'}
    });//URLServ.getResourceUrlFor("ticket"));
}]);


app.factory('MailServ', ['$resource', function ($resource) {
    return $resource('/resources/mail', null);//URLServ.getResourceUrlFor("ticket"));
}]);


app.factory('NetworksServ', ['$resource', 'URLServ', function ($resource, URLServ) {
    return $resource('/resources/networks/:id', {id: '@id'}, {
        'update': {method: 'PUT'}
    });//URLServ.getResourceUrlFor("ticket"));
}]);


app.factory('URLServ', ['$rootScope', function ($rootScope) {
    return {
        "getResourceUrlFor": function (name) {
            return $rootScope.data.resources[name];
        }
    }
}]);

app.factory('GadgetEvaluationReward', ['NetworksServ', '$cookieStore', function (NetworksServ, $cookieStore) {
    var reward = {result: ''};

    function getBaseLinePrice(device, size) {
        var baseLinePrice = 0;

        console.log('Device --reward');
        console.log(device);
        console.log(size);

        if (device.base_line_prices.length == 1) {
            baseLinePrice = parseInt(device.base_line_prices[0].value);
        } else {

            angular.forEach(device.base_line_prices, function (v, k) {
                if (v.size == size) {
                    baseLinePrice = parseInt(v.value);
                }
            });
        }

        return baseLinePrice;
    }

    function calculatePriceFromGrade(device, grade, baseLinePrice) {
        console.log(baseLinePrice);
        console.log(device.brand.normal_condition);
        console.log(device.brand);
        console.log(grade);

        switch (grade) {
            case 'A':
                return parseFloat(parseInt(device.brand.normal_condition) / 100.0) * baseLinePrice;
            case 'B':
                return parseFloat(parseInt(device.brand.scratched_condition) / 100.0) * baseLinePrice;
            case 'C':
                return parseFloat(parseInt(device.brand.bad_condition) / 100.0) * baseLinePrice;
        }
    }

    return {
        "calculate": function (model) {
            reward.result = calculatePriceFromGrade(model, model.grade, getBaseLinePrice(model.device, model.size));
            console.log(reward.result);
            $cookieStore.put('last-reward', reward.result);
            return reward.result;
        },
        "getLastReward": function () {
            return $cookieStore.get('last-reward');
        },
        fetchAirtelBonus: function () {
            var network = NetworksServ.get({q: 'airtel'});
            return network;
        }
    }
}]);

app.factory('GradeDeviceServ', ['$rootScope', function ($rootScope) {

    var threshold = {
        'A': 8.1,
        'B': 5.85
    };

    function generateGradePoint(device) {
        var result = {gradePoint: 0};

        angular.forEach(device, function (value, key) {
            if (angular.isDefined(value.rating) && value.rating != '') {
                console.log(value.rating + " -- " + value.weight);
                this.gradePoint += parseInt(value.rating) * value.weight;
                console.log(this.gradePoint);
            }
        }, result);

        return result.gradePoint;
    }

    function generateGradeLetter(gradePoint) {
        var value = parseFloat(gradePoint);

        if (value >= threshold.A) {
            return 'A';
        } else if (value >= threshold.B) {
            return 'B';
        } else {
            return 'C';
        }
    }

    return {
        "getGrade": function (device) {
            var gradePoint = generateGradePoint(device);
            return generateGradeLetter(gradePoint);
        }
    }
}]);

app.factory('PreloadTemplates', ['$templateCache', '$http', 'PRELOAD_UI_LIST', function ($templateCache, $http, PRELOAD_UI_LIST) {
    var templates = PRELOAD_UI_LIST.get();
    return {
        run: function () {
            templates.forEach(function (currentItem) {
                $http.get(currentItem, {cache: $templateCache});
            });
        }
    }
}]);


app.factory('ImageFetcher', ['$http', '$q', function ($http, $q) {
    var searchUrl = "https://www.googleapis.com/customsearch/v1?key=AIzaSyAJ_8QtWECvWTcrukqvfLmRWdARJ2bI2rk&cx=011505858740112002603:dap5yb7naau&q=";

    return {
        fetch: function (query) {
            var images = [];
            var deferred = $q.defer();
            $http.get(searchUrl + encodeURI(query)).then(function (response) {
                console.log(response.data);
                response.data.items.forEach(function (currentValue) {
                    if (angular.isDefined(currentValue.pagemap)) {
                        var temp = currentValue.pagemap.cse_image;//cse_thumbnail;
                        if (angular.isDefined(temp) && angular.isArray(temp)) {
                            temp.forEach(function (cValue) {
                                images.push(cValue);
//                                if (cValue.height > cValue.width) {
//                                    images.push(cValue);
//                                }
                            });
                        } else if (angular.isDefined(temp) && angular.isObject(temp)) {
                            images.push(temp);
                        }
                    }
                });
                console.log(images);
                deferred.resolve(images);
            }, function (response) {
                console.log(response);
                deferred.reject(response);
            });

            return deferred.promise;
        }
    }

}]);


app.factory('ToastService', ['$rootScope', function ($rootScope) {

    if (angular.isUndefined($rootScope.toast)) {
        $rootScope.toast = {messages: [], show: false, type: 'info'};
    }

    return {
        error: function (message) {
            $rootScope.toast = {messages: [message], show: true, type: 'danger'};
        },
        info: function (message) {
            $rootScope.toast = {messages: [message], show: true, type: 'info'};
        },
        success: function (message) {
            $rootScope.toast = {messages: [message], show: true, type: 'success'};
        }
    }
}]);


app.service('TableDataService', ['SchoolDataService', function (SchoolDataService) {

    var TableData = {
        cache: SchoolDataService.schools,
        getData: function ($defer, params) {

            filterdata($defer, params);

            function filterdata($defer, params) {
                var from = (params.page() - 1) * params.count();
                var to = params.page() * params.count();
                var filteredData = TableData.cache.slice(from, to);

                params.total(TableData.cache.length);
                $defer.resolve(filteredData);
            }

        }
    };

    return TableData;

}]);

app.factory('SchoolService', ['$resource', function ($resource) {
    return $resource('/admin/resources/school/:id', {id: '@id'}, {
        'update': {method: 'PUT'}
    });
}]);
var app = angular.module('SchoolAdminApp');
/**
 * Controllers
 *
 */

app.controller('NavBarController', [
        '$scope', '$rootScope', 'SchoolDataService',
        function ($scope, $rootScope, SchoolDataService) {
            $scope.schoolCategories = SchoolDataService.school.school_type.school_categories;
            $scope.selectedSchoolCategory = $scope.schoolCategories[0];

            $scope.prepareSchoolCategory = function ($event, category) {
                $scope.selectedSchoolCategory = category;
                $event.preventDefault();
            };

            $scope.$watch('selectedSchoolCategory', function (newV, oldV) {
                console.log('selectedSchoolCategoryChanged event');
                $rootScope.$broadcast('selectedSchoolCategoryChanged', {value: newV});
                console.log('selectedSchoolCategoryChanged raised');
            });
        }]
);


/**-------------------------------------------------------------------------------
 * Settings Controllers Start
 * -----------------------------------------------------------------------------
 */

/**
 * Session and Term Settings Controller
 */

app.controller('SettingsSessionTermController',['$scope','SchoolDataService',
    function ($scope,SchoolDataService) {
        $scope.sessions = getSessionsFrom(SchoolDataService);
        $scope.sub_sessions = SchoolDataService.school.session_type.sub_sessions;
        $scope.form = {
            school_category: null
        };


        function getSessionsFrom(SchoolDataService){
            return SchoolDataService.school.sessions.sort(function(a,b){
                if (a.name < b.name) {
                    return -1;
                }
                if (a.name > b.name) {
                    return 1;
                }
                return 0;
            });
        }
    }
]);

/**
 * Students Settings Controller
 */

app.controller('SettingsStudentsController',['$scope','SchoolDataService',
    function ($scope,SchoolDataService) {
        $scope.sessions = getSessionsFrom(SchoolDataService);
        $scope.sub_sessions = SchoolDataService.school.session_type.sub_sessions;
        $scope.form = {
            school_category: null
        };


        function getSessionsFrom(SchoolDataService){
            return SchoolDataService.school.sessions.sort(function(a,b){
                if (a.name < b.name) {
                    return -1;
                }
                if (a.name > b.name) {
                    return 1;
                }
                return 0;
            });
        }
    }
]);

/**
 * School Settings Controller
 *
 */

app.controller('SettingsSchoolController',['$scope','SchoolDataService','editableOptions', 'editableThemes',
    function ($scope,SchoolDataService,editableOptions, editableThemes) {

        //template start
        editableOptions.theme = 'bs3';

        editableThemes.bs3.inputClass = 'input-sm';
        editableThemes.bs3.buttonsClass = 'btn-sm';
        editableThemes.bs3.submitTpl = '<button type="submit" class="btn btn-success"><span class="fa fa-check"></span></button>';
        editableThemes.bs3.cancelTpl = '<button type="button" class="btn btn-default" ng-click="$form.$cancel()">'+
        '<span class="fa fa-times text-muted"></span>'+
        '</button>';

        $scope.user = {
            email: 'email@example.com',
            tel: '123-45-67',
            number: 29,
            range: 10,
            url: 'http://example.com',
            search: 'blabla',
            color: '#6a4415',
            date: null,
            time: '12:30',
            datetime: null,
            month: null,
            week: null,
            desc: 'Sed pharetra euismod dolor, id feugiat ante volutpat eget. '
        };

        // Local select
        // -----------------------------------

        $scope.user2 = {
            status: 2
        };

        $scope.statuses = [
            {value: 1, text: 'status1'},
            {value: 2, text: 'status2'},
            {value: 3, text: 'status3'},
            {value: 4, text: 'status4'}
        ];

        $scope.showStatus = function() {
            var selected = $filter('filter')($scope.statuses, {value: $scope.user2.status});
            return ($scope.user2.status && selected.length) ? selected[0].text : 'Not set';
        };

        // select remote
        // -----------------------------------

        $scope.user3 = {
            id: 4,
            text: 'admin' // original value
        };

        $scope.groups = [];

        $scope.loadGroups = function() {
            return $scope.groups.length ? null : $http.get('server/xeditable-groups.json').success(function(data) {
                $scope.groups = data;
            });
        };

        $scope.$watch('user3.id', function(newVal, oldVal) {
            if (newVal !== oldVal) {
                var selected = $filter('filter')($scope.groups, {id: $scope.user3.id});
                $scope.user3.text = selected.length ? selected[0].text : null;
            }
        });

        // Typeahead
        // -----------------------------------

        $scope.user4 = {
            state: 'Arizona'
        };

        $scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

        //template stop




        $scope.sessions = getSessionsFrom(SchoolDataService);
        $scope.sub_sessions = SchoolDataService.school.session_type.sub_sessions;
        $scope.form = {
            school_category: null
        };


        function getSessionsFrom(SchoolDataService){
            return SchoolDataService.school.sessions.sort(function(a,b){
                if (a.name < b.name) {
                    return -1;
                }
                if (a.name > b.name) {
                    return 1;
                }
                return 0;
            });
        }
    }
])

/**
 * Staff Settings Controller
 */


app.controller('SettingsStaffController',['$scope','SchoolDataService',
    function ($scope,SchoolDataService) {
        $scope.sessions = getSessionsFrom(SchoolDataService);
        $scope.sub_sessions = SchoolDataService.school.session_type.sub_sessions;
        $scope.form = {
            school_category: null
        };


        function getSessionsFrom(SchoolDataService){
            return SchoolDataService.school.sessions.sort(function(a,b){
                if (a.name < b.name) {
                    return -1;
                }
                if (a.name > b.name) {
                    return 1;
                }
                return 0;
            });
        }
    }
]);

/**
 * Classes Settings Controller
 */

app.controller('SettingsClassesController',['$scope','SchoolDataService',
    function ($scope,SchoolDataService) {
        $scope.sessions = getSessionsFrom(SchoolDataService);
        $scope.sub_sessions = SchoolDataService.school.session_type.sub_sessions;
        $scope.form = {
            school_category: null
        };


        function getSessionsFrom(SchoolDataService){
            return SchoolDataService.school.sessions.sort(function(a,b){
                if (a.name < b.name) {
                    return -1;
                }
                if (a.name > b.name) {
                    return 1;
                }
                return 0;
            });
        }
    }
]);

/**

 Courses Settings Controller
 */

app.controller('SettingsCoursesController',['$scope','SchoolDataService',
    function ($scope,SchoolDataService) {
        $scope.sessions = getSessionsFrom(SchoolDataService);
        $scope.sub_sessions = SchoolDataService.school.session_type.sub_sessions;
        $scope.form = {
            school_category: null
        };


        function getSessionsFrom(SchoolDataService){
            return SchoolDataService.school.sessions.sort(function(a,b){
                if (a.name < b.name) {
                    return -1;
                }
                if (a.name > b.name) {
                    return 1;
                }
                return 0;
            });
        }
    }
]);

/**
 * Academics Settings Controller
 */

app.controller('SettingsAcademicsController',['$scope','SchoolDataService',
    function ($scope,SchoolDataService) {
        $scope.sessions = getSessionsFrom(SchoolDataService);
        $scope.sub_sessions = SchoolDataService.school.session_type.sub_sessions;
        $scope.form = {
            school_category: null
        };


        function getSessionsFrom(SchoolDataService){
            return SchoolDataService.school.sessions.sort(function(a,b){
                if (a.name < b.name) {
                    return -1;
                }
                if (a.name > b.name) {
                    return 1;
                }
                return 0;
            });
        }
    }
]);

/**
 * Report Settings Controller
 */

app.controller('SettingsReportController',['$scope','SchoolDataService',
    function ($scope,SchoolDataService) {
        $scope.sessions = getSessionsFrom(SchoolDataService);
        $scope.sub_sessions = SchoolDataService.school.session_type.sub_sessions;
        $scope.form = {
            school_category: null
        };


        function getSessionsFrom(SchoolDataService){
            return SchoolDataService.school.sessions.sort(function(a,b){
                if (a.name < b.name) {
                    return -1;
                }
                if (a.name > b.name) {
                    return 1;
                }
                return 0;
            });
        }
    }
]);



app.controller('SettingsFinancialController',['$scope','SchoolDataService',
    function ($scope,SchoolDataService) {
        $scope.sessions = getSessionsFrom(SchoolDataService);
        $scope.sub_sessions = SchoolDataService.school.session_type.sub_sessions;
        $scope.form = {
            school_category: null
        };


        function getSessionsFrom(SchoolDataService){
            return SchoolDataService.school.sessions.sort(function(a,b){
                if (a.name < b.name) {
                    return -1;
                }
                if (a.name > b.name) {
                    return 1;
                }
                return 0;
            });
        }
    }
]);


/**
 * Notification Settings Controller
 */
app.controller('SettingsNotificationController',['$scope','SchoolDataService',
    function ($scope,SchoolDataService) {
        $scope.sessions = getSessionsFrom(SchoolDataService);
        $scope.sub_sessions = SchoolDataService.school.session_type.sub_sessions;
        $scope.form = {
            school_category: null
        };


        function getSessionsFrom(SchoolDataService){
            return SchoolDataService.school.sessions.sort(function(a,b){
                if (a.name < b.name) {
                    return -1;
                }
                if (a.name > b.name) {
                    return 1;
                }
                return 0;
            });
        }
    }
]);



app.controller('SettingsAdministratorsController',['$scope','SchoolDataService',
    function ($scope,SchoolDataService) {
        $scope.sessions = getSessionsFrom(SchoolDataService);
        $scope.sub_sessions = SchoolDataService.school.session_type.sub_sessions;
        $scope.form = {
            school_category: null
        };


        function getSessionsFrom(SchoolDataService){
            return SchoolDataService.school.sessions.sort(function(a,b){
                if (a.name < b.name) {
                    return -1;
                }
                if (a.name > b.name) {
                    return 1;
                }
                return 0;
            });
        }
    }
]);

var app = angular.module('SchoolAdminApp');

app.controller('StudentsImportController',['$scope','SchoolDataService',
    function ($scope,SchoolDataService) {

        console.log(SchoolDataService.school.school_type.school_categories);

        $scope.current_school_classes = null;
        $scope.school_categories = SchoolDataService.school.school_type.school_categories;
        $scope.sessions = getSessionsFrom(SchoolDataService);

        $scope.sub_sessions = SchoolDataService.school.session_type.sub_sessions;
        $scope.form = {
            school_category: null
        };

        $scope.$watch('form.school_category',function(newV,oldV){
            setCurrentSchoolClassesForSchoolType(newV);
        });

        function getSessionsFrom(SchoolDataService){
            return SchoolDataService.school.sessions.sort(function(a,b){
                if (a.name < b.name) {
                    return -1;
                }
                if (a.name > b.name) {
                    return 1;
                }
                return 0;
            });
        }


        function setCurrentSchoolClassesForSchoolType(newV){
            var school_type = null;
            angular.forEach($scope.school_categories,function(value,key){
                if(value.id == newV){
                    school_type = value;
                    return ;
                }
            });

            if(angular.isDefined(school_type) && school_type != null){
                $scope.current_school_classes = school_type.classes;
            }
        }

    }
]);
//# sourceMappingURL=app.js.map