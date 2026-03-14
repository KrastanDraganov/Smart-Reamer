#ifndef stepper_motor_h
#define stepper_motor_h

#include <stdint.h>
#include <math.h>

#define HIGH 1
#define LOW 0
#define OUTPUT 1
#define INPUT 0

class stepper_motor
{
public:
    typedef enum
    {
        FUNCTION  = 0,
        DRIVER    = 1,
        FULL2WIRE = 2,
        FULL3WIRE = 3,
        FULL4WIRE = 4,
        HALF3WIRE = 6,
        HALF4WIRE = 8
    } MotorInterfaceType;

    stepper_motor(uint8_t interface = stepper_motor::FULL4WIRE, uint8_t pin1 = 2, uint8_t pin2 = 3, uint8_t pin3 = 4, uint8_t pin4 = 5, bool enable = true);

    stepper_motor(void (*forward)(), void (*backward)());
    
    void    moveTo(long absolute); 
    void    move(long relative);
    bool    run();
    bool    runSpeed();
    void    setMaxSpeed(float speed);
    float   maxSpeed();
    void    setAcceleration(float acceleration);
    void    setSpeed(float speed);
    float   speed();
    long    distanceToGo();
    long    targetPosition();
    long    currentPosition();  
    void    setCurrentPosition(long position);  
    void    runToPosition();
    bool    runSpeedToPosition();
    void    runToNewPosition(long position);
    void    stop();
    virtual void    disableOutputs();
    virtual void    enableOutputs();
    void    setMinPulseWidth(unsigned int minWidth);
    void    setEnablePin(uint8_t enablePin = 0xff);
    void    setPinsInverted(bool directionInvert = false, bool stepInvert = false, bool enableInvert = false);
    void    setPinsInverted(bool pin1Invert, bool pin2Invert, bool pin3Invert, bool pin4Invert, bool enableInvert);
    bool    isRunning();

    void    setPin(uint8_t pin, uint8_t value);

protected:
    typedef enum
    {
        DIRECTION_CCW = 0,
        DIRECTION_CW  = 1
    } Direction;

    void           computeNewSpeed();
    virtual void   setOutputPins(uint8_t mask);
    virtual void   step(long step);
    virtual void   step0(long step);
    virtual void   step1(long step);
    virtual void   step2(long step);
    virtual void   step3(long step);
    virtual void   step4(long step);
    virtual void   step6(long step);
    virtual void   step8(long step);

    bool    _direction;

private:
    uint8_t        _interface;
    uint8_t        _pin[4];
    uint8_t        _pinInverted[4];
    long           _currentPos;
    long           _targetPos;
    float          _speed;
    float          _maxSpeed;
    float          _acceleration;
    float          _sqrt_twoa;
    unsigned long  _stepInterval;
    unsigned long  _lastStepTime;
    unsigned int   _minPulseWidth;
    bool           _enableInverted;
    uint8_t        _enablePin;
    void (*_forward)();
    void (*_backward)();
    long _n;
    float _c0;
    float _cn;
    float _cmin;

    static bool _gpio_initialized;
};

#endif
