//var monopolyApp = angular.module('monopolyApp', ['ui.router']);

monopolyApp.config(function ($stateProvider, $urlRouterProvider) {
  //
  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise("/mainmenu");
  //
  // Now set up the states
  $stateProvider
    .state('mainmenu', {
      url: "/mainmenu",
      templateUrl: "app/views/mainmenu.html",
      controller: "mainMenuCtrl as mainmenu"
    })
    .state('newgame', {
      url: "/newgame/:loadGame",
      templateUrl: "app/views/game.html",
      controller: "gameCtrl as gameController"
    })
    .state('settings', {
        url: "/settings",
        templateUrl: "app/views/settings.html",
        controller: "settingsCtrl as settings"
    })
    .state('rules', {
        url: "/rules/:inGame",
        templateUrl: "app/views/rules.html",
        controller: "rulesCtrl as rules"
    })
    .state('pause', {
        url: "/pause",
        templateUrl: "app/views/pause.html",
        controller: "pauseCtrl as pause"
    });
});