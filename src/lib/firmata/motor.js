class Motor {
    constructor(_firmata, pin1, pin2, pwm) {
        this._firmata = _firmata;
        this.pin1 = pin1;
        this.pin2 = pin2;
        this.pwm = pwm;
        this._firmata.pinMode(pin1, this._firmata.MODES.OUTPUT);
        this._firmata.pinMode(pin2, this._firmata.MODES.OUTPUT);
        this._firmata.pinMode(this.pwm, this._firmata.MODES.PWM);
    }

    forward(speed) {
        this._firmata.pwmWrite(this.pwm, speed);
        this._firmata.digitalWrite(this.pin1, 1);
        this._firmata.digitalWrite(this.pin2, 0);
    }

    backward(speed) {
        this._firmata.pwmWrite(this.pwm, speed);
        this._firmata.digitalWrite(this.pin1, 0);
        this._firmata.digitalWrite(this.pin2, 1);
    }

    stop() {
        this._firmata.digitalWrite(this.pin1, 0);
        this._firmata.digitalWrite(this.pin2, 0);
        this._firmata.analogWrite(this.pwm, 0);
    }

    brake() {
        this._firmata.digitalWrite(this.pin1, 1);
        this._firmata.digitalWrite(this.pin2, 1);
        this._firmata.analogWrite(this.pwm, 0);
    }

    release() {
        this._firmata.digitalWrite(this.pin1, 0);
        this._firmata.digitalWrite(this.pin2, 0);
        this._firmata.analogWrite(this.pwm, 0);
    }
}

module.exports = Motor;
