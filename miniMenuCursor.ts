
namespace miniMenu {
    
    /**
     * an array of all menu sprites
     */
    //% block="all menus"
    //% blockId="menu_cursor_all_menus"
    //% group="Cursor"
    export function allMenus() { // so that I can get the menus even when their sprite type is changed
        return miniMenu._state().sprites
    }
    
    /**
     * place inside the Browser Events 'On Mouse Move' block with X and Y dragged inside
     */
    //% block="update menu position to cursor $x $y"
    //% blockId="menu_cursor_update_position"
    //% group="Cursor"
    //% weight=5
    export function updateMenuPosition(x: number, y: number) {
        for (let menu of allMenus()) {
            if (!menu.buttonEventsEnabled) continue
            if (menu.left > x || menu.right < x) continue  
            if (menu.top - 12 > y || menu.bottom + 12 < y) continue // extra detected space above and below allows for easier scrolling

            let menuTop = menu.top
            if (menu.title) menuTop += 12
            if (menu.frame) menuTop += menu.frame.height / 3
            let posInMenu = Math.floor((y - menuTop + menu.yScroll) / 12)

            if (posInMenu > -1 && posInMenu < menu.items.length) {
                menu.selectedIndex = Math.constrain(posInMenu, 0, menu.items.length - 1)
            }
        }
    }

    /**
     * place inside the Browser Events 'On left Mouse Button clicked' block with X and Y dragged inside
     */
    //% block="click menu with $button at cursor position $x $y"
    //% blockId="menu_cursor_click_position"
    //% group="Cursor"
    //% weight=4
    export function clickMenuAtPosition(button: ControllerButton, x: number, y: number) {
        for (let menu of allMenus()) {
            if (!menu.buttonEventsEnabled) continue
            if (menu.left > x || menu.right < x) continue
            if (menu.top > y || menu.bottom < y) continue 

            let menuTop = menu.top
            if (menu.title) menuTop += 12
            if (menu.frame) menuTop += menu.frame.height / 3
            let posInMenu = Math.floor((y - menuTop + menu.yScroll) / 12)

            if (posInMenu >= 0 && posInMenu < menu.items.length) {
                menu.selectedIndex = posInMenu
                pressButton(button)
            }
        }
    }

    //% block="scroll menus up"
    //% blockId="menu_cursor_scroll_up"
    //% group="Cursor"
    //% weight=3
    export function scrollUp() {
        for (let menu of allMenus()) {
            if (!menu.buttonEventsEnabled) continue

            if (menu.selectedIndex > 0) {
                menu.selectedIndex--
            }
        }
    }

    //% block="scroll menus down"
    //% blockId="menu_cursor_scroll_down"
    //% group="Cursor"
    //% weight=2
    export function scrollDown() {
        for (let menu of allMenus()) {
            if (!menu.buttonEventsEnabled) continue

            if (menu.selectedIndex < menu.items.length - 1) {
                menu.selectedIndex++
            }
        }
    }

    //% block="simulate click of button $button"
    //% blockId="menu_cursor_simulate_click"
    //% group="Cursor"
    //% weight=0
    export function pressButton(button: ControllerButton) {
        control.raiseEvent(INTERNAL_KEY_DOWN, button)
        control.raiseEvent(INTERNAL_KEY_UP, button)
    }
}