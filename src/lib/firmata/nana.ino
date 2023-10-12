void playBuzzer(String comand, float beat, float tempo, Buzzer my_buzzer) {
  if (comand == "C3") {
    my_buzzer.tone(note_C3, tempo * beat);
  }
  if (comand == "C#3") {
    my_buzzer.tone(note_Db3, tempo * beat);
  }
  if (comand == "D3") {
    my_buzzer.tone(note_D3, tempo * beat);
  }
  if (comand == "D#3") {
    my_buzzer.tone(note_Eb3, tempo * beat);
  }
  if (comand == "F3") {
    my_buzzer.tone(note_F3, tempo * beat);
  }
  if (comand == "F#3") {
    my_buzzer.tone(note_Gb3, tempo * beat);
  }
  if (comand == "G3") {
    my_buzzer.tone(note_G3, tempo * beat);
  }
  if (comand == "G#3") {
    my_buzzer.tone(note_Ab3, tempo * beat);
  }
  if (comand == "A3") {
    my_buzzer.tone(note_G3, tempo * beat);
  }
  if (comand == "A#3") {
    my_buzzer.tone(note_Bb3, tempo * beat);
  }
  if (comand == "B3") {
    my_buzzer.tone(note_B3, tempo * beat);
  }
  if (comand == "C4") {
    my_buzzer.tone(note_C4, tempo * beat);
  }
  if (comand == "C#4") {
    my_buzzer.tone(note_Db4, tempo * beat);
  }
  if (comand == "D4") {
    my_buzzer.tone(note_D4, tempo * beat);
  }
  if (comand == "D#4") {
    my_buzzer.tone(note_Eb4, tempo * beat);
  }
  if (comand == "E4") {
    my_buzzer.tone(note_E4, tempo * beat);
  }
  if (comand == "F4") {
    my_buzzer.tone(note_F4, tempo * beat);
  }
  if (comand == "F#4") {
    my_buzzer.tone(note_Gb4, tempo * beat);
  }
  if (comand == "G4") {
    my_buzzer.tone(note_G4, tempo * beat);
  }
  if (comand == "G#4") {
    my_buzzer.tone(note_Ab4, tempo * beat);
  }
  if (comand == "A4") {
    my_buzzer.tone(note_A4, tempo * beat);
  }
  if (comand == "A#4") {
    my_buzzer.tone(note_Bb4, tempo * beat);
  }
  if (comand == "B4") {
    my_buzzer.tone(note_B4, tempo * beat);
  }
  if (comand == "C5") {
    my_buzzer.tone(note_C5, tempo * beat);
  }
  if (comand == "C#5") {
    my_buzzer.tone(note_Db5, tempo * beat);
  }
  if (comand == "D5") {
    my_buzzer.tone(note_D5, tempo * beat);
  }
  if (comand == "D#5") {
    my_buzzer.tone(note_Eb5, tempo * beat);
  }
  if (comand == "E5") {
    my_buzzer.tone(note_E5, tempo * beat);
  }
  if (comand == "F5") {
    my_buzzer.tone(note_F5, tempo * beat);
  }
  if (comand == "F#5") {
    my_buzzer.tone(note_Gb5, tempo * beat);
  }
  if (comand == "G5") {
    my_buzzer.tone(note_G5, tempo * beat);
  }
  if (comand == "G#5") {
    my_buzzer.tone(note_Ab5, tempo * beat);
  }
  if (comand == "A5") {
    my_buzzer.tone(note_A5, tempo * beat);
  }
  if (comand == "A#5") {
    my_buzzer.tone(note_Bb5, tempo * beat);
  }
  if (comand == "B5") {
    my_buzzer.tone(note_B5, tempo * beat);
  }
  if (comand == "connection") {
    my_buzzer.playRingtone(R_connection);
  }
  if (comand == "disconnection") {
    my_buzzer.playRingtone(R_disconnection);
  }
  if (comand == "didi") {
    my_buzzer.playRingtone(R_buttonPushed);
  }
  if (comand == "mode1") {
    my_buzzer.playRingtone(R_mode1);
  }
  if (comand == "mode2") {
    my_buzzer.playRingtone(R_mode2);
  }
  if (comand == "mode3") {
    my_buzzer.playRingtone(R_mode3);
  }
  if (comand == "surprise") {
    my_buzzer.playRingtone(R_surprise);
  }
  if (comand == "OhOoh") {
    my_buzzer.playRingtone(R_OhOoh);
  }
  if (comand == "OhOoh2") {
    my_buzzer.playRingtone(R_OhOoh2);
  }
  if (comand == "cuddly") {
    my_buzzer.playRingtone(R_cuddly);
  }
  if (comand == "sleeping") {
    my_buzzer.playRingtone(R_sleeping);
  }
  if (comand == "happy") {
    my_buzzer.playRingtone(R_happy);
  }
  if (comand == "super happy") {
    my_buzzer.playRingtone(R_superHappy);
  }
  if (comand == "happy short") {
    my_buzzer.playRingtone(R_happy_short);
  }
  if (comand == "sad") {
    my_buzzer.playRingtone(R_sad);
  }
  if (comand == "confused") {
    my_buzzer.playRingtone(R_confused);
  }
  if (comand == "fart1") {
    my_buzzer.playRingtone(R_fart1);
  }
  if (comand == "fart2") {
    my_buzzer.playRingtone(R_fart2);
  }
  if (comand == "fart3") {
    my_buzzer.playRingtone(R_fart3);
  }
}