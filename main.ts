function get_angle (target_text: string, pitch_text: string, current_angle: number) {
    temp_num1 = current_angle
    temp_num2 = parseFloat(pitch_text)
    temp_num3 = parseFloat(target_text)
    if (temp_num2 == 0) {
        temp_num1 = temp_num3
        play_counter += -1
    } else if (temp_num3 >= temp_num1) {
        temp_num1 += temp_num2
        if (temp_num1 >= temp_num3) {
            temp_num1 = temp_num3
            play_counter += -1
        }
    } else {
        temp_num1 += 0 - temp_num2
        if (temp_num1 <= temp_num3) {
            temp_num1 = temp_num3
            play_counter += -1
        }
    }
    return temp_num1
}
function set_leg (right_target_text: string, left_target_text: string, right_pitch_text: string, left_pitch_text: string) {
    leg_right_angle = get_angle(right_target_text, right_pitch_text, leg_right_angle)
    kitronik_i2c_16_servo.servoWrite(kitronik_i2c_16_servo.Servos.Servo3, leg_right_angle + (leg_right_angle_init - 90))
    leg_left_angle = get_angle(left_target_text, left_pitch_text, leg_left_angle)
    kitronik_i2c_16_servo.servoWrite(kitronik_i2c_16_servo.Servos.Servo1, leg_left_angle + (leg_left_angle_init - 90))
}
bluetooth.onBluetoothConnected(function () {
    basic.showIcon(IconNames.Square)
})
bluetooth.onBluetoothDisconnected(function () {
    basic.showIcon(IconNames.No)
})
function play () {
    if (play_pointer < list.length) {
        play_cmd = list[play_pointer].split(",")
        if (play_cmd.length == 5) {
            play_counter = 2
            if (play_cmd[0] == "l") {
                set_leg(play_cmd[1], play_cmd[2], play_cmd[3], play_cmd[4])
            } else if (play_cmd[0] == "f") {
                set_foot(play_cmd[1], play_cmd[2], play_cmd[3], play_cmd[4])
            }
            if (play_counter == 0) {
                play_pointer += 1
            }
        }
    } else {
        play_mode = "off"
    }
}
bluetooth.onUartDataReceived(serial.delimiters(Delimiters.NewLine), function () {
    line = bluetooth.uartReadUntil(serial.delimiters(Delimiters.NewLine))
    cmd_request = ""
    temp_ble_num1 = 0
    for (let index = 0; index < cmd_str.length; index++) {
        temp_ble_str1 = cmd_str[temp_ble_num1]
        if (line == temp_ble_str1) {
            cmd_request = temp_ble_str1
        }
        temp_ble_num1 += 1
    }
    if (line == "list") {
        temp_ble_num1 = 0
        temp_ble_num2 = 0
        bluetooth.uartWriteLine("lstart")
        for (let index = 0; index < cmd_str.length; index++) {
            bluetooth.uartWriteLine("c" + ":" + cmd_str[temp_ble_num1])
            for (let index = 0; index < cmd_len[temp_ble_num1]; index++) {
                bluetooth.uartWriteLine(cmd_list[temp_ble_num2])
                temp_ble_num2 += 1
            }
            temp_ble_num1 += 1
        }
        bluetooth.uartWriteLine("lend")
    } else if (line == "clear") {
        cmd_str = []
        cmd_len = []
        cmd_list = []
        bluetooth.uartWriteLine("c-ok")
    }
    cmd = line.split(":")
    temp_ble_str1 = cmd[0]
    if (temp_ble_str1 == "c") {
        cmd_str.push(cmd[1])
        cmd_len.push(0)
    } else if (temp_ble_str1 == "s") {
        cmd_list.push(cmd[1])
        temp_ble_num1 = cmd_len.length - 1
        temp_ble_num2 = cmd_len[temp_ble_num1] + 1
        cmd_len[temp_ble_num1] = temp_ble_num2
    }
})
function play_set (cmd: string) {
    list = []
    temp_num1 = 0
    temp_num2 = 0
    for (let index = 0; index < cmd_str.length; index++) {
        if (cmd == cmd_str[temp_num1]) {
            for (let index = 0; index < cmd_len[temp_num1]; index++) {
                list.push(cmd_list[temp_num2])
                temp_num2 += 1
            }
            play_pointer = 0
            play_counter = 0
            play_mode = "on"
        } else {
            temp_num2 += cmd_len[temp_num1]
        }
        temp_num1 += 1
    }
}
function set_foot (right_target_text: string, left_target_text: string, right_pitch_text: string, left_pitch_text: string) {
    foot_right_angle = get_angle(right_target_text, right_pitch_text, foot_right_angle)
    kitronik_i2c_16_servo.servoWrite(kitronik_i2c_16_servo.Servos.Servo4, foot_right_angle + (foot_right_angle_init - 90))
    foot_left_angle = get_angle(left_target_text, left_pitch_text, foot_left_angle)
    kitronik_i2c_16_servo.servoWrite(kitronik_i2c_16_servo.Servos.Servo2, foot_left_angle + (foot_left_angle_init - 90))
}
function cmd_default () {
    cmd_str = [
    "forward",
    "backward",
    "right",
    "left"
    ]
    cmd_len = [
    6,
    6,
    6,
    6
    ]
    cmd_list = [
    "f,122,106,4,2",
    "l,110,110,2,2",
    "f,90,90,4,2",
    "f,74,58,2,4",
    "l,90,90,2,2",
    "f,90,90,2,4",
    "f,122,106,4,2",
    "l,70,70,2,2",
    "f,90,90,4,2",
    "f,74,58,2,4",
    "l,90,90,2,2",
    "f,90,90,2,4",
    "f,122,106,4,2",
    "l,100,80,2,2",
    "f,90,90,4,2",
    "f,74,58,2,4",
    "l,90,90,2,2",
    "f,90,90,2,4",
    "f,122,106,4,2",
    "l,80,100,2,2",
    "f,90,90,4,2",
    "f,74,58,2,4",
    "l,90,90,2,2",
    "f,90,90,2,4"
    ]
}
let foot_left_angle = 0
let foot_right_angle = 0
let cmd: string[] = []
let cmd_list: string[] = []
let cmd_len: number[] = []
let temp_ble_num2 = 0
let temp_ble_str1 = ""
let cmd_str: string[] = []
let temp_ble_num1 = 0
let cmd_request = ""
let line = ""
let play_mode = ""
let play_cmd: string[] = []
let list: string[] = []
let play_pointer = 0
let leg_left_angle = 0
let leg_right_angle = 0
let play_counter = 0
let temp_num3 = 0
let temp_num2 = 0
let temp_num1 = 0
let foot_right_angle_init = 0
let leg_right_angle_init = 0
let foot_left_angle_init = 0
let leg_left_angle_init = 0
basic.showIcon(IconNames.House)
bluetooth.startUartService()
leg_left_angle_init = 96
foot_left_angle_init = 86
leg_right_angle_init = 88
foot_right_angle_init = 95
set_leg("90", "90", "0", "0")
set_foot("90", "90", "0", "0")
cmd_default()
loops.everyInterval(50, function () {
    if (play_mode == "on") {
        play()
    } else {
        play_set(cmd_request)
    }
})
