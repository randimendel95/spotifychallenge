var data;
var baseUrl = 'https://api.spotify.com/v1/search?type=track&query='

//app name
var myApp = angular.module('myApp', ['firebase'])

var myCtrl = myApp.controller('myCtrl', function($scope, $http, $firebaseAuth, $firebaseArray, $firebaseObject) {
  
  //reference firebase storage
  var ref = new Firebase("http://spotifychallenge.firebaseio.com");
  
  //reference to store users 
  var usersRef = ref.child("users");

  //object for users 
  $scope.users = $firebaseArray(usersRef);
  
  //create authorization object
  $scope.authObj = $firebaseAuth(ref);
  
  //test if logged in
  var authData = $scope.authObj.$getAuth();
  if(authData) {
    $scope.userId = authData.uid;
  }

  //sign up 
  $scope.signUp = function() {
    console.log("sign up");
    //create the user (set username and password)
    $scope.authObj.$createUser({
      email: $scope.email,
      password: $scope.password,
      fullName: $scope.fullName,
    })
    //log into new user
    .then($scope.logIn)
    //save user's data
    .then(function(authData){
      $scope.userId = authData.uid;
      $scope.users[authData.uid] = {
        fullName: $scope.fullName,
        userImage: $scope.userImage,  
      } 
      $scope.users.$save()   
    })

    //catch errors
    .catch(function(error) {
      console.error("Error: " + error);
    })
  }

  //sign into application
  $scope.signIn = function() {
    console.log("sign in")
    $scope.logIn().then(function(authData) {
      $scope.userId = authData.uid;
    })
  }

  $scope.logIn = function() {
    console.log("log in")
    return $scope.authObj.$authWithPassword({
      email: $scope.email,
      password: $scope.password
    })  
  }

  $scope.logOut = function() {
    $scope.authObj.$unauth()
    $scope.userId = false
  }

  //create audioObject
  $scope.audioObject = {}
  $scope.getSongs = function(track) {
    console.log(track)
    usersRef.push({'searchTerm': track});
    $http.get(baseUrl + $scope.track).success(function(response){
      data = $scope.tracks = response.tracks.items
    })
        
  }

  $scope.play = function(song) {
    if($scope.currentSong == song) {
      $scope.audioObject.pause()
      $scope.currentSong = false
      return
    }
    else {
      if($scope.audioObject.pause != undefined) $scope.audioObject.pause()
      $scope.audioObject = new Audio(song);
      $scope.audioObject.play()  
      $scope.currentSong = song
    }
  }


  $scope.findTop = function(song) {
  

  }
});

// Add tool tips to anything with a title property
$('body').tooltip({
    selector: '[title]'
});
