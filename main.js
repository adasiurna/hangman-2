//variables, words array, answer letters array
var setNewGame = function (words) {
  //set variables
  var wordh = words[Math.floor(Math.random() * words.length)];
  var word = wordh.hexDecode();
  var answerArray = [];
  var guessedLettersArray = [];
  var remainingLetters = word.length;
  var wrongLetters = 0;

  //prepare DOM
  $("#letters").html('');
  $('#tried_letters').html('');
  for (var i = 0; i < word.length; i++) {
    $("#letters").append('<div class="letter">_</div>');
    answerArray[i] = "_";
  }

  //return game object
  return {
    word: word,
    answerArray: answerArray,
    guessedLettersArray: guessedLettersArray,
    remainingLetters: remainingLetters,
    wrongLetters: wrongLetters
  }
}

var Game = setNewGame(words);

//on reload hit
$('#reload').on('click', function () {
  $("#right").html('<img src="./guy0.png" alt="hangman guy">');
  $('#message').remove();
  $('#imageContainerS').fadeOut(1500);
  $('#imageContainerF').fadeOut(1500);
  $('#tried_letters_block').show();
  $('form').html('<input id="input-letter" type="text" autofocus><input type="submit" value="Spėju">').delay(1500);
  $('form #input-letter').focus();
  Game = setNewGame(words);
}) //reload click handler ends

$('#guess').on('submit', function (e) {
  e.preventDefault();
  var playerGuess = $('#guess #input-letter').val().toLowerCase();

  //let's check if letter was already guessed
  if (Game.guessedLettersArray.length > 1) {
    for (var i = 0; i < Game.guessedLettersArray.length; i++) {
      if (Game.guessedLettersArray[i] === playerGuess) {
        alert('Šią raidę jau spėjai!');
        $('#guess #input-letter').val('');
        return;
      }
    }
  }

  //if a guess is right (must be only one _letter_ update game status)
  if ((playerGuess) && (playerGuess.length < 2) && (isNaN(playerGuess))) {

    //update guessed letters
    Game.guessedLettersArray.push(playerGuess);
    $("#tried_letters").append('<span>' + playerGuess + ', </span>');
    $('#guess #input-letter').val('');

    //update answer array
    var correctGuess = false;
    for (var j = 0; j < Game.word.length; j++) {
      if (Game.word[j] === playerGuess) {
        correctGuess = true;
        Game.answerArray[j] = playerGuess;
        $('#letters div.letter').eq(j).addClass('guessed-letter').html(playerGuess);
        Game.remainingLetters--;
      }
    }
    if (!correctGuess && Game.wrongLetters < 8) {
      console.log(Game.wrongLetters);
      Game.wrongLetters++;
      if (Game.wrongLetters < 8) {
        $("#right").html('<img src="./guy' + Game.wrongLetters + '.png" alt="hangman guy">');
      }
    }

    //if player has lost
    if (!correctGuess && Game.wrongLetters > 6) {
      $('#imageContainerMainF').before('<h1 id="message">Kaip gaila, neatspėjai :(</h1>');
      $('#input-letter').attr('disabled', true);
      $('#imageContainerMainF').css('display', 'flex');
      $('#imageContainerF').delay(500).slideDown(500);
      $('#tried_letters_block').hide();
    }

    //if player has guessed
    if (Game.remainingLetters === 0 && Game.wrongLetters === 0) {
      $('#imageContainerMainS').before('<h1 id="message">WOW!!! ATSPĖJAI BE KLAIDŲ!!!</h1>');
      $('#input-letter').attr('disabled', true);
      $('#imageContainerMainS').css('display', 'flex');
      $('#imageContainerS').delay(500).slideDown(500);
      $('#tried_letters_block').hide();
    }
    else if (Game.remainingLetters === 0 && Game.wrongLetters <= 5) {
      $('#imageContainerMainS').before('<h1 id="message">ATSPĖJAI!!!</h1>');
      $('#input-letter').attr('disabled', true);
      $('#imageContainerMainS').css('display', 'flex');
      $('#imageContainerS').delay(500).slideDown(500);
      $('#tried_letters_block').hide();
    }
    else if (Game.remainingLetters === 0 && Game.wrongLetters > 5) {
      $('#imageContainerMainS').before('<h1 id="message">PAGALIAU ATSPĖJAI!!!</h1>');
      $('#input-letter').attr('disabled', true);
      $('#imageContainerMainS').css('display', 'flex');
      $('#imageContainerS').delay(500).slideDown(500);
      $('#tried_letters_block').hide();
    }

    //after game round, put cursor to input
    $('form #input-letter').focus();

  } else {
    alert('Įveskite vieną raidę');
    $('#guess #input-letter').val('');
    $('form #input-letter').focus();
  }

}) // guess click handler ends

