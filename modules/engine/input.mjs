const pressed_keys = {}

export function _keyboard_listen() {
    document.addEventListener("keydown", event => pressed_keys[event.code] = true);
    document.addEventListener("keyup", event => pressed_keys[event.code] = false);
}

export const down = (code) => pressed_keys[code] === true
